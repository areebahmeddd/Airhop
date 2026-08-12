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

// The one queue every CoreBluetooth callback in this process arrives on.
enum AirhopBLEQueue {
    static let shared = DispatchQueue(label: "airhop.ble", qos: .userInitiated)
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
    // bitchat-ios TransportConfig.bleMaxCentralLinks.
    private static let maxCentralLinks = 6
    // Central links whose characteristic is discovered and notifying, i.e. the
    // only ones that can actually carry a write. Retained-but-not-ready links
    // live in centralLinks without appearing here.
    private var readyCentralLinks: Set<String>            = []
    // linkID -> CBCentral (peripheral role connections from remote centrals)
    private var peripheralLinks: [String: CBCentral]      = [:]

    // Per-link RSSI pollers.
    //
    // DispatchSourceTimer, not Timer. These are created from CoreBluetooth
    // delegate callbacks, which arrive on `queue` - a DispatchQueue with no run
    // loop - and Timer.scheduledTimer schedules onto the CURRENT run loop. There
    // isn't one, so every timer was created, retained, and never fired: signal
    // strength has never reached the UI on iOS. A dispatch timer needs no run
    // loop and fires on the queue CoreBluetooth expects to be called from.
    private var rssiTimers: [String: DispatchSourceTimer] = [:]
    // Notifies that updateValue() refused because the transmit queue was full.
    // Flushed from peripheralManagerIsReady(toUpdateSubscribers:); without this
    // every fragment dropped under load would silently vanish mid-transfer.
    private var pendingNotifies: [(data: Data, central: CBCentral)] = []

    // How many refused notifications may be held before the peripheral role
    // starts reporting WRITE_BUSY instead of accepting more.
    //
    // A fragment is at most one BLE frame (~469 bytes of payload), so the
    // ceiling is roughly 120 KiB: enough to ride out the bursts CoreBluetooth
    // routinely refuses mid-transfer, far short of letting one bad link consume
    // memory in proportion to how badly it is behaving.
    //
    // Global rather than per-central, deliberately. CoreBluetooth caps
    // simultaneous centrals in the single digits, so the worst case is one
    // struggling peer eating headroom its neighbours would rarely need at the
    // same moment - and the cost of getting that wrong is backpressure, which is
    // the correct response anyway. A per-central map would buy fairness nobody
    // can observe.
    private static let maxPendingNotifies = 256

    // What the app WANTS, kept apart from what CoreBluetooth is currently doing.
    //
    // These used to be a single pair of "isAdvertising"/"isScanning" flags that
    // tried to be both at once, and the confusion cost us the peripheral role
    // entirely: powering Bluetooth off left isAdvertising set to true, and on
    // the way back `if isAdvertising { return }` skipped rebuilding the service,
    // so the device stayed invisible to every peer until the app was force-quit.
    //
    // Intent survives a power cycle. Actual state never does - it is re-derived
    // from the manager's own state on every callback.
    private var wantScanning    = false
    private var wantAdvertising = false
    private var actuallyScanning    = false
    private var actuallyAdvertising = false
    // The service has been added to the peripheral manager and is ready to
    // advertise. Cleared on poweredOff, because CoreBluetooth discards it.
    private var serviceRegistered = false

    // Last value reported to JS, so an unchanged state is never sent twice.
    //
    // Previously every centralManagerDidUpdateState emitted adapterStateChanged;
    // the mesh read that as a radio change and restarted the radios; the restart
    // constructed a new CBCentralManager; that manager reported its state...
    // Fourteen central and fourteen peripheral managers were created in ten
    // seconds on an idle phone, each reusing the same restore identifier.
    private var lastReportedEnabled: Bool?

    // Shared, not per-instance: AirhopBLERestoration may create the managers
    // before this module exists, and both must deliver onto the same serial
    // queue or the handover is a data race.
    private let queue = AirhopBLEQueue.shared

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

    // Both managers are created exactly once, on first use, and kept for the
    // life of the process.
    //
    // They used to be constructed inside startScanning/startAdvertising, which
    // the mesh calls on every retry - so each retry allocated a fresh manager
    // against the same restore identifier, which CoreBluetooth treats as an
    // error, and abandoned the old one mid-connection.
    private func ensureCentralManager() -> CBCentralManager {
        if let existing = centralManager { return existing }
        // Adopt the manager the app delegate built on a restoration launch
        // rather than constructing a second against the same restore identifier.
        if let restored = AirhopBLERestoration.shared.takeCentral() {
            restored.delegate = self
            centralManager = restored
            // Must be retained: CoreBluetooth abandons a connection whose
            // CBPeripheral is deallocated.
            for peripheral in AirhopBLERestoration.shared.takeRestoredPeripherals() {
                peripheral.delegate = self
                centralLinks[centralLinkID(for: peripheral)] = peripheral
            }
            return restored
        }
        let manager = CBCentralManager(
            delegate: self,
            queue: queue,
            options: [CBCentralManagerOptionRestoreIdentifierKey: BLEConst.centralRestorationKey]
        )
        centralManager = manager
        return manager
    }

    private func ensurePeripheralManager() -> CBPeripheralManager {
        if let existing = peripheralManager { return existing }
        if let restored = AirhopBLERestoration.shared.takePeripheral() {
            restored.delegate = self
            peripheralManager = restored
            // Already registered by iOS, so adopting it stops applyState()
            // adding a duplicate.
            if let char = AirhopBLERestoration.shared.takeRestoredCharacteristic() {
                characteristic = char
                serviceRegistered = true
            }
            return restored
        }
        let manager = CBPeripheralManager(
            delegate: self,
            queue: queue,
            options: [CBPeripheralManagerOptionRestoreIdentifierKey: BLEConst.peripheralRestorationKey]
        )
        peripheralManager = manager
        return manager
    }

    // Reconcile CoreBluetooth with what the app wants.
    //
    // Every entry point - a JS call, a state callback, a service being added -
    // ends here rather than issuing commands of its own. That is what makes the
    // module idempotent: running it twice with nothing changed does nothing, so
    // no caller has to know what any other caller already did.
    //
    // Must be called on `queue`.
    private func applyState() {
        let centralReady = centralManager?.state == .poweredOn
        let peripheralReady = peripheralManager?.state == .poweredOn

        // Central role.
        if wantScanning, centralReady {
            if !actuallyScanning {
                centralManager?.scanForPeripherals(
                    withServices: [BLEConst.serviceUUID],
                    options: [CBCentralManagerScanOptionAllowDuplicatesKey: false]
                )
                actuallyScanning = true
            }
        } else if actuallyScanning {
            // Only issue stopScan while the radio is on. Once CoreBluetooth has
            // left poweredOn it rejects these calls as API misuse, and it has
            // already stopped scanning on our behalf.
            if centralReady { centralManager?.stopScan() }
            actuallyScanning = false
        }

        // Peripheral role.
        if wantAdvertising, peripheralReady {
            if !serviceRegistered {
                registerService()
            } else if !actuallyAdvertising {
                startAdvertisingNow()
            }
        } else if actuallyAdvertising {
            if peripheralReady { peripheralManager?.stopAdvertising() }
            actuallyAdvertising = false
        }
    }

    // Must be called on `queue`, with the peripheral manager powered on.
    private func registerService() {
        guard let manager = peripheralManager else { return }
        // Remove first so a rebuild after a power cycle cannot land on top of a
        // stale registration. Mirrors bitchat-ios (BLEService+LinkLayerPeripheralRole).
        manager.removeAllServices()

        let char = CBMutableCharacteristic(
            type: BLEConst.characteristicUUID,
            properties: [.read, .write, .writeWithoutResponse, .notify],
            value: nil,
            permissions: [.readable, .writeable]
        )
        characteristic = char

        let service = CBMutableService(type: BLEConst.serviceUUID, primary: true)
        service.characteristics = [char]
        manager.add(service)
        // serviceRegistered is set in didAdd, not here: until the service is
        // actually accepted there is nothing to advertise.
    }

    private func startAdvertisingNow() {
        guard let manager = peripheralManager, manager.state == .poweredOn else { return }
        // Service UUID only. The local name is deliberately NOT advertised.
        //
        // It used to carry this device's peer ID, and nothing ever read it:
        // the iOS central here dedups on the CBPeripheral identifier, and the
        // Android central reads the 8-byte peer ID out of scan-response service
        // data and never looks at the name. So it was a stable identifier
        // broadcast to every passive scanner in radio range, in exchange for
        // nothing.
        //
        // bitchat-ios reaches the same conclusion in BLERadioController
        // .advertisementData(), whose entire body is the service UUID under the
        // comment "No Local Name for privacy." Matching it costs the ability to
        // dedup an iPhone before connecting to it, which is a cost bitchat
        // already accepts and which the link reaper covers: a duplicate under a
        // rotated address is reclaimed by the 15s first-traffic deadline.
        //
        // The localName parameter stays on the bridge method. Android still
        // uses it, and the two platforms keep one signature.
        manager.startAdvertising([
            CBAdvertisementDataServiceUUIDsKey: [BLEConst.serviceUUID]
        ])
        actuallyAdvertising = true
    }

    @objc
    func startAdvertising(_ serviceUUID: String,
                          localName: String,
                          resolver resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {
        queue.async { [weak self] in
            guard let self else { return }
            // Accepted for signature parity with Android, unused here: this
            // platform advertises the service UUID alone. See startAdvertisingNow.
            _ = localName
            let manager = self.ensurePeripheralManager()

            // Refuse rather than resolve when we cannot advertise, so the caller
            // retries instead of believing the mesh is up.
            //
            // The latch is set per branch, not up front: applyState() runs on
            // every state change, so one left behind by a REFUSED start would
            // advertise once the radio returned with nothing having asked for
            // it. The transient states keep it because .unknown is the normal
            // cold-start answer. A mesh already running latched on .poweredOn,
            // so autonomous resume after a power cycle is unaffected.
            switch manager.state {
            case .poweredOn:
                self.wantAdvertising = true
                self.applyState()
                resolve(nil)
            case .resetting, .unknown:
                self.wantAdvertising = true
                reject("RADIO_OFF", "Bluetooth is not ready yet", nil)
            case .unauthorized:
                self.wantAdvertising = false
                reject("PERMISSION_DENIED", "Bluetooth permission was denied", nil)
            case .unsupported:
                self.wantAdvertising = false
                reject("UNSUPPORTED", "This device does not support Bluetooth LE", nil)
            case .poweredOff:
                self.wantAdvertising = false
                reject("RADIO_OFF", "Bluetooth is switched off", nil)
            @unknown default:
                self.wantAdvertising = false
                reject("RADIO_OFF", "Bluetooth is not ready yet", nil)
            }
        }
    }

    @objc
    func stopAdvertising(_ resolve: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
        queue.async { [weak self] in
            guard let self else { return }
            self.wantAdvertising = false
            self.applyState()
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
            let manager = self.ensureCentralManager()

            // Latched per branch, for the reason given in startAdvertising.
            switch manager.state {
            case .poweredOn:
                self.wantScanning = true
                self.applyState()
                resolve(nil)
            case .resetting, .unknown:
                self.wantScanning = true
                reject("RADIO_OFF", "Bluetooth is not ready yet", nil)
            case .unauthorized:
                self.wantScanning = false
                reject("PERMISSION_DENIED", "Bluetooth permission was denied", nil)
            case .unsupported:
                self.wantScanning = false
                reject("UNSUPPORTED", "This device does not support Bluetooth LE", nil)
            case .poweredOff:
                self.wantScanning = false
                reject("RADIO_OFF", "Bluetooth is switched off", nil)
            @unknown default:
                self.wantScanning = false
                reject("RADIO_OFF", "Bluetooth is not ready yet", nil)
            }
        }
    }

    @objc
    func stopScanning(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        queue.async { [weak self] in
            guard let self else { return }
            self.wantScanning = false
            self.applyState()
            resolve(nil)
        }
    }

    // Everything the device will tell us about whether BLE can run right now,
    // matching the Android module field for field.
    //
    // This replaces isAdapterEnabled(), which read `centralManager?.state` - and
    // the central manager was only constructed inside startScanning, which the
    // mesh calls AFTER asking. The answer was therefore false on every cold
    // launch regardless of the real radio, and the Mesh tab opened by announcing
    // "Bluetooth off · mesh unavailable" on a perfectly healthy iPhone.
    //
    // Constructing the manager here fixes that at the source: it is the same
    // single instance everything else uses, and asking about the radio is a
    // legitimate reason to bring it up. CBManager.authorization is a static
    // property and needs no manager at all, so a denied permission is reported
    // as denied rather than as an absent radio - the two send the user to
    // completely different places.
    @objc
    func getRadioState(_ resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
        queue.async { [weak self] in
            guard let self else {
                resolve([
                    "supported": false,
                    "poweredOn": false,
                    "authorization": "unknown",
                    "locationRequiredForScan": false,
                    "locationServicesEnabled": true,
                    // Present here as well as in the full answer below: the
                    // reconciler reads every field, and a missing one arrives in
                    // JS as undefined rather than as an error anyone would see.
                    "batteryPercent": -1,
                    "charging": false,
                ])
                return
            }
            let manager = self.ensureCentralManager()

            let authorization: String
            switch CBManager.authorization {
            case .allowedAlways:    authorization = "granted"
            // iOS never re-prompts once denied, so "denied" here is permanent
            // and maps to the blocked banner, whose only route out is Settings.
            case .denied:           authorization = "blocked"
            case .restricted:       authorization = "blocked"
            case .notDetermined:    authorization = "unknown"
            @unknown default:       authorization = "unknown"
            }

            // A .unknown manager state means CoreBluetooth has not reported yet,
            // which is not the same as unsupported - so `supported` stays true
            // until the platform actually says otherwise.
            resolve([
                "supported": manager.state != .unsupported,
                "poweredOn": manager.state == .poweredOn,
                "authorization": authorization,
                // Both are Android concerns. CoreBluetooth has no location
                // coupling to assert away, so there is nothing here for the
                // shared blocker logic to weigh: `locationRequiredForScan` false
                // is what stops it inventing a blocker that cannot apply on this
                // platform, and the toggle beside it is then never read.
                //
                // `preciseLocation` used to sit here too and is gone from the
                // contract: Android stopped needing it once BLUETOOTH_SCAN
                // asserted neverForLocation, and a fact only one platform ever
                // produced a meaningful value for is a fact worth deleting.
                "locationRequiredForScan": false,
                "locationServicesEnabled": true,
                // Android-only inputs to the power policy. CoreBluetooth
                // exposes no scan-rate control, so a battery reading here would
                // have nothing to drive; -1 tells the policy to leave the mode
                // alone rather than infer a flat battery.
                "batteryPercent": -1,
                "charging": false,
            ])
        }
    }

    // iOS has no API to turn the radio on from inside an app, by design. Resolve
    // false and let the caller fall back to opening Settings, rather than
    // pretending to offer something the platform will not do.
    @objc
    func requestEnableBluetooth(_ resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(false)
    }

    // Android-only; location never gates BLE scanning here.
    @objc
    func openLocationSettings(_ resolve: @escaping RCTPromiseResolveBlock,
                              rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(false)
    }

    // Android turns the scan rate, advertise rate, TX power and RSSI cadence
    // down together as the battery falls. CoreBluetooth offers none of those
    // knobs - it decides scan scheduling itself and already throttles background
    // BLE hard on the app's behalf - so there is nothing here to apply. Declared
    // so the shared reconciler has one code path rather than a platform branch,
    // and so a future duty-cycling policy has somewhere to land.
    @objc
    func setPowerMode(_ mode: String,
                      resolver resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(nil)
    }

    // Android runs a foreground service to survive backgrounding. On iOS the
    // equivalent is granted declaratively through UIBackgroundModes
    // (bluetooth-central / bluetooth-peripheral, already in Info.plist), so
    // there is nothing to start or stop - but the method exists so the shared
    // reconciler has one code path rather than a platform branch.
    @objc
    func setBackgroundServiceEnabled(_ enabled: Bool,
                                     resolver resolve: @escaping RCTPromiseResolveBlock,
                                     rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(nil)
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
                // CoreBluetooth also discards an unacknowledged write issued
                // while its transmit queue is full, and says so ONLY through
                // canSendWriteWithoutResponse. Reporting the refusal (as the
                // Android module already does) is what lets the fragment pacer
                // hold the chunk and offer it again; writing regardless is how a
                // file transfer reached 100% here while the far side sat on a
                // stream missing a fragment it can never ask for.
                if writeType == .withoutResponse && !peripheral.canSendWriteWithoutResponse {
                    reject("WRITE_BUSY", "BLE transmit queue full for link \(linkID)", nil)
                    return
                }
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
                    return
                }
                // Transmit queue full. Hold the packet and flush it when
                // CoreBluetooth signals readiness, rather than dropping a
                // fragment the far side can never reassemble without.
                //
                // Bounded, and this is the point. The queue used to be an
                // unbounded array that always reported success, so a congested
                // link during a large attachment grew it without limit while the
                // sender's pacer, seeing nothing but successes, kept pushing at
                // full speed. bitchat solves it the same way
                // (BLEOutboundNotificationBuffer, capped at
                // blePendingNotificationsCapCount): queue, because a brief burst
                // is better smoothed than bounced, but refuse once the buffer
                // says the link is not keeping up.
                //
                // WRITE_BUSY past the cap is the same code the central role
                // above returns and the same one Android returns, so the pacer
                // needs no per-platform branch: it backs off, which is exactly
                // what a full queue means.
                if self.pendingNotifies.count >= Self.maxPendingNotifies {
                    reject("WRITE_BUSY",
                           "Transmit queue full (\(self.pendingNotifies.count) held)",
                           nil)
                    return
                }
                self.pendingNotifies.append((data: data, central: central))
                resolve(nil)
                return
            }

            reject("UNKNOWN_LINK", "No active link with ID \(linkID)", nil)
        }
    }

    // MARK: Tor proxy detection

    // Always 0 on iOS, and that is the correct answer rather than a stub.
    //
    // This used to open a real socket to 127.0.0.1:9050, which is ORBOT's port.
    // Orbot does not exist on iOS, and Airhop's own Tor is Arti listening on
    // 39050, so the probe could only ever time out and report "nothing there"
    // after half a second of work. Its one caller (tor-routing's
    // probeAndroidTorProxy) is Android-gated, so the wrong answer was never
    // read - but a method that lies confidently when called is worse than one
    // that is honestly unavailable.
    //
    // iOS asks NativeAirhopTor.getTorStatus() instead, which reports Arti's real
    // bootstrap and SOCKS state. The method stays declared so the two platforms
    // keep one bridge contract, alongside the other documented iOS no-ops.
    @objc
    func getTorProxyPort(_ resolve: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(0)
    }

    // Android-only in practice: on Android the Tor toggle checks whether Orbot is
    // installed and a VPN transport is up before turning on. iOS routes Nostr
    // through in-app Arti (AirhopTorModule) and never consults this, so we resolve
    // both false to keep the cross-platform bridge contract mirrored.
    @objc
    func getTorAvailability(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(["orbotInstalled": false, "vpnActive": false])
    }

    // Android-only in practice, and no-ops here for a stronger reason than the
    // pair above: there is no VPN to watch. Arti runs in-process, so iOS learns
    // that Tor stopped from Arti itself (NativeAirhopTor.getTorStatus) rather
    // than by inferring it from a transport disappearing. Declared so the bridge
    // contract stays mirrored and JS needs no platform branch at the call site.
    @objc
    func startVpnWatch(_ resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(nil)
    }

    @objc
    func stopVpnWatch(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(nil)
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
        // Report only a CHANGE. Reporting every callback is what turned a state
        // update into a radio-restart into a new manager into another state
        // update - the loop that allocated fourteen managers in ten seconds.
        reportAdapterState(central.state == .poweredOn)

        switch central.state {
        case .poweredOn:
            // Links restored into a new process have no characteristic yet.
            // Without rediscovery they sit connected-but-unusable until the peer
            // gives up. Done here rather than in willRestoreState because
            // commands issued before poweredOn are dropped.
            for peripheral in centralLinks.values where peripheral.state == .connected {
                peripheral.discoverServices([BLEConst.serviceUUID])
            }
            applyState()

        case .poweredOff:
            // CoreBluetooth has already invalidated every peripheral we hold and
            // has left poweredOn, so issuing cancelPeripheralConnection now would
            // be rejected as API misuse. Retire the state locally instead, and
            // tell JS - which otherwise keeps addressing links that cannot carry
            // anything, and discovers it one silently discarded write at a time.
            retireAllCentralLinks()
            actuallyScanning = false

        case .unauthorized:
            // The user denied Bluetooth. Distinct from the radio being off, and
            // reported as such so the banner sends them to Settings rather than
            // to a Control Centre toggle that is already on.
            retireAllCentralLinks()
            actuallyScanning = false

        case .unsupported:
            actuallyScanning = false

        case .resetting:
            // The stack is restarting; another update follows. Treat it like a
            // power cycle so nothing is left addressing a dead link.
            retireAllCentralLinks()
            actuallyScanning = false

        case .unknown:
            break

        @unknown default:
            break
        }
    }

    // Emit an adapter change once, and only when it actually changed.
    private func reportAdapterState(_ enabled: Bool) {
        guard lastReportedEnabled != enabled else { return }
        lastReportedEnabled = enabled
        sendEvent(withName: BLEEvent.adapterStateChanged, body: ["enabled": enabled])
    }

    // Drop every central-role link and say so, so JS stops routing to peers that
    // are gone rather than learning it from failed writes.
    private func retireAllCentralLinks() {
        for linkID in centralLinks.keys {
            sendEvent(withName: BLEEvent.linkDisconnected, body: ["linkID": linkID])
        }
        centralLinks.removeAll()
        readyCentralLinks.removeAll()
        for timer in rssiTimers.values { timer.cancel() }
        rssiTimers.removeAll()
    }

    func centralManager(_ central: CBCentralManager,
                        didDiscover peripheral: CBPeripheral,
                        advertisementData: [String: Any],
                        rssi RSSI: NSNumber) {
        let linkID = centralLinkID(for: peripheral)
        guard centralLinks[linkID] == nil else { return }
        // Ceiling on simultaneous central-role links, matching bitchat-ios
        // TransportConfig.bleMaxCentralLinks. A phone in a crowded room that
        // dials every advertiser it sees exhausts the controller and thrashes;
        // flood routing reaches the rest of the room through the links it has.
        guard centralLinks.count < Self.maxCentralLinks else { return }
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

        // Start periodic RSSI polling. Replaces any poller left over from an
        // earlier connection to the same peripheral, so a reconnect cannot end
        // up with two timers reading the same link.
        rssiTimers[linkID]?.cancel()
        let timer = DispatchSource.makeTimerSource(queue: queue)
        timer.schedule(deadline: .now() + BLEConst.rssiIntervalSec,
                       repeating: BLEConst.rssiIntervalSec)
        timer.setEventHandler { [weak peripheral] in
            guard let peripheral, peripheral.state == .connected else { return }
            peripheral.readRSSI()
        }
        timer.resume()
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
        rssiTimers[linkID]?.cancel()
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

    // The method that used to make an iPhone invisible for the rest of its
    // session.
    //
    // It was `guard state == .poweredOn else { return }` followed by
    // `if isAdvertising { return }`. Powering Bluetooth off took the first
    // branch, so nothing was cleaned up and isAdvertising stayed true; powering
    // it back on took the second, so the service was never re-added and
    // advertising never restarted. Every state now does its own work, and the
    // decision about whether to advertise belongs to applyState().
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        switch peripheral.state {
        case .poweredOn:
            // CoreBluetooth discards registered services across a power cycle,
            // so the flag has to go with them or applyState() would advertise a
            // service that no longer exists.
            serviceRegistered = false
            actuallyAdvertising = false
            applyState()

        case .poweredOff:
            retireAllCentralSubscribers()
            serviceRegistered = false
            actuallyAdvertising = false
            characteristic = nil
            pendingNotifies.removeAll()

        case .unauthorized:
            retireAllCentralSubscribers()
            serviceRegistered = false
            actuallyAdvertising = false
            characteristic = nil
            pendingNotifies.removeAll()

        case .unsupported:
            actuallyAdvertising = false

        case .resetting:
            retireAllCentralSubscribers()
            serviceRegistered = false
            actuallyAdvertising = false
            characteristic = nil
            pendingNotifies.removeAll()

        case .unknown:
            break

        @unknown default:
            break
        }
    }

    // Subscribed centrals do not survive a power cycle, and a queued notify to
    // one of them would be delivered to nobody.
    private func retireAllCentralSubscribers() {
        for linkID in peripheralLinks.keys {
            sendEvent(withName: BLEEvent.linkDisconnected, body: ["linkID": linkID])
        }
        peripheralLinks.removeAll()
    }

    func peripheralManager(_ peripheral: CBPeripheralManager,
                           didAdd service: CBService,
                           error: Error?) {
        guard error == nil else {
            // The service was refused. Leave serviceRegistered false so the next
            // reconcile tries again rather than advertising nothing.
            serviceRegistered = false
            return
        }
        serviceRegistered = true
        applyState()
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
        // iOS relaunched us into a session that already has our service
        // registered. Adopt it rather than adding a duplicate: `serviceRegistered`
        // is what stops applyState() calling add() for a service CoreBluetooth is
        // already advertising on our behalf.
        if let services = dict[CBPeripheralManagerRestoredStateServicesKey] as? [CBMutableService] {
            for service in services where service.uuid == BLEConst.serviceUUID {
                service.characteristics?.compactMap { $0 as? CBMutableCharacteristic }.forEach { char in
                    if char.uuid == BLEConst.characteristicUUID {
                        self.characteristic = char
                        self.serviceRegistered = true
                    }
                }
            }
        }
    }
}

// MARK: - Launch-time state restoration

// Holds the CoreBluetooth managers between process start and this module
// existing.
//
// iOS relaunches a terminated app when a restorable BLE session sees an event,
// and expects the manager with the matching restore identifier to be recreated
// inside application(_:didFinishLaunchingWithOptions:). React Native cannot:
// the module is built by the bridge and its managers later still, on the first
// call from JS, by which point the restoration callback has been delivered to
// nobody.
//
// Constructing them at launch unconditionally is not an option either, since
// allocating a CBCentralManager raises the iOS Bluetooth prompt and every new
// user would meet it on the splash screen. So the app delegate calls prepare()
// only when launchOptions carries a Bluetooth restoration key, which happens
// only for an app that already had a live session and therefore already has the
// permission. First run never takes the branch.
//
// Everything here runs on AirhopBLEQueue.shared, so the handover needs no
// locking: prepare() is enqueued from didFinishLaunching and the take* calls
// later, and a serial queue preserves that order.
final class AirhopBLERestoration: NSObject {
    static let shared = AirhopBLERestoration()

    private var central: CBCentralManager?
    private var peripheral: CBPeripheralManager?
    private var restoredPeripherals: [CBPeripheral] = []
    private var restoredCharacteristic: CBMutableCharacteristic?

    // Deliberately no private init: NSObject is required for the CoreBluetooth
    // delegate protocols, and narrowing an inherited initializer's access is
    // not portable across Swift versions. Nothing else constructs this type.

    // Called from the app delegate, only on a restoration launch.
    func prepare() {
        AirhopBLEQueue.shared.async {
            if self.central == nil {
                self.central = CBCentralManager(
                    delegate: self,
                    queue: AirhopBLEQueue.shared,
                    options: [
                        CBCentralManagerOptionRestoreIdentifierKey:
                            BLEConst.centralRestorationKey
                    ]
                )
            }
            if self.peripheral == nil {
                self.peripheral = CBPeripheralManager(
                    delegate: self,
                    queue: AirhopBLEQueue.shared,
                    options: [
                        CBPeripheralManagerOptionRestoreIdentifierKey:
                            BLEConst.peripheralRestorationKey
                    ]
                )
            }
        }
    }

    // Hand ownership to the module and clear it here, so a second module (a dev
    // reload) builds its own rather than adopting ones whose delegate points at
    // a dead instance. Must be called on AirhopBLEQueue.shared.

    func takeCentral() -> CBCentralManager? {
        defer { central = nil }
        return central
    }

    func takePeripheral() -> CBPeripheralManager? {
        defer { peripheral = nil }
        return peripheral
    }

    func takeRestoredPeripherals() -> [CBPeripheral] {
        defer { restoredPeripherals = [] }
        return restoredPeripherals
    }

    func takeRestoredCharacteristic() -> CBMutableCharacteristic? {
        defer { restoredCharacteristic = nil }
        return restoredCharacteristic
    }
}

// Both delegates receive one callback each and buffer what it carries. The
// state callbacks are required by the protocols and do nothing: this type holds
// what arrived before anyone was listening, and answers nothing.
extension AirhopBLERestoration: CBCentralManagerDelegate {
    func centralManagerDidUpdateState(_ central: CBCentralManager) {}

    func centralManager(
        _ central: CBCentralManager,
        willRestoreState dict: [String: Any]
    ) {
        guard
            let peripherals = dict[CBCentralManagerRestoredStatePeripheralsKey]
                as? [CBPeripheral]
        else { return }
        // Appended, not assigned: iOS may restore more than once before the
        // module attaches, and replacing would drop a live connection.
        restoredPeripherals.append(contentsOf: peripherals)
    }
}

extension AirhopBLERestoration: CBPeripheralManagerDelegate {
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {}

    func peripheralManager(
        _ peripheral: CBPeripheralManager,
        willRestoreState dict: [String: Any]
    ) {
        guard
            let services = dict[CBPeripheralManagerRestoredStateServicesKey]
                as? [CBMutableService]
        else { return }
        for service in services where service.uuid == BLEConst.serviceUUID {
            service.characteristics?
                .compactMap { $0 as? CBMutableCharacteristic }
                .forEach { char in
                    if char.uuid == BLEConst.characteristicUUID {
                        restoredCharacteristic = char
                    }
                }
        }
    }
}
