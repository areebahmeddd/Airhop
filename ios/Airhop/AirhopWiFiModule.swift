// AirhopWiFiModule: Wi-Fi Aware high-bandwidth transport for Airhop (iOS).
//
// Apple's WiFiAware framework on Network framework, iOS 26+. Same three methods,
// four events and rejection codes as AirhopWiFiModule.kt, so
// services/wifi-controller.ts drives both platforms without knowing which.
//
// Architecture contract, as on the Kotlin side: no protocol or routing logic
// here. Raw bytes to TypeScript, exactly as AirhopBLEModule does.
//
// Events emitted to TypeScript:
//   AirhopWiFi.packetReceived      { linkID, dataBase64 }
//   AirhopWiFi.linkConnected       { linkID }
//   AirhopWiFi.linkDisconnected    { linkID }
//   AirhopWiFi.availabilityChanged { available }
//
// Not a cross-platform path, though both platforms now speak NAN: Apple demands
// a paired data path and refuses an open one, and Android cannot complete
// Apple's pairing. iPhone to iPhone only.
//
// Three things shape this file, and all three are Apple's:
//
// Pairing is mandatory. Every target a listener or browser can name comes from
// the app's paired list, so with nothing paired there is nobody to reach and
// `startWiFi` refuses with WIFI_AWARE_UNPAIRED rather than running a radio for
// an empty room. AirhopWiFiPairing.swift owns the sheet that fills that list.
//
// Lifetime is scope-based. NetworkConnection has no cancel: a connection ends
// when the last reference to it is dropped, and listeners and browsers enforce
// the same rule through `run(...)`. So one task per link owns its connection for
// the link's whole life, closing a link means cancelling that task, and a
// connection that loses its tiebreak is simply never stored. The registry holds
// a reference for writes, which is why `serve`'s defer removes it: leaving the
// entry behind keeps a connection alive with nobody reading it.
//
// Discovery is symmetric, and Apple exposes no serviceSpecificInfo to break a
// tie with before connecting, so each pair would open two connections. Two links
// to one peer is not just waste: MeshService keys `wifiPeerToLink` by peer, so
// the idle one's eventual linkDisconnected clears the binding for a peer whose
// other link is working. Both ends therefore exchange an 8-byte token as the
// first frame and keep the connection whose INITIATOR holds the lower one; the
// loser returns before any link is announced, so TypeScript only ever sees
// settled links. An inbound loser is by construction the side that should be
// dialling, so it dials rather than waiting for a browser update that may never
// come. Android breaks the same tie before connecting and needs no hello.
import Foundation
import Network
import React
import WiFiAware

// Not private: AirhopWiFiPairing.swift publishes and subscribes to the same
// service, and two spellings of it would pair devices the transport then could
// not reach.
enum WiFiConst {
    // Must match `SERVICE_NAME` in AirhopWiFiModule.kt and the
    // `WiFiAwareServices` key in Info.plist, character for character: NAN
    // derives the on-air service ID by hashing it. Apple requires DNS-SD form
    // with a name component of at most 15 characters from [A-Za-z0-9-], and
    // traps on launch rather than failing at use if Info.plist declares an
    // invalid one.
    static let serviceName = "_airhop-mesh-v1._tcp"
    // The 64 KiB chunk file-transfer-service.ts can hand over plus the 4-byte
    // length prefix, with room to spare. Matches MAX_FRAME on the Kotlin side.
    static let maxFrame = 65_544
    // Bytes of tiebreak token in the link hello.
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
/// Big-endian by hand rather than `receive(as: UInt32.self)`, which reads a
/// fixed-width integer in host order: every device this runs on is
/// little-endian, so that call yields a byte-swapped length and a link that
/// desynchronises on its first frame.
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

/// Unsigned big-endian comparison, the ordering `shouldDial` uses in
/// AirhopWiFiModule.kt.
private func tokenIsLower(_ a: Data, than b: Data) -> Bool {
    guard a.count == b.count else { return a.count < b.count }
    for (x, y) in zip(a, b) where x != y { return x < y }
    return false
}

// MARK: - Serial sender

/// One link's outbound queue.
///
/// `NetworkConnection.send` suspends until the framework has taken the data, so
/// two sends awaited concurrently on one connection can interleave and split a
/// frame across another frame's bytes, which desynchronises the reader
/// permanently. The JS pacer serialises the fragments of a single file, but a
/// broadcast fans out to every link while an ANNOUNCE may be going to one of
/// them, so concurrent writes to one link are ordinary rather than exotic.
///
/// A predecessor that failed is awaited and its error discarded: one refused
/// frame must not fail every frame queued behind it, because the caller above
/// retries per fragment and would otherwise lose a whole transfer to one bad
/// write.
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

/// A link's cancellation handle.
///
/// Written and read only from inside the actor, and always assigned before the
/// task it names can run, because creating a task from actor-isolated code does
/// not yield: `serve` cannot begin until `spawnLink` suspends at `await
/// task.value`, which happens after the assignment. So there is no window in
/// which a link exists with no way to cancel it.
@available(iOS 26.0, *)
private final class LinkHandle {
    var task: Task<Void, Never>?
}

// MARK: - Transport

/// Everything with state, isolated to one actor.
///
/// Network framework callbacks arrive on arbitrary queues and the exported
/// bridge methods on React Native's module queue, so the link registry and the
/// dial guards are touched from several threads at once.
@available(iOS 26.0, *)
private actor WiFiAwareTransport {
    /// A settled link: one connection that won its tiebreak and has been
    /// announced to TypeScript.
    private struct Link {
        let connection: NetworkConnection<TCP>
        let deviceID: WAPairedDevice.ID?
        let sender: SerialSender
        let handle: LinkHandle
    }

    private let emit: @Sendable (String, [String: Any]) -> Void

    private var links: [String: Link] = [:]
    /// linkID by device, so a second connection to a peer we already hold can be
    /// found without scanning. A link whose device could not be resolved is
    /// absent here and simply never deduplicated, which costs nothing: the
    /// tiebreak has already collapsed the pair by then.
    private var linkByDevice: [WAPairedDevice.ID: String] = [:]
    /// Devices with a dial in flight, so a browser that re-reports a peer while
    /// we are connecting to it does not open a second connection.
    private var dialling: Set<WAPairedDevice.ID> = []
    /// The most recent endpoint seen for a device, so an inbound tiebreak loss
    /// can dial without waiting for the browser to report the peer again.
    private var endpoints: [WAPairedDevice.ID: WAEndpoint] = [:]

    private var linkSeq = 0
    private var runTask: Task<Void, Never>?
    /// Regenerated on every start so it cannot become a stable identifier for
    /// this device across sessions.
    private var localToken = Data()
    /// What we last told JS, so an unchanged report costs nothing. Cleared only
    /// by `start`, never by `stop`: a second failure while already reported down
    /// would otherwise emit a second `available: false`, and the JS controller
    /// resets its backoff on every one of those, which would turn the retry
    /// ladder back into a tight loop.
    private var lastReportedAvailable: Bool?

    init(emit: @escaping @Sendable (String, [String: Any]) -> Void) {
        self.emit = emit
    }

    /// Whether the listener and browser are up. The one test for "should
    /// anything still be happening", since `stop()` is the only thing that
    /// clears `runTask` and it clears it before anything else.
    private var isRunning: Bool { runTask != nil }

    // MARK: Start and stop

    func start() throws {
        // Already attached. Resolving rather than restarting, so a reconcile
        // pass overlapping an earlier one cannot leak a second listener.
        if runTask != nil { return }

        guard !WACapabilities.supportedFeatures.isEmpty else {
            throw WiFiFailure.unsupported("Wi-Fi Aware is not supported on this device")
        }
        // A service missing here means Info.plist does not declare it, which is
        // a fact about the build rather than about the minute, so it is
        // permanent like the capability check above.
        guard let publishable = WAPublishableService.allServices[WiFiConst.serviceName],
            let subscribable = WASubscribableService.allServices[WiFiConst.serviceName]
        else {
            throw WiFiFailure.unsupported(
                "Wi-Fi Aware service \(WiFiConst.serviceName) is not declared"
            )
        }

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
        // Announced disconnected before the registry is cleared, so JS stops
        // addressing a dead link immediately rather than discovering it one
        // refused write at a time.
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
                    // `bulk` rather than `realtime`: Apple's guidance is that it
                    // prioritises throughput, power and coexistence with
                    // infrastructure Wi-Fi, and this transport exists to move
                    // attachments rather than frame-by-frame updates.
                    .wifiAware { $0.performanceMode = .bulk }
            )
            .run { connection in
                // Held for the whole life of the link. `run` starts a subtask
                // per connection, so blocking here does not stop the listener
                // accepting others, and returning early would drop the last
                // reference and cancel a link we had just adopted.
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
            // `.continue` forever: unlike a device picker this browse is the
            // mesh's standing discovery, so it runs until cancelled and dials
            // each peer as it appears.
            _ = try await NetworkBrowser(
                for: .wifiAware(.connecting(to: .allPairedDevices, from: service))
            )
            .run { found in
                for endpoint in found {
                    Task { await self.considerDial(endpoint) }
                }
                return .continue
            }
        } catch {
            guard !Task.isCancelled else { return }
            reportUnavailable()
        }
    }

    /// Discovery or the data path was refused after start resolved.
    ///
    /// Reported as unavailable so the JS reconciler forgets it is started and
    /// retries on its ladder, rather than latching over a transport with nothing
    /// published or subscribed.
    ///
    /// No matching `true` edge, deliberately: iOS has no Wi-Fi Aware state
    /// broadcast to hang one on, so the retry ladder is what recovers.
    private func reportUnavailable() {
        stop()
        guard lastReportedAvailable != false else { return }
        lastReportedAvailable = false
        emit(WiFiEvent.availabilityChanged, ["available": false])
    }

    // MARK: Dialling

    private func considerDial(_ endpoint: WAEndpoint) {
        // Two things reach here after `stop()`: a browser update whose Task was
        // spawned before the cancellation landed, and the redial in `serve`'s
        // defer when a link is cancelled mid-tiebreak. Either would open a
        // connection against a torn-down transport and leave a `dialling` entry
        // behind that `stop()` has already swept.
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

    /// Own one connection for its whole life.
    ///
    /// The inner task exists only so the link can be cancelled from outside:
    /// `serve` blocks in `receive`, which nothing but cancellation interrupts.
    /// The handle is assigned before `serve` can start, because a task created
    /// from actor-isolated code cannot begin until this function suspends.
    private func spawnLink(
        _ connection: NetworkConnection<TCP>,
        endpoint: WAEndpoint?,
        weInitiated: Bool
    ) async {
        let handle = LinkHandle()
        let task = Task { [weak self] in
            await self?.serve(
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
        // Set when losing an inbound tiebreak, and acted on in the defer rather
        // than inline: `considerDial` takes the dial guard, and the
        // `releaseDial` below would hand it straight back, leaving the door open
        // for a second dial to the same device.
        var redial: WAEndpoint?
        defer {
            // Whether the hello failed, the tiebreak lost, or the read loop
            // ended, this is the one place a link stops existing. Leaving the
            // registry entry behind would hold the connection alive with nobody
            // reading it, which is the leak this framework's lifetime rules make
            // easy to write.
            if let linkID { retire(linkID) }
            releaseDial(deviceID)
            if let redial { considerDial(redial) }
        }

        do {
            // Sending first drives the connection through `preparing` into
            // `ready`, which is also what makes `currentPath` answer below.
            try await connection.send(Frame.encode(localToken))

            let header = try await connection.receive(exactly: 4).content
            guard let length = Frame.decodeLength(header), length == WiFiConst.tokenBytes else { return }
            let peerToken = try await connection.receive(exactly: length).content

            // Resolved after the hello rather than before it: the path is only
            // populated once the connection is ready, and an inbound connection
            // has no endpoint to read a device from until then.
            if deviceID == nil {
                deviceID = connection.currentPath?.wifiAware?.endpoint.device.id
            }

            // Keep the connection whose initiator holds the lower token.
            let keep =
                weInitiated
                ? tokenIsLower(localToken, than: peerToken)
                : tokenIsLower(peerToken, than: localToken)
            guard keep else {
                // We lost an INBOUND connection, so our own token is the lower
                // one and we are the side that should be dialling. Ask for a
                // dial rather than waiting for a browser update that may never
                // come: the peer has stopped trying and nothing else would close
                // the loop.
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

    /// Register a connection that has won its tiebreak, and tell TypeScript.
    ///
    /// Returns nil when the transport has stopped underneath this connection.
    /// `stop()` can only cancel links it knows about, and one still exchanging
    /// its hello is not in the registry yet: its task is unstructured, so
    /// cancelling the listener does not reach it, and without this guard it
    /// would finish the handshake and announce a link for a transport the user
    /// has already taken down. Going Away while a peer is connecting is the
    /// ordinary way to hit it.
    private func adopt(
        _ connection: NetworkConnection<TCP>,
        deviceID: WAPairedDevice.ID?,
        handle: LinkHandle
    ) -> String? {
        guard isRunning else { return nil }
        // A link to this device already settled, so this connection is a later
        // one: a re-dial after the far side saw a drop we did not. The newest
        // link is the one both ends can still write to, so the old one goes. The
        // tiebreak has already resolved the simultaneous case, so this never
        // fires on a race between two connections of the same pair.
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
            // The dial is finished either way, and holding the guard would stop
            // a reconnect after this link eventually drops.
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

    /// Read length-prefixed frames and emit them until the connection ends.
    ///
    /// There is no read deadline here, unlike the Kotlin module's 90-second one.
    /// It would be inventing a failure mode the platform already handles: Apple
    /// collects an idle Wi-Fi Aware connection on its own, and a suspended app's
    /// connections are closed outright, both of which surface as a receive error
    /// on the next line. A timer on top of that would only close healthy links
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
            // A refused write is a link that cannot carry the rest of the
            // transfer either, so it is torn down here rather than left for the
            // read loop to discover on its own schedule.
            closeLink(linkID)
            throw WiFiFailure.writeFailed(String(describing: error))
        }
    }

    // MARK: Teardown

    /// Ask a link to end. The cancellation unwinds `serve`, whose `defer` calls
    /// `retire` below, which is what actually reports it.
    private func closeLink(_ linkID: String) {
        links[linkID]?.handle.task?.cancel()
    }

    /// Forget a link and tell TypeScript. Idempotent, because `serve`'s defer
    /// runs once per link and nothing else calls it.
    private func retire(_ linkID: String) {
        guard let link = links.removeValue(forKey: linkID) else { return }
        if let deviceID = link.deviceID {
            // Only if it still points at us. A newer link for the same device
            // has already claimed the slot, and clearing it here would orphan
            // the live link that replaced this one.
            if linkByDevice[deviceID] == linkID { linkByDevice.removeValue(forKey: deviceID) }
            dialling.remove(deviceID)
        }
        emit(WiFiEvent.linkDisconnected, ["linkID": linkID])
    }
}

// MARK: - Failures

/// The rejection codes services/wifi-controller.ts branches on.
///
/// Shared with AirhopWiFiModule.kt so one `classify` in TypeScript covers both
/// platforms. The difference between them is the difference between retrying,
/// waiting for a pairing, and giving up for good.
private enum WiFiFailure: Error {
    /// No Wi-Fi Aware hardware, an OS below iOS 26, or a build whose Info.plist
    /// does not declare the service. Permanent, so never asked again.
    case unsupported(String)
    /// Nothing is paired, so there is nobody this transport could reach. Clears
    /// when the user pairs a device, which AirhopWiFiPairing reports.
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

    /// The transport, held as `Any` because its type is gated to iOS 26 and a
    /// stored property cannot be. Every use goes back through the accessor
    /// below, which is the one place the cast lives.
    private var box: Any?

    @available(iOS 26.0, *)
    private var transport: WiFiAwareTransport {
        if let existing = box as? WiFiAwareTransport { return existing }
        // Captured weakly: the actor is stored on this module, so a strong
        // capture would close a cycle through the module's own event closure.
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

    /// Every caller is a Network framework callback or a detached task with no
    /// bridge above it, and sending into a runtime that has gone away traps.
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
        // Below iOS 26 there is no framework at all. Permanent, and asked first,
        // so a device that can never do this is never told to try again later.
        guard #available(iOS 26.0, *) else {
            reject("WIFI_AWARE_UNSUPPORTED", "Wi-Fi Aware needs iOS 26 or later", nil)
            return
        }
        // Asked here rather than inside the actor because it is the pairing
        // module's state rather than the transport's, and because refusing
        // before the actor is touched keeps "nothing to reach" from allocating a
        // listener and a browser that would find nobody.
        guard AirhopWiFiPairing.pairedDeviceCount > 0 else {
            reject(WiFiFailure.unpaired.code, WiFiFailure.unpaired.message, nil)
            return
        }
        start(resolve: resolve, reject: reject)
    }

    /// The body of `startWiFi`, in its own availability context.
    ///
    /// `#available` narrows the scope it guards but does not reliably carry into
    /// an escaping closure, and everything below happens inside a `Task`. An
    /// annotated method gives the closure a context of its own, which is why
    /// each of the three exported methods hands off to one of these.
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
            // Nothing was ever started, so stopping succeeded. Idempotent,
            // because the JS reconciler calls this whenever it wants the
            // transport down without tracking whether it is up.
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

    /// The JS runtime is going away: every link exists to hand bytes to a
    /// runtime that is gone, and a listener nobody is listening to is a radio
    /// left running.
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
