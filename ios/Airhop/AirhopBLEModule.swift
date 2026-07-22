// AirhopBLEModule: dual-role BLE GATT server + central for Airhop mesh.
//
// This module does exactly four things and nothing else:
//   1. Advertise as a GATT Peripheral with the Airhop service UUID.
//   2. Scan as a GATT Central for peers advertising the same UUID.
//   3. Accept incoming writes from connected peers and emit them to TypeScript.
//   4. Write raw bytes from TypeScript to connected peers.
//
// Protocol logic (routing, TTL, deduplication, signing) lives entirely in
// TypeScript (src/core/). This file has no knowledge of packet types.
import CoreBluetooth
import Foundation
import React

// MARK: - Constants

private enum BLEConst {
    // mainnet UUIDs per PROTOCOLS.md - must never change without a version bump
    static let serviceUUID         = CBUUID(string: "F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C")
    static let characteristicUUID  = CBUUID(string: "A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D")

    // State restoration identifiers - required for background BLE operation
    static let centralRestorationKey    = "airhop.ble.central"
    static let peripheralRestorationKey = "airhop.ble.peripheral"

    // Maximum write size per BLE packet (ATT MTU - ATT overhead)
    static let maxWriteSize = 512

    // RSSI poll interval
    static let rssiIntervalSec: TimeInterval = 5.0
}

// MARK: - Events

private enum BLEEvent {
    static let packetReceived      = "AirhopBLE.packetReceived"
    static let linkConnected       = "AirhopBLE.linkConnected"
    static let linkDisconnected    = "AirhopBLE.linkDisconnected"
    static let rssiUpdated         = "AirhopBLE.rssiUpdated"
    static let adapterStateChanged = "AirhopBLE.adapterStateChanged"
}

// MARK: - Module

@objc(AirhopBLEModule)
final class AirhopBLEModule: RCTEventEmitter {

    // MARK: State

    private var centralManager:    CBCentralManager?
    private var peripheralManager: CBPeripheralManager?
    private var characteristic:    CBMutableCharacteristic?

    // linkID -> CBPeripheral (central role connections to remote peripherals).
    // Populated at DISCOVERY time, not connect time: CoreBluetooth abandons a
    // connection attempt if the CBPeripheral is deallocated, and `connect(_:)`
    // does not retain it for us.
    private var centralLinks:    [String: CBPeripheral]   = [:]
    // Central links whose characteristic is discovered and notifying, i.e. the
    // only ones that can actually carry a write. Retained-but-not-ready links
    // live in centralLinks without appearing here.
    private var readyCentralLinks: Set<String>            = []
    // linkID -> CBCentral (peripheral role connections from remote centrals)
    private var peripheralLinks: [String: CBCentral]      = [:]

    private var rssiTimers: [String: Timer] = [:]
    // Notifies that updateValue() refused because the transmit queue was full.
    // Flushed from peripheralManagerIsReady(toUpdateSubscribers:); without this
    // every fragment dropped under load would silently vanish mid-transfer.
    private var pendingNotifies: [(data: Data, central: CBCentral)] = []

    private var advertisingLocalName: String = "bitchat-airhop"
    private var isAdvertising = false
    private var isScanning    = false

    private let queue = DispatchQueue(label: "airhop.ble", qos: .userInitiated)

    // MARK: RCTEventEmitter

    override static func requiresMainQueueSetup() -> Bool { false }

    override func supportedEvents() -> [String]! {
        [
            BLEEvent.packetReceived,
            BLEEvent.linkConnected,
            BLEEvent.linkDisconnected,
            BLEEvent.rssiUpdated,
            BLEEvent.adapterStateChanged,
        ]
    }

    // MARK: Peripheral (advertising)

    @objc
    func startAdvertising(_ serviceUUID: String,
                          localName: String,
                          resolver resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {
        queue.async { [weak self] in
            guard let self else { return }
            self.advertisingLocalName = localName
            self.peripheralManager = CBPeripheralManager(
                delegate: self,
                queue: self.queue,
                options: [CBPeripheralManagerOptionRestoreIdentifierKey: BLEConst.peripheralRestorationKey]
            )
            // Advertising starts in peripheralManagerDidUpdateState when powered on.
            resolve(nil)
        }
    }

    @objc
    func stopAdvertising(_ resolve: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
        queue.async { [weak self] in
            self?.peripheralManager?.stopAdvertising()
            self?.isAdvertising = false
            resolve(nil)
        }
    }

    // MARK: Central (scanning)

    @objc
    func startScanning(_ serviceUUIDs: [String],
                       resolver resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
        queue.async { [weak self] in
            guard let self else { return }
            self.centralManager = CBCentralManager(
                delegate: self,
                queue: self.queue,
                options: [CBCentralManagerOptionRestoreIdentifierKey: BLEConst.centralRestorationKey]
            )
            // Scanning starts in centralManagerDidUpdateState when powered on.
            resolve(nil)
        }
    }

    @objc
    func stopScanning(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        queue.async { [weak self] in
            self?.centralManager?.stopScan()
            self?.isScanning = false
            resolve(nil)
        }
    }

    // MARK: I/O

    @objc
    func writeToLink(_ linkID: String,
                     dataBase64: String,
                     resolver resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
        queue.async { [weak self] in
            guard let self,
                  let data = Data(base64Encoded: dataBase64) else {
                reject("INVALID_DATA", "Invalid base64 payload", nil)
                return
            }

            // Central role: write to a remote peripheral's characteristic
            if let peripheral = self.centralLinks[linkID] {
                guard self.readyCentralLinks.contains(linkID),
                      let characteristic = self.discoverCharacteristic(on: peripheral) else {
                    reject("NOT_READY", "Link \(linkID) is not notifying yet", nil)
                    return
                }
                // A .withoutResponse write larger than the negotiated limit is
                // silently DISCARDED by CoreBluetooth. Mesh fragments are 469 B
                // and the unacknowledged limit is often smaller, so fall back to
                // an acknowledged write rather than losing the packet.
                let maxUnacked = peripheral.maximumWriteValueLength(for: .withoutResponse)
                let writeType: CBCharacteristicWriteType = data.count <= maxUnacked ? .withoutResponse : .withResponse
                peripheral.writeValue(data, for: characteristic, type: writeType)
                resolve(nil)
                return
            }

            // Peripheral role: notify ONLY this link's central. Passing nil here
            // would fan the packet out to every subscribed central, and a unicast DM
            // would leak to unrelated peers and waste airtime.
            if let central = self.peripheralLinks[linkID],
               let char = self.characteristic {
                let ok = self.peripheralManager?.updateValue(data, for: char, onSubscribedCentrals: [central]) ?? false
                if ok {
                    resolve(nil)
                } else {
                    // Transmit queue full: hold the packet and flush it when
                    // CoreBluetooth signals readiness instead of dropping it.
                    self.pendingNotifies.append((data: data, central: central))
                    resolve(nil)
                }
                return
            }

            reject("UNKNOWN_LINK", "No active link with ID \(linkID)", nil)
        }
    }

    // MARK: Tor proxy detection

    // Probe whether a SOCKS5 proxy is reachable at localhost:port.
    // Resolves with the port if reachable, 0 if not. Runs off the main queue.
    // On iOS, Orbot (if installed and active) exposes a SOCKS5 proxy on port 9050.
    // Full Arti (embedded Tor) integration requires adding the Arti xcframework
    // as a Swift Package dependency (see bitchat/ios/Package.swift for reference).
    @objc
    func getTorProxyPort(_ resolve: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
        let port = 9050
        DispatchQueue.global(qos: .utility).async {
            let host = CFHostCreateWithName(nil, "127.0.0.1" as CFString).takeRetainedValue()
            var ctx = CFStreamClientContext()
            var readStream:  Unmanaged<CFReadStream>?
            var writeStream: Unmanaged<CFWriteStream>?
            CFStreamCreatePairWithSocketToHost(nil, "127.0.0.1" as CFString, UInt32(port),
                                               &readStream, &writeStream)
            guard let read = readStream?.takeRetainedValue(),
                  let write = writeStream?.takeRetainedValue() else {
                resolve(0)
                return
            }
            CFReadStreamOpen(read)
            CFWriteStreamOpen(write)
            // Give the connection 500 ms to open
            let deadline = CFAbsoluteTimeGetCurrent() + 0.5
            while CFAbsoluteTimeGetCurrent() < deadline {
                let rs = CFReadStreamGetStatus(read)
                let ws = CFWriteStreamGetStatus(write)
                if rs == .open && ws == .open {
                    CFReadStreamClose(read)
                    CFWriteStreamClose(write)
                    resolve(port)
                    return
                }
                if rs == .error || ws == .error { break }
                Thread.sleep(forTimeInterval: 0.02)
            }
            CFReadStreamClose(read)
            CFWriteStreamClose(write)
            resolve(0)
        }
    }

    // Helper: find the cached characteristic for a connected peripheral
    private func discoverCharacteristic(on peripheral: CBPeripheral) -> CBCharacteristic? {
        return peripheral.services?
            .first(where: { $0.uuid == BLEConst.serviceUUID })?
            .characteristics?
            .first(where: { $0.uuid == BLEConst.characteristicUUID })
    }

    // MARK: Link ID helpers

    private func centralLinkID(for peripheral: CBPeripheral) -> String {
        return "c:\(peripheral.identifier.uuidString)"
    }

    private func peripheralLinkID(for central: CBCentral) -> String {
        return "p:\(central.identifier.uuidString)"
    }
}

// MARK: - CBCentralManagerDelegate

extension AirhopBLEModule: CBCentralManagerDelegate {

    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        // Report the radio state to JS. Without this the UI cannot distinguish
        // "Bluetooth is off" from "nobody nearby". Both render as an empty
        // mesh, which a user has no way to diagnose.
        sendEvent(withName: BLEEvent.adapterStateChanged,
                  body: ["enabled": central.state == .poweredOn])

        guard central.state == .poweredOn else {
            isScanning = false
            return
        }
        if isScanning { return }
        isScanning = true
        central.scanForPeripherals(
            withServices: [BLEConst.serviceUUID],
            options: [CBCentralManagerScanOptionAllowDuplicatesKey: false]
        )
    }

    func centralManager(_ central: CBCentralManager,
                        didDiscover peripheral: CBPeripheral,
                        advertisementData: [String: Any],
                        rssi RSSI: NSNumber) {
        let linkID = centralLinkID(for: peripheral)
        guard centralLinks[linkID] == nil else { return }
        // Retain BEFORE connecting. CoreBluetooth does not hold a strong
        // reference during the attempt, so a peripheral that is only referenced
        // locally gets deallocated and the connection silently never completes.
        peripheral.delegate = self
        centralLinks[linkID] = peripheral
        central.connect(peripheral, options: nil)
    }

    func centralManager(_ central: CBCentralManager,
                        didConnect peripheral: CBPeripheral) {
        let linkID = centralLinkID(for: peripheral)
        centralLinks[linkID] = peripheral
        // linkConnected is deliberately NOT emitted here: the characteristic is
        // not discovered yet, so any write JS makes in response would fail. It
        // is emitted from didUpdateNotificationStateFor once the link can
        // actually carry traffic (mirrors the Android CCCD-confirmed gating).
        peripheral.discoverServices([BLEConst.serviceUUID])

        // Start periodic RSSI polling
        let timer = Timer.scheduledTimer(withTimeInterval: BLEConst.rssiIntervalSec, repeats: true) { [weak peripheral] _ in
            peripheral?.readRSSI()
        }
        rssiTimers[linkID] = timer
    }

    func centralManager(_ central: CBCentralManager,
                        didFailToConnect peripheral: CBPeripheral,
                        error: Error?) {
        // Release the retain so a later advertisement can retry this peer.
        let linkID = centralLinkID(for: peripheral)
        centralLinks.removeValue(forKey: linkID)
        readyCentralLinks.remove(linkID)
    }

    func centralManager(_ central: CBCentralManager,
                        didDisconnectPeripheral peripheral: CBPeripheral,
                        error: Error?) {
        let linkID = centralLinkID(for: peripheral)
        centralLinks.removeValue(forKey: linkID)
        readyCentralLinks.remove(linkID)
        rssiTimers[linkID]?.invalidate()
        rssiTimers.removeValue(forKey: linkID)
        sendEvent(withName: BLEEvent.linkDisconnected, body: ["linkID": linkID])
    }

    func centralManager(_ central: CBCentralManager,
                        willRestoreState dict: [String: Any]) {
        if let peripherals = dict[CBCentralManagerRestoredStatePeripheralsKey] as? [CBPeripheral] {
            for peripheral in peripherals {
                peripheral.delegate = self
                centralLinks[centralLinkID(for: peripheral)] = peripheral
            }
        }
    }
}

// MARK: - CBPeripheralDelegate

extension AirhopBLEModule: CBPeripheralDelegate {

    func peripheral(_ peripheral: CBPeripheral,
                    didDiscoverServices error: Error?) {
        guard error == nil else { return }
        peripheral.services?.forEach { service in
            if service.uuid == BLEConst.serviceUUID {
                peripheral.discoverCharacteristics([BLEConst.characteristicUUID], for: service)
            }
        }
    }

    func peripheral(_ peripheral: CBPeripheral,
                    didDiscoverCharacteristicsFor service: CBService,
                    error: Error?) {
        guard error == nil else { return }
        service.characteristics?.forEach { char in
            if char.uuid == BLEConst.characteristicUUID {
                peripheral.setNotifyValue(true, for: char)
            }
        }
    }

    // Notifications are live on this link: only now can it carry traffic, so
    // this is where the link is announced to JS.
    func peripheral(_ peripheral: CBPeripheral,
                    didUpdateNotificationStateFor characteristic: CBCharacteristic,
                    error: Error?) {
        guard characteristic.uuid == BLEConst.characteristicUUID else { return }
        let linkID = centralLinkID(for: peripheral)

        guard error == nil, characteristic.isNotifying else {
            // Subscription failed: the link cannot receive, so tear it down
            // rather than leaving a half-open connection that looks healthy.
            readyCentralLinks.remove(linkID)
            centralManager?.cancelPeripheralConnection(peripheral)
            return
        }

        guard !readyCentralLinks.contains(linkID) else { return }
        readyCentralLinks.insert(linkID)
        sendEvent(withName: BLEEvent.linkConnected,
                  body: ["linkID": linkID, "role": "central", "rssi": -99])
    }

    func peripheral(_ peripheral: CBPeripheral,
                    didUpdateValueFor characteristic: CBCharacteristic,
                    error: Error?) {
        guard error == nil,
              characteristic.uuid == BLEConst.characteristicUUID,
              let data = characteristic.value else { return }

        let linkID = centralLinkID(for: peripheral)
        sendEvent(withName: BLEEvent.packetReceived,
                  body: ["linkID": linkID, "dataBase64": data.base64EncodedString()])
    }

    // Modern RSSI callback. The old peripheralDidUpdateRSSI(_:error:) pairs with
    // the deprecated `peripheral.rssi` property and never fired here, so signal
    // strength was permanently unavailable to the UI.
    func peripheral(_ peripheral: CBPeripheral,
                    didReadRSSI RSSI: NSNumber,
                    error: Error?) {
        guard error == nil else { return }
        let linkID = centralLinkID(for: peripheral)
        sendEvent(withName: BLEEvent.rssiUpdated,
                  body: ["linkID": linkID, "rssi": RSSI.intValue])
    }
}

// MARK: - CBPeripheralManagerDelegate

extension AirhopBLEModule: CBPeripheralManagerDelegate {

    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        guard peripheral.state == .poweredOn else { return }
        if isAdvertising { return }

        // Set up the GATT service and characteristic
        let char = CBMutableCharacteristic(
            type: BLEConst.characteristicUUID,
            properties: [.read, .write, .writeWithoutResponse, .notify],
            value: nil,
            permissions: [.readable, .writeable]
        )
        self.characteristic = char

        let service = CBMutableService(type: BLEConst.serviceUUID, primary: true)
        service.characteristics = [char]
        peripheral.add(service)
    }

    func peripheralManager(_ peripheral: CBPeripheralManager,
                           didAdd service: CBService,
                           error: Error?) {
        guard error == nil else { return }
        isAdvertising = true
        peripheral.startAdvertising([
            CBAdvertisementDataServiceUUIDsKey: [BLEConst.serviceUUID],
            CBAdvertisementDataLocalNameKey:    advertisingLocalName,
        ])
    }

    func peripheralManager(_ peripheral: CBPeripheralManager,
                           central: CBCentral,
                           didSubscribeTo characteristic: CBCharacteristic) {
        let linkID = peripheralLinkID(for: central)
        peripheralLinks[linkID] = central
        sendEvent(withName: BLEEvent.linkConnected,
                  body: ["linkID": linkID, "role": "peripheral", "rssi": -99])
    }

    func peripheralManager(_ peripheral: CBPeripheralManager,
                           central: CBCentral,
                           didUnsubscribeFrom characteristic: CBCharacteristic) {
        let linkID = peripheralLinkID(for: central)
        peripheralLinks.removeValue(forKey: linkID)
        sendEvent(withName: BLEEvent.linkDisconnected, body: ["linkID": linkID])
    }

    func peripheralManager(_ peripheral: CBPeripheralManager,
                           didReceiveWrite requests: [CBATTRequest]) {
        // A remote central that writes before subscribing still needs a link
        // entry, otherwise its packets arrive under a linkID JS has never seen.
        for request in requests {
            guard request.characteristic.uuid == BLEConst.characteristicUUID,
                  let data = request.value else { continue }

            let linkID = peripheralLinkID(for: request.central)
            if peripheralLinks[linkID] == nil {
                peripheralLinks[linkID] = request.central
            }
            sendEvent(withName: BLEEvent.packetReceived,
                      body: ["linkID": linkID, "dataBase64": data.base64EncodedString()])
        }
        // respond() must be called on the FIRST request only, and only when
        // there is one, since indexing [0] on an empty array would crash.
        if let first = requests.first {
            peripheral.respond(to: first, withResult: .success)
        }
    }

    // CoreBluetooth drained its transmit queue: replay anything updateValue()
    // previously refused, preserving order. Stops at the first refusal so the
    // remaining items stay queued for the next readiness callback.
    func peripheralManagerIsReady(toUpdateSubscribers peripheral: CBPeripheralManager) {
        guard let char = characteristic else { return }
        while let next = pendingNotifies.first {
            let ok = peripheral.updateValue(next.data, for: char, onSubscribedCentrals: [next.central])
            if !ok { return }
            pendingNotifies.removeFirst()
        }
    }

    func peripheralManager(_ peripheral: CBPeripheralManager,
                           willRestoreState dict: [String: Any]) {
        if let services = dict[CBPeripheralManagerRestoredStateServicesKey] as? [CBMutableService] {
            for service in services {
                service.characteristics?.compactMap { $0 as? CBMutableCharacteristic }.forEach { char in
                    if char.uuid == BLEConst.characteristicUUID {
                        self.characteristic = char
                    }
                }
            }
        }
    }
}
