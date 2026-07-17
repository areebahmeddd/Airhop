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
    static let packetReceived    = "AirhopBLE.packetReceived"
    static let linkConnected     = "AirhopBLE.linkConnected"
    static let linkDisconnected  = "AirhopBLE.linkDisconnected"
    static let rssiUpdated       = "AirhopBLE.rssiUpdated"
}

// MARK: - Module

@objc(AirhopBLEModule)
final class AirhopBLEModule: RCTEventEmitter {

    // MARK: State

    private var centralManager:    CBCentralManager?
    private var peripheralManager: CBPeripheralManager?
    private var characteristic:    CBMutableCharacteristic?

    // linkID -> CBPeripheral (central role connections to remote peripherals)
    private var centralLinks:    [String: CBPeripheral]   = [:]
    // linkID -> CBCentral (peripheral role connections from remote centrals)
    private var peripheralLinks: [String: CBCentral]      = [:]

    private var rssiTimers: [String: Timer] = [:]
    private var pendingWrites: [String: (data: Data, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock)] = [:]

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
                guard let characteristic = self.discoverCharacteristic(on: peripheral) else {
                    reject("NO_CHARACTERISTIC", "Characteristic not found for link \(linkID)", nil)
                    return
                }
                peripheral.writeValue(data, for: characteristic, type: .withoutResponse)
                resolve(nil)
                return
            }

            // Peripheral role: update value and notify subscribed centrals
            if self.peripheralLinks[linkID] != nil,
               let char = self.characteristic {
                let ok = self.peripheralManager?.updateValue(data, for: char, onSubscribedCentrals: nil) ?? false
                if ok {
                    resolve(nil)
                } else {
                    reject("WRITE_FAILED", "Peripheral update queue full for link \(linkID)", nil)
                }
                return
            }

            reject("UNKNOWN_LINK", "No active link with ID \(linkID)", nil)
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
        guard central.state == .poweredOn else { return }
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
        peripheral.delegate = self
        central.connect(peripheral, options: nil)
    }

    func centralManager(_ central: CBCentralManager,
                        didConnect peripheral: CBPeripheral) {
        let linkID = centralLinkID(for: peripheral)
        centralLinks[linkID] = peripheral
        peripheral.discoverServices([BLEConst.serviceUUID])

        let rssi = peripheral.rssi?.intValue ?? -99
        sendEvent(withName: BLEEvent.linkConnected,
                  body: ["linkID": linkID, "role": "central", "rssi": rssi])

        // Start periodic RSSI polling
        let timer = Timer.scheduledTimer(withTimeInterval: BLEConst.rssiIntervalSec, repeats: true) { [weak peripheral, weak self] _ in
            peripheral?.readRSSI()
        }
        rssiTimers[linkID] = timer
    }

    func centralManager(_ central: CBCentralManager,
                        didDisconnectPeripheral peripheral: CBPeripheral,
                        error: Error?) {
        let linkID = centralLinkID(for: peripheral)
        centralLinks.removeValue(forKey: linkID)
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

    func peripheralDidUpdateRSSI(_ peripheral: CBPeripheral, error: Error?) {
        guard error == nil, let rssi = peripheral.rssi else { return }
        let linkID = centralLinkID(for: peripheral)
        sendEvent(withName: BLEEvent.rssiUpdated, body: ["linkID": linkID, "rssi": rssi.intValue])
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
        for request in requests {
            guard request.characteristic.uuid == BLEConst.characteristicUUID,
                  let data = request.value else { continue }

            let linkID = peripheralLinkID(for: request.central)
            sendEvent(withName: BLEEvent.packetReceived,
                      body: ["linkID": linkID, "dataBase64": data.base64EncodedString()])
        }
        peripheral.respond(to: requests[0], withResult: .success)
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
