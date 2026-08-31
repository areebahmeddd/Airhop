// The LAN transport: Bonjour discovery over ordinary TCP.
//
// The only transport that reaches an Android phone from an iPhone over
// something other than Bluetooth. Wi-Fi Aware cannot: Apple requires a paired
// data path and Android has no way to complete Apple's pairing. This is plain
// IP, so it does not care which phone anyone owns.
//
// Framing and the read loop are the same shapes AirhopWiFiModule uses,
// deliberately: both carry the same length-prefixed Airhop packets and a bug
// fixed in one should be recognisable in the other.
//
// Three things differ from that module, each deliberately:
//
//   * Classic `NWConnection` and `NWListener`, not the iOS 26 generic
//     `NetworkConnection<TCP>`. Wi-Fi Aware needs iOS 26 regardless; this must
//     run on the app's floor, and Bonjour over Network framework has been there
//     since iOS 12. No availability gate anywhere below.
//   * Discovery and dialling are split, because Bonjour returns the whole
//     network and who to dial is a decision. TypeScript makes it
//     (services/lan-dial-policy.ts) and this opens what it is told to.
//   * No token tiebreak. The Wi-Fi module needs one because Apple's discovery is
//     symmetric; here the ring already decides which side dials.
//
// The instance name comes from TypeScript and is never the peer ID. See
// services/lan-controller.ts for why it rotates.
//
// Foreground only, structurally. iOS has no background mode for a listening
// socket, and a suspended app has its listener reclaimed without getting it back
// on resume. Bluetooth keeps the mesh alive with the screen off, and the Network
// screen says so.

import Foundation
import Network
import React

enum LANConst {
    // Must match `SERVICE_TYPE` in AirhopLANModule.kt and the `NSBonjourServices`
    // entry in Info.plist character for character. A mismatch is two apps that
    // cannot see each other.
    //
    // Not Wi-Fi Aware's `_airhop-mesh-v1._tcp`. Two services, named apart so
    // neither reads as a typo of the other: Aware is a radio protocol needing no
    // network, this is mDNS over an ordinary one.
    static let serviceType = "_airhop-lan-v1._tcp"
    static let domain = "local."
    // 64 KiB payload plus the length prefix. Matches MAX_FRAME on the Kotlin side.
    static let maxFrame = 65_544
}

private enum LANEvent {
    static let peerDiscovered = "AirhopLAN.peerDiscovered"
    static let peerLost = "AirhopLAN.peerLost"
    static let linkConnected = "AirhopLAN.linkConnected"
    static let linkDisconnected = "AirhopLAN.linkDisconnected"
    static let packetReceived = "AirhopLAN.packetReceived"
    static let availabilityChanged = "AirhopLAN.availabilityChanged"
}

// MARK: - Framing

/// `[4-byte big-endian length][payload]`, byte-identical to the Kotlin module
/// and to AirhopWiFiModule.
///
/// Big-endian by hand rather than reading a `UInt32`, which would come back in
/// host order and be byte-swapped on every device this runs on.
private enum LANFrame {
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
        guard length > 0, length <= LANConst.maxFrame else { return nil }
        return length
    }
}

// MARK: - Failures

/// The rejection codes services/lan-controller.ts branches on, shared with
/// AirhopLANModule.kt so one `classify` covers both platforms.
private enum LANFailure: Error {
    /// No network, or not on one that carries peers. Clears on its own.
    case unavailable(String)
    /// Local network access refused. On iOS the prompt is raised by browsing,
    /// and a refusal is only reversible in Settings.
    case permissionDenied
    /// The listener would not start.
    case listenFailed(String)
    case unknownPeer(String)
    case unknownLink(String)
    case connectFailed(String)
    case writeFailed(String)

    var code: String {
        switch self {
        case .unavailable: return "LAN_UNAVAILABLE"
        case .permissionDenied: return "PERMISSION_DENIED"
        case .listenFailed: return "LAN_LISTEN_FAILED"
        case .unknownPeer: return "UNKNOWN_PEER"
        case .unknownLink: return "UNKNOWN_LINK"
        case .connectFailed: return "CONNECT_FAILED"
        case .writeFailed: return "WRITE_FAILED"
        }
    }

    var message: String {
        switch self {
        case let .unavailable(detail): return detail
        case .permissionDenied: return "Local network access refused"
        case let .listenFailed(detail): return detail
        case let .unknownPeer(name): return "No discovered peer named \(name)"
        case let .unknownLink(id): return "No active LAN link: \(id)"
        case let .connectFailed(detail): return detail
        case let .writeFailed(detail): return detail
        }
    }
}

// MARK: - Transport

/// Everything with state, confined to one serial queue.
///
/// Network framework delivers its callbacks on whatever queue it was given and
/// bridge methods arrive on React Native's, so the registry and the discovery
/// map are touched from several threads at once. One queue rather than locks:
/// every mutation below is short, and the ordering it gives is what makes a
/// link's connect, ready and cancel sequence readable.
private final class LANTransport {
    private struct Link {
        let connection: NWConnection
        /// The peer this link was dialled for, or nil for one we accepted. An
        /// accepted connection is anonymous until its peer announces, and
        /// nothing here needs the name for anything but answering "already
        /// connected" to a repeat dial.
        let serviceName: String?
        var closing = false
    }

    private let emit: (String, [String: Any]) -> Void
    private let queue = DispatchQueue(label: "org.onemindlabs.airhop.lan")

    private var listener: NWListener?
    private var browser: NWBrowser?
    private var links: [String: Link] = [:]
    /// Endpoints Bonjour has told us about, by the name they publish. Held
    /// because a dial names a peer, not an address: Bonjour resolves lazily
    /// when the connection is made, which is why nothing above needs a host.
    private var discovered: [String: NWEndpoint] = [:]
    /// linkID by peer name, so a repeat dial for a peer already linked resolves
    /// without opening a second socket. TypeScript walks its dial plan on a
    /// timer, since a link can drop while the peer's Bonjour record stays
    /// visible, and it does not track which names are linked: that is this
    /// module's knowledge.
    private var linkByName: [String: String] = [:]
    private var instanceName: String?
    private var linkSeq = 0
    /// Set when the browser is refused for policy, which is how a denied local
    /// network permission arrives: there is no API to ask, and the prompt is
    /// raised by browsing rather than by declaring the service.
    ///
    /// Read by the NEXT start rather than reported from here, because by the
    /// time it lands the current start has already resolved. The controller's
    /// retry ladder asks again within half a second, and that attempt is the one
    /// that can say why.
    private var policyDenied = false
    /// The in-flight start's promise. Held because a listener is not usable at
    /// the moment it is created: it has to reach `.ready`, and reporting success
    /// before then would tell the controller a transport exists that cannot yet
    /// accept a connection.
    private var pendingStart: ((LANFailure?) -> Void)?
    /// Reported only on transitions. A second `available: false` while already
    /// down resets the controller's backoff, turning its retry ladder into a
    /// tight loop.
    private var lastReportedAvailable: Bool?

    init(emit: @escaping (String, [String: Any]) -> Void) {
        self.emit = emit
    }

    // MARK: Start and stop

    func start(instanceName: String, completion: @escaping (LANFailure?) -> Void) {
        queue.async {
            // Idempotent: the reconciler calls start whenever it is unsure.
            if self.listener != nil {
                completion(nil)
                return
            }
            // A refusal the previous attempt could not report in time.
            if self.policyDenied {
                self.policyDenied = false
                completion(.permissionDenied)
                return
            }
            self.instanceName = instanceName
            self.lastReportedAvailable = nil
            self.pendingStart = completion

            let parameters = NWParameters.tcp
            // Frames are small and latency matters more than packing: the mesh
            // writes one packet per call and waits for nothing.
            if let tcp = parameters.defaultProtocolStack.transportProtocol
                as? NWProtocolTCP.Options
            {
                tcp.noDelay = true
            }
            // Peer-to-peer so the listener is reachable over a link-local
            // address as well as a routed one.
            parameters.includePeerToPeer = true

            let listener: NWListener
            do {
                listener = try NWListener(using: parameters)
            } catch {
                self.instanceName = nil
                self.pendingStart = nil
                completion(.listenFailed(String(describing: error)))
                return
            }
            listener.service = NWListener.Service(
                name: instanceName,
                type: LANConst.serviceType
            )
            listener.newConnectionHandler = { [weak self] connection in
                self?.queue.async { self?.adopt(connection, direction: "in") }
            }
            listener.stateUpdateHandler = { [weak self] state in
                guard let self else { return }
                self.queue.async {
                    switch state {
                    case let .failed(error):
                        // Most often no usable network. Whoever is still waiting
                        // on start hears why; anyone later hears it as the
                        // transport going away.
                        self.settleStart(.unavailable(String(describing: error)))
                        self.report(available: false)
                    case .cancelled:
                        self.report(available: false)
                    case .ready:
                        self.settleStart(nil)
                        self.report(available: true)
                    default:
                        break
                    }
                }
            }
            self.listener = listener
            listener.start(queue: self.queue)

            self.startBrowsing(parameters: parameters)
        }
    }

    /// Answer the in-flight start exactly once. A listener reports `.ready` and
    /// later `.failed`, and only the first of those is the start's answer.
    private func settleStart(_ failure: LANFailure?) {
        guard let pending = pendingStart else { return }
        pendingStart = nil
        if failure != nil { instanceName = nil }
        pending(failure)
    }

    func stop(completion: @escaping () -> Void) {
        queue.async {
            self.browser?.cancel()
            self.browser = nil
            self.listener?.cancel()
            self.listener = nil
            self.instanceName = nil
            self.discovered.removeAll()
            self.linkByName.removeAll()
            self.settleStart(.unavailable("stopped"))
            for id in self.links.keys { self.closeLink(id) }
            completion()
        }
    }

    private func report(available: Bool) {
        guard lastReportedAvailable != available else { return }
        lastReportedAvailable = available
        emit(LANEvent.availabilityChanged, ["available": available])
    }

    // MARK: Discovery

    private func startBrowsing(parameters: NWParameters) {
        let descriptor = NWBrowser.Descriptor.bonjour(
            type: LANConst.serviceType,
            domain: LANConst.domain
        )
        let browser = NWBrowser(for: descriptor, using: parameters)
        browser.stateUpdateHandler = { [weak self] state in
            guard let self else { return }
            self.queue.async {
                if case let .failed(error) = state {
                    // Browsing is what raises the local network prompt, so a
                    // refusal shows up here rather than at start.
                    if case let .dns(code) = error, code == kDNSServiceErr_PolicyDenied {
                        self.policyDenied = true
                    }
                    self.report(available: false)
                }
            }
        }
        browser.browseResultsChangedHandler = { [weak self] results, _ in
            self?.queue.async { self?.applyBrowseResults(results) }
        }
        self.browser = browser
        browser.start(queue: queue)
    }

    /// Bonjour hands back the whole current set on every change rather than a
    /// delta, so this diffs against what we hold: anything new is announced,
    /// anything gone is retired.
    private func applyBrowseResults(_ results: Set<NWBrowser.Result>) {
        var seen: [String: NWEndpoint] = [:]
        for result in results {
            guard case let .service(name, _, _, _) = result.endpoint else { continue }
            // Our own record comes back off the network like anyone else's.
            if name == instanceName { continue }
            seen[name] = result.endpoint
        }

        for (name, endpoint) in seen where discovered[name] == nil {
            discovered[name] = endpoint
            emit(LANEvent.peerDiscovered, ["serviceName": name])
        }
        for name in discovered.keys where seen[name] == nil {
            discovered.removeValue(forKey: name)
            emit(LANEvent.peerLost, ["serviceName": name])
        }
    }

    // MARK: Links

    func connect(to serviceName: String, completion: @escaping (LANFailure?) -> Void) {
        queue.async {
            guard let endpoint = self.discovered[serviceName] else {
                completion(.unknownPeer(serviceName))
                return
            }
            // Idempotent, for the reason `linkByName` exists.
            if let existing = self.linkByName[serviceName], self.links[existing] != nil {
                completion(nil)
                return
            }
            let parameters = NWParameters.tcp
            parameters.includePeerToPeer = true
            let connection = NWConnection(to: endpoint, using: parameters)
            self.adopt(
                connection,
                direction: "out",
                serviceName: serviceName,
                onReady: completion
            )
        }
    }

    /// Register a connection and follow it to ready or failure.
    ///
    /// `onReady` is the dial's promise and fires exactly once. An inbound
    /// connection has no promise waiting, so it passes nil.
    private func adopt(
        _ connection: NWConnection,
        direction: String,
        serviceName: String? = nil,
        onReady: ((LANFailure?) -> Void)? = nil
    ) {
        linkSeq += 1
        let linkID = "lan-\(direction)-\(linkSeq)"
        links[linkID] = Link(connection: connection, serviceName: serviceName)
        if let serviceName { linkByName[serviceName] = linkID }

        var settled = false
        connection.stateUpdateHandler = { [weak self] state in
            guard let self else { return }
            self.queue.async {
                switch state {
                case .ready:
                    if !settled {
                        settled = true
                        onReady?(nil)
                    }
                    self.emit(LANEvent.linkConnected, ["linkID": linkID])
                    self.readFrame(linkID: linkID, connection: connection)
                case let .failed(error):
                    if !settled {
                        settled = true
                        // Most often client isolation, which every guest
                        // network enables and which cannot be detected before
                        // trying.
                        onReady?(.connectFailed(String(describing: error)))
                    }
                    self.retire(linkID)
                case .cancelled:
                    if !settled {
                        settled = true
                        onReady?(.connectFailed("cancelled"))
                    }
                    self.retire(linkID)
                default:
                    break
                }
            }
        }
        connection.start(queue: queue)
    }

    /// One frame, then schedule the next. Recursive rather than a loop because
    /// `receive` is callback-based: each completion queues the following read.
    private func readFrame(linkID: String, connection: NWConnection) {
        connection.receive(
            minimumIncompleteLength: 4,
            maximumLength: 4
        ) { [weak self] header, _, isComplete, error in
            guard let self else { return }
            self.queue.async {
                guard error == nil, !isComplete, let header,
                    let length = LANFrame.decodeLength(header)
                else {
                    self.closeLink(linkID)
                    return
                }
                connection.receive(
                    minimumIncompleteLength: length,
                    maximumLength: length
                ) { payload, _, payloadComplete, payloadError in
                    self.queue.async {
                        guard payloadError == nil, !payloadComplete, let payload,
                            payload.count == length
                        else {
                            self.closeLink(linkID)
                            return
                        }
                        self.emit(
                            LANEvent.packetReceived,
                            [
                                "linkID": linkID,
                                "dataBase64": payload.base64EncodedString(),
                            ]
                        )
                        self.readFrame(linkID: linkID, connection: connection)
                    }
                }
            }
        }
    }

    func write(
        linkID: String,
        payload: Data,
        completion: @escaping (LANFailure?) -> Void
    ) {
        queue.async {
            guard let link = self.links[linkID], !link.closing else {
                completion(.unknownLink(linkID))
                return
            }
            // `NWConnection.send` serialises on its own: frames queued from one
            // connection go out in order and cannot interleave, which is what
            // the Wi-Fi module needs a SerialSender to guarantee.
            link.connection.send(
                content: LANFrame.encode(payload),
                completion: .contentProcessed { [weak self] error in
                    guard let self else { return }
                    self.queue.async {
                        if let error {
                            // A refused write cannot carry the rest of the
                            // transfer either, so tear down here rather than
                            // wait for the read loop to notice.
                            self.closeLink(linkID)
                            completion(.writeFailed(String(describing: error)))
                        } else {
                            completion(nil)
                        }
                    }
                }
            )
        }
    }

    /// Ask a link to end. Cancelling drives the state handler, whose `.cancelled`
    /// branch calls `retire`, which is what reports it.
    private func closeLink(_ linkID: String) {
        guard var link = links[linkID], !link.closing else { return }
        link.closing = true
        links[linkID] = link
        link.connection.cancel()
    }

    /// Forget a link and tell TypeScript. Idempotent: a connection can report
    /// failed and then cancelled, and only the first of those retires it.
    private func retire(_ linkID: String) {
        guard let link = links.removeValue(forKey: linkID) else { return }
        // Only if it still points here: a newer link may have claimed the name,
        // and clearing it would make the live one look absent.
        if let name = link.serviceName, linkByName[name] == linkID {
            linkByName.removeValue(forKey: name)
        }
        emit(LANEvent.linkDisconnected, ["linkID": linkID])
    }
}

// MARK: - Bridge

@objc(AirhopLANModule)
final class AirhopLANModule: RCTEventEmitter {

    private lazy var transport = LANTransport { [weak self] name, body in
        self?.emit(name, body)
    }

    @objc override static func requiresMainQueueSetup() -> Bool { false }

    override func supportedEvents() -> [String]! {
        [
            LANEvent.peerDiscovered,
            LANEvent.peerLost,
            LANEvent.linkConnected,
            LANEvent.linkDisconnected,
            LANEvent.packetReceived,
            LANEvent.availabilityChanged,
        ]
    }

    /// Callers are framework callbacks with no bridge above them, and sending
    /// into a departed runtime traps.
    private func emit(_ name: String, _ body: [String: Any]) {
        guard bridge != nil else { return }
        sendEvent(withName: name, body: body)
    }

    // MARK: Exported

    @objc(startLAN:resolver:rejecter:)
    func startLAN(
        instanceName: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        transport.start(instanceName: instanceName) { failure in
            if let failure {
                reject(failure.code, failure.message, nil)
            } else {
                resolve(nil)
            }
        }
    }

    @objc(stopLAN:rejecter:)
    func stopLAN(
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        transport.stop { resolve(nil) }
    }

    @objc(connectToPeer:resolver:rejecter:)
    func connectToPeer(
        serviceName: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        transport.connect(to: serviceName) { failure in
            if let failure {
                reject(failure.code, failure.message, nil)
            } else {
                resolve(nil)
            }
        }
    }

    @objc(writeToLANLink:dataBase64:resolver:rejecter:)
    func writeToLANLink(
        linkID: String,
        dataBase64: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let payload = Data(base64Encoded: dataBase64) else {
            reject("INVALID_DATA", "Invalid base64 payload", nil)
            return
        }
        guard payload.count <= LANConst.maxFrame - 4 else {
            reject(
                "FRAME_TOO_LARGE",
                "Frame of \(payload.count) exceeds the peer's read limit",
                nil
            )
            return
        }
        transport.write(linkID: linkID, payload: payload) { failure in
            if let failure {
                reject(failure.code, failure.message, nil)
            } else {
                resolve(nil)
            }
        }
    }

    // MARK: Lifecycle

    /// Every link exists to hand bytes to a runtime that is gone, and a listener
    /// nobody hears is a socket left open.
    override func invalidate() {
        transport.stop {}
        super.invalidate()
    }
}
