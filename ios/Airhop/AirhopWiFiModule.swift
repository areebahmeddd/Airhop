// AirhopWiFiModule: Wi-Fi Aware high-bandwidth transport for Airhop (iOS).
//
// Apple's WiFiAware framework, iOS 26+. Same three methods, four events and
// rejection codes as AirhopWiFiModule.kt, so services/wifi-controller.ts drives
// both platforms without knowing which. No protocol or routing logic here: raw
// bytes to TypeScript, as AirhopBLEModule does.
//
// Events emitted to TypeScript:
//   AirhopWiFi.packetReceived      { linkID, dataBase64 }
//   AirhopWiFi.linkConnected       { linkID }
//   AirhopWiFi.linkDisconnected    { linkID }
//   AirhopWiFi.availabilityChanged { available }
//
// Still not a cross-platform path: Apple demands a paired data path and refuses
// an open one, and Android cannot complete Apple's pairing.
//
// Two of Apple's rules shape the whole file:
//
// NetworkConnection has no cancel. A connection ends when the last reference is
// dropped, so one task per link owns its connection for the link's life and
// closing means cancelling that task. The registry holds a reference for writes,
// which is why `serve`'s defer removes it.
//
// Discovery is symmetric with no serviceSpecificInfo to break a tie before
// connecting, so each pair would open two connections and MeshService would
// rebind `wifiPeerToLink` to whichever announced last. Hence the link hello.
import Foundation
import Network
import React
import WiFiAware

// Not private: AirhopWiFiPairing.swift publishes the same service.
enum WiFiConst {
    // NAN hashes this into the on-air service ID, so it must match `SERVICE_NAME`
    // in AirhopWiFiModule.kt and `WiFiAwareServices` in Info.plist character for
    // character. Apple requires DNS-SD form and traps on launch on an invalid one.
    static let serviceName = "_airhop-mesh-v1._tcp"
    // 64 KiB chunk plus the length prefix. Matches MAX_FRAME on the Kotlin side.
    static let maxFrame = 65_544
    static let tokenBytes = 8
}

private enum WiFiEvent {
    static let packetReceived = "AirhopWiFi.packetReceived"
    static let linkConnected = "AirhopWiFi.linkConnected"
    static let linkDisconnected = "AirhopWiFi.linkDisconnected"
    static let availabilityChanged = "AirhopWiFi.availabilityChanged"
}

// MARK: - Framing

/// `[4-byte big-endian length][payload]`, byte-identical to the Kotlin module.
///
/// Big-endian by hand rather than `receive(as: UInt32.self)`, which reads in host
/// order and would yield a byte-swapped length on every device this runs on.
private enum Frame {
    static func encode(_ payload: Data) -> Data {
        let length = UInt32(payload.count)
        var out = Data(capacity: 4 + payload.count)
        out.append(UInt8((length >> 24) & 0xff))
        out.append(UInt8((length >> 16) & 0xff))
        out.append(UInt8((length >> 8) & 0xff))
        out.append(UInt8(length & 0xff))
        out.append(payload)
        return out
    }

    static func decodeLength(_ header: Data) -> Int? {
        guard header.count == 4 else { return nil }
        let bytes = [UInt8](header)
        let length =
            (Int(bytes[0]) << 24) | (Int(bytes[1]) << 16) | (Int(bytes[2]) << 8) | Int(bytes[3])
        guard length > 0, length <= WiFiConst.maxFrame else { return nil }
        return length
    }
}

/// The ordering `shouldDial` uses in AirhopWiFiModule.kt.
private func tokenIsLower(_ a: Data, than b: Data) -> Bool {
    guard a.count == b.count else { return a.count < b.count }
    for (x, y) in zip(a, b) where x != y { return x < y }
    return false
}

// MARK: - Serial sender

/// One link's outbound queue, the equivalent of `synchronized(link.writeLock)`
/// on the Kotlin side.
///
/// Two sends awaited concurrently on one connection interleave and split a frame
/// across another's bytes, desynchronising the reader for good. A broadcast fans
/// out while an ANNOUNCE may be going to the same link, so that is ordinary.
///
/// A failed predecessor is awaited and its error discarded: one refused frame
/// must not fail every frame queued behind it.
private actor SerialSender {
    private var tail: Task<Void, Error>?

    func send(_ body: @escaping @Sendable () async throws -> Void) -> Task<Void, Error> {
        let previous = tail
        let task = Task {
            _ = try? await previous?.value
            try await body()
        }
        tail = task
        return task
    }
}

// MARK: - Link handle

/// A link's cancellation handle. Assigned before the task it names can run,
/// because a task created from actor-isolated code cannot begin until
/// `spawnLink` suspends, so no link ever exists uncancellable.
@available(iOS 26.0, *)
private final class LinkHandle {
    var task: Task<Void, Never>?
}

// MARK: - Transport

/// Everything with state, isolated to one actor: framework callbacks arrive on
/// arbitrary queues and bridge methods on React Native's, so the registry and the
/// dial guards are touched from several threads at once.
@available(iOS 26.0, *)
private actor WiFiAwareTransport {
    /// A connection that won its tiebreak and was announced to TypeScript.
    private struct Link {
        let connection: NetworkConnection<TCP>
        let deviceID: WAPairedDevice.ID?
        let sender: SerialSender
        let handle: LinkHandle
    }

    private let emit: @Sendable (String, [String: Any]) -> Void

    private var links: [String: Link] = [:]
    /// linkID by device. A link whose device could not be resolved is absent and
    /// never deduplicated, which costs nothing: the tiebreak already collapsed
    /// the pair by then.
    private var linkByDevice: [WAPairedDevice.ID: String] = [:]
    /// Dials in flight, so a re-reported peer does not open a second connection.
    private var dialling: Set<WAPairedDevice.ID> = []
    /// Last endpoint per device, so an inbound tiebreak loss can dial at once.
    private var endpoints: [WAPairedDevice.ID: WAEndpoint] = [:]

    private var linkSeq = 0
    private var runTask: Task<Void, Never>?
    /// Regenerated per attach, so it never identifies this device across sessions.
    private var localToken = Data()
    /// Cleared by `start`, never by `stop`: a second `available: false` while
    /// already reported down resets the JS controller's backoff, turning the
    /// retry ladder into a tight loop.
    private var lastReportedAvailable: Bool?

    init(emit: @escaping @Sendable (String, [String: Any]) -> Void) {
        self.emit = emit
    }

    /// The one test for "should anything still be happening". `stop()` clears
    /// `runTask` before anything else, so this falls false first.
    private var isRunning: Bool { runTask != nil }

    // MARK: Start and stop

    func start() throws {
        // Resolving rather than restarting: an overlapping reconcile pass must
        // not leak a second listener.
        if runTask != nil { return }

        guard !WACapabilities.supportedFeatures.isEmpty else {
            throw WiFiFailure.unsupported("Wi-Fi Aware is not supported on this device")
        }
        // Missing means Info.plist does not declare it: a fact about the build,
        // so permanent like the check above.
        guard let publishable = WAPublishableService.allServices[WiFiConst.serviceName],
            let subscribable = WASubscribableService.allServices[WiFiConst.serviceName]
        else {
            throw WiFiFailure.unsupported(
                "Wi-Fi Aware service \(WiFiConst.serviceName) is not declared"
            )
        }

        // After the two above, never before: a device with no Wi-Fi Aware also
        // has nothing paired, and "nothing paired" would send the user to a
        // sheet that could not help.
        guard AirhopWiFiPairing.pairedDeviceCount > 0 else { throw WiFiFailure.unpaired }

        localToken = Data((0..<WiFiConst.tokenBytes).map { _ in UInt8.random(in: 0...255) })
        lastReportedAvailable = nil

        runTask = Task { [weak self] in
            await withTaskGroup(of: Void.self) { group in
                group.addTask { await self?.runListener(publishable) }
                group.addTask { await self?.runBrowser(subscribable) }
            }
        }
    }

    func stop() {
        runTask?.cancel()
        runTask = nil
        // Announced before the registry is cleared, so JS stops addressing a
        // dead link at once rather than one refused write at a time.
        for (linkID, link) in links {
            link.handle.task?.cancel()
            emit(WiFiEvent.linkDisconnected, ["linkID": linkID])
        }
        links.removeAll()
        linkByDevice.removeAll()
        dialling.removeAll()
        endpoints.removeAll()
    }

    // MARK: Publish and subscribe

    private func runListener(_ service: WAPublishableService) async {
        do {
            try await NetworkListener(
                for: .wifiAware(.connecting(to: service, from: .allPairedDevices)),
                using: .parameters { TCP() }
                    // `bulk` prioritises throughput, power and coexistence with
                    // infrastructure Wi-Fi, and is the whole battery policy here.
                    // power-policy.ts scales the BLE radios and leaves this one
                    // alone on both platforms: the OS withdraws Aware under
                    // battery saver, which arrives as availabilityChanged(false).
                    .wifiAware { $0.performanceMode = .bulk }
            )
            .run { connection in
                // Held for the link's life. `run` starts a subtask per
                // connection, so blocking here still accepts others, and
                // returning early would cancel the link we just adopted.
                await self.spawnLink(connection, endpoint: nil, weInitiated: false)
            }
        } catch {
            // Cancellation is `stop()` doing its job, not a fault.
            guard !Task.isCancelled else { return }
            reportUnavailable()
        }
    }

    private func runBrowser(_ service: WASubscribableService) async {
        do {
            // `.continue` forever: this is the mesh's standing discovery, not a
            // one-shot picker. `.allPairedDevices` is taken to be live, so a
            // device paired mid-browse turns up without a restart; a second
            // pairing that needs a relaunch would point here.
            _ = try await NetworkBrowser(
                for: .wifiAware(.connecting(to: .allPairedDevices, from: service))
            )
            .run { found in
                for endpoint in found {
                    Task { await self.considerDial(endpoint) }
                }
            }
        } catch {
            guard !Task.isCancelled else { return }
            reportUnavailable()
        }
    }

    /// Discovery or the data path was refused after start resolved.
    ///
    /// Reported so the JS reconciler forgets it is started and retries, rather
    /// than latching over a transport with nothing published or subscribed. No
    /// matching `true` edge: iOS has no state broadcast to hang one on.
    private func reportUnavailable() {
        stop()
        guard lastReportedAvailable != false else { return }
        lastReportedAvailable = false
        emit(WiFiEvent.availabilityChanged, ["available": false])
    }

    // MARK: Dialling

    private func considerDial(_ endpoint: WAEndpoint) {
        // A browser update spawned before cancellation landed, or the redial in
        // `serve`'s defer, both reach here after `stop()`. Either would dial a
        // torn-down transport and leave a `dialling` entry the sweep has passed.
        guard isRunning else { return }
        let deviceID = endpoint.device.id
        endpoints[deviceID] = endpoint
        guard linkByDevice[deviceID] == nil, !dialling.contains(deviceID) else { return }
        dialling.insert(deviceID)
        Task { await self.dial(endpoint) }
    }

    private func dial(_ endpoint: WAEndpoint) async {
        let connection = NetworkConnection(
            to: endpoint,
            using: .parameters { TCP() }
                .wifiAware { $0.performanceMode = .bulk }
        )
        await spawnLink(connection, endpoint: endpoint, weInitiated: true)
    }

    // MARK: Link lifetime

    /// Own one connection for its whole life. The inner task exists only so the
    /// link can be cancelled from outside: `serve` blocks in `receive`, which
    /// nothing but cancellation interrupts.
    private func spawnLink(
        _ connection: NetworkConnection<TCP>,
        endpoint: WAEndpoint?,
        weInitiated: Bool
    ) async {
        let handle = LinkHandle()
        let task = Task { [weak self] in
            // Unwrapped, not chained: `self?.serve(...)` types the task
            // `Task<()?, Never>` and the handle holds `Task<Void, Never>`.
            guard let self else { return }
            await self.serve(
                connection,
                endpoint: endpoint,
                weInitiated: weInitiated,
                handle: handle
            )
        }
        handle.task = task
        await task.value
    }

    private func serve(
        _ connection: NetworkConnection<TCP>,
        endpoint: WAEndpoint?,
        weInitiated: Bool,
        handle: LinkHandle
    ) async {
        var deviceID = endpoint?.device.id
        var linkID: String?
        // Acted on in the defer, not inline: `considerDial` takes the dial guard
        // and the `releaseDial` below would hand it straight back.
        var redial: WAEndpoint?
        defer {
            // Hello failed, tiebreak lost or read loop ended, this is the one
            // place a link stops existing. A registry entry left behind holds the
            // connection alive with nobody reading it.
            if let linkID { retire(linkID) }
            releaseDial(deviceID)
            if let redial { considerDial(redial) }
        }

        do {
            // Sending first drives the connection to `ready`, which is what
            // makes `currentPath` answer below.
            try await connection.send(Frame.encode(localToken))

            let header = try await connection.receive(exactly: 4).content
            guard let length = Frame.decodeLength(header), length == WiFiConst.tokenBytes else { return }
            let peerToken = try await connection.receive(exactly: length).content

            // After the hello, not before: the path only populates once ready.
            if deviceID == nil {
                // `try await` spans the whole chain. The effects sit on the
                // Wi-Fi Aware accessor, not on `currentPath`, so parenthesising
                // the first term leaves the rest unmarked and this will not
                // compile. `try?` because failing to name the device costs the
                // dial guard a hint, not the link.
                deviceID =
                    try? await connection.currentPath?.wifiAware?.endpoint.device.id
            }

            // Keep the connection whose initiator holds the lower token.
            let keep =
                weInitiated
                ? tokenIsLower(localToken, than: peerToken)
                : tokenIsLower(peerToken, than: localToken)
            guard keep else {
                // Losing an INBOUND connection means our token is the lower one,
                // so we are the side that should dial. The peer has stopped
                // trying and nothing else would close the loop.
                if !weInitiated, let deviceID { redial = endpoints[deviceID] }
                return
            }

            guard let id = adopt(connection, deviceID: deviceID, handle: handle) else {
                return
            }
            linkID = id
            await readLoop(linkID: id, connection: connection)
        } catch {
            // Every failure here is the same failure: this connection did not
            // become a link, or stopped being one. The defer above is the
            // response.
        }
    }

    /// Register a connection that won its tiebreak, and tell TypeScript.
    ///
    /// Nil when the transport stopped underneath it. `stop()` only cancels links
    /// it knows about, and one still exchanging its hello is not in the registry:
    /// its task is unstructured, so cancelling the listener does not reach it.
    /// Going Away while a peer connects is the ordinary way to hit this.
    private func adopt(
        _ connection: NetworkConnection<TCP>,
        deviceID: WAPairedDevice.ID?,
        handle: LinkHandle
    ) -> String? {
        guard isRunning else { return nil }
        // A later connection to a device we already hold: a re-dial after the far
        // side saw a drop we did not. Newest wins, since it is the one both ends
        // can write to. The tiebreak already resolved the simultaneous case.
        if let deviceID, let existing = linkByDevice[deviceID] {
            closeLink(existing)
        }

        linkSeq += 1
        let linkID = "wifi-\(linkSeq)"
        links[linkID] = Link(
            connection: connection,
            deviceID: deviceID,
            sender: SerialSender(),
            handle: handle
        )
        if let deviceID {
            linkByDevice[deviceID] = linkID
            // Holding the guard would stop a reconnect once this link drops.
            dialling.remove(deviceID)
        }
        emit(WiFiEvent.linkConnected, ["linkID": linkID])
        return linkID
    }

    private func releaseDial(_ deviceID: WAPairedDevice.ID?) {
        guard let deviceID else { return }
        dialling.remove(deviceID)
    }

    // MARK: Reading

    /// Read length-prefixed frames until the connection ends.
    ///
    /// No read deadline, unlike the Kotlin module's 90 seconds: Apple collects
    /// idle connections and closes a suspended app's outright, both of which
    /// surface as a receive error below. A timer would only close healthy links
    /// early.
    private func readLoop(linkID: String, connection: NetworkConnection<TCP>) async {
        while !Task.isCancelled {
            do {
                let header = try await connection.receive(exactly: 4).content
                guard let length = Frame.decodeLength(header) else { return }
                let payload = try await connection.receive(exactly: length).content
                emit(
                    WiFiEvent.packetReceived,
                    ["linkID": linkID, "dataBase64": payload.base64EncodedString()]
                )
            } catch {
                return
            }
        }
    }

    // MARK: Writing

    func write(linkID: String, payload: Data) async throws {
        guard let link = links[linkID] else { throw WiFiFailure.unknownLink(linkID) }
        let frame = Frame.encode(payload)
        let connection = link.connection
        let task = await link.sender.send { try await connection.send(frame) }
        do {
            try await task.value
        } catch {
            // A refused write cannot carry the rest of the transfer either, so
            // tear down here rather than wait for the read loop to notice.
            closeLink(linkID)
            throw WiFiFailure.writeFailed(String(describing: error))
        }
    }

    // MARK: Teardown

    /// Ask a link to end. The cancellation unwinds `serve`, whose defer calls
    /// `retire`, which is what reports it.
    private func closeLink(_ linkID: String) {
        links[linkID]?.handle.task?.cancel()
    }

    /// Forget a link and tell TypeScript. Idempotent: `serve`'s defer runs once
    /// per link and nothing else calls it.
    private func retire(_ linkID: String) {
        guard let link = links.removeValue(forKey: linkID) else { return }
        if let deviceID = link.deviceID {
            // Only if it still points at us: a newer link may have claimed the
            // slot, and clearing it would orphan the live one.
            if linkByDevice[deviceID] == linkID { linkByDevice.removeValue(forKey: deviceID) }
            dialling.remove(deviceID)
        }
        emit(WiFiEvent.linkDisconnected, ["linkID": linkID])
    }
}

// MARK: - Failures

/// The rejection codes services/wifi-controller.ts branches on, shared with
/// AirhopWiFiModule.kt so one `classify` covers both platforms. They separate
/// retrying from waiting for a pairing from giving up.
private enum WiFiFailure: Error {
    /// No hardware, an OS below iOS 26, or an undeclared service. Permanent.
    case unsupported(String)
    /// Nobody to reach. Clears when AirhopWiFiPairing reports a pairing.
    case unpaired
    case unknownLink(String)
    case writeFailed(String)

    var code: String {
        switch self {
        case .unsupported: return "WIFI_AWARE_UNSUPPORTED"
        case .unpaired: return "WIFI_AWARE_UNPAIRED"
        case .unknownLink: return "UNKNOWN_LINK"
        case .writeFailed: return "WRITE_FAILED"
        }
    }

    var message: String {
        switch self {
        case .unsupported(let m): return m
        case .unpaired: return "No device is paired for Wi-Fi Aware"
        case .unknownLink(let id): return "No active WiFi link: \(id)"
        case .writeFailed(let m): return m
        }
    }
}

// MARK: - Module

@objc(AirhopWiFiModule)
final class AirhopWiFiModule: RCTEventEmitter {

    /// Held as `Any` because its type is gated to iOS 26 and a stored property
    /// cannot be. The accessor below is the one place the cast lives.
    private var box: Any?

    @available(iOS 26.0, *)
    private var transport: WiFiAwareTransport {
        if let existing = box as? WiFiAwareTransport { return existing }
        // Weak: the actor is stored here, so a strong capture closes a cycle.
        let created = WiFiAwareTransport { [weak self] name, body in
            self?.emit(name, body)
        }
        box = created
        return created
    }

    @objc override static func requiresMainQueueSetup() -> Bool { false }

    override func supportedEvents() -> [String]! {
        [
            WiFiEvent.packetReceived,
            WiFiEvent.linkConnected,
            WiFiEvent.linkDisconnected,
            WiFiEvent.availabilityChanged,
        ]
    }

    /// Callers are framework callbacks and detached tasks with no bridge above
    /// them, and sending into a departed runtime traps.
    private func emit(_ name: String, _ body: [String: Any]) {
        guard bridge != nil else { return }
        sendEvent(withName: name, body: body)
    }

    // MARK: Exported

    @objc(startWiFi:rejecter:)
    func startWiFi(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        // Below iOS 26 there is no framework. Asked first, so a device that can
        // never do this is not told to try again.
        guard #available(iOS 26.0, *) else {
            reject("WIFI_AWARE_UNSUPPORTED", "Wi-Fi Aware needs iOS 26 or later", nil)
            return
        }
        start(resolve: resolve, reject: reject)
    }

    /// `#available` narrows the scope it guards but does not reliably carry into
    /// an escaping closure, and this runs inside a `Task`. An annotated method
    /// gives that closure a context of its own, which is why all three exported
    /// methods hand off to one of these.
    @available(iOS 26.0, *)
    private func start(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let transport = self.transport
        Task {
            do {
                try await transport.start()
                resolve(nil)
            } catch let failure as WiFiFailure {
                reject(failure.code, failure.message, nil)
            } catch {
                reject("WIFI_AWARE_ATTACH_FAILED", String(describing: error), error)
            }
        }
    }

    @objc(stopWiFi:rejecter:)
    func stopWiFi(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard #available(iOS 26.0, *) else {
            // Nothing was started, so stopping succeeded. Idempotent, because
            // the reconciler calls this without tracking whether it is up.
            resolve(nil)
            return
        }
        stop(resolve: resolve)
    }

    @available(iOS 26.0, *)
    private func stop(resolve: @escaping RCTPromiseResolveBlock) {
        guard let transport = box as? WiFiAwareTransport else {
            resolve(nil)
            return
        }
        Task {
            await transport.stop()
            resolve(nil)
        }
    }

    @objc(writeToWiFiLink:dataBase64:resolver:rejecter:)
    func writeToWiFiLink(
        linkID: String,
        dataBase64: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let payload = Data(base64Encoded: dataBase64) else {
            reject("INVALID_DATA", "Invalid base64 payload", nil)
            return
        }
        guard payload.count <= WiFiConst.maxFrame - 4 else {
            reject(
                "FRAME_TOO_LARGE",
                "Frame of \(payload.count) exceeds the peer's read limit",
                nil
            )
            return
        }
        guard #available(iOS 26.0, *) else {
            reject("LINK_CLOSED", "WiFi transport is not running", nil)
            return
        }
        write(linkID: linkID, payload: payload, resolve: resolve, reject: reject)
    }

    @available(iOS 26.0, *)
    private func write(
        linkID: String,
        payload: Data,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let transport = box as? WiFiAwareTransport else {
            reject("LINK_CLOSED", "WiFi transport is not running", nil)
            return
        }
        Task {
            do {
                try await transport.write(linkID: linkID, payload: payload)
                resolve(nil)
            } catch let failure as WiFiFailure {
                reject(failure.code, failure.message, nil)
            } catch {
                reject("WRITE_FAILED", String(describing: error), error)
            }
        }
    }

    // MARK: Lifecycle

    /// Every link exists to hand bytes to a runtime that is gone, and a listener
    /// nobody hears is a radio left running.
    override func invalidate() {
        if #available(iOS 26.0, *) { releaseTransport() }
        box = nil
        super.invalidate()
    }

    @available(iOS 26.0, *)
    private func releaseTransport() {
        guard let transport = box as? WiFiAwareTransport else { return }
        Task { await transport.stop() }
    }
}
