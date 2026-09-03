// AirhopIPtProxy.swift
//
// The pluggable transports Arti dials to reach a bridge, built from
// native/iptproxy.
//
// Arti would normally run obfs4 and Snowflake as child processes, which iOS
// forbids. IPtProxy runs them in-process and exposes each as a SOCKS5 listener
// on loopback; this owns their lifecycle and reports the ports they landed on.
//
// Not main-actor isolated, and deliberately so: starting a transport launches a
// listener and, for Snowflake, contacts a broker over the network. Callers run
// it off the main thread, the same way they do Arti's own start.
//
// Mirrors android .../tor/AirhopIPtProxy.kt.

import Foundation
import IPtProxy

enum AirhopTransport: String {
    case obfs4
    case snowflake

    /// The transports named by a newline-separated list of bridge lines.
    ///
    /// Reads the first word of each line, where the Tor bridge format puts the
    /// transport name. Not a parser: Arti parses the lines authoritatively in
    /// `start`, so a line this misreads is refused there because its transport's
    /// port will be 0.
    static func named(in bridgeLines: String) -> Set<AirhopTransport> {
        var found: Set<AirhopTransport> = []
        for line in bridgeLines.split(separator: "\n") {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            guard !trimmed.isEmpty, !trimmed.hasPrefix("#") else { continue }
            var words = trimmed.split(separator: " ", omittingEmptySubsequences: true)
            // The word `Bridge` may lead the line; the transport follows it.
            if words.first?.lowercased() == "bridge" { words.removeFirst() }
            if let first = words.first, let transport = AirhopTransport(rawValue: String(first)) {
                found.insert(transport)
            }
        }
        return found
    }
}

final class AirhopIPtProxy: @unchecked Sendable {
    static let shared = AirhopIPtProxy()

    /// Guards both fields below. Every entry point is callable from any thread,
    /// and start and stop must not interleave.
    private let lock = NSLock()

    /// Nil until something asks for a transport: the controller writes to its
    /// state directory on construction, so it is not built for a user who never
    /// turns bridges on.
    private var controller: IPtProxyController?
    private var running: Set<AirhopTransport> = []

    private init() {}

    /// Where the transports keep state.
    ///
    /// Beside Arti's directory rather than inside it: the panic wipe deletes
    /// both, and Arti owns the layout of its own.
    static func stateDirectoryURL() -> URL? {
        guard let base = try? FileManager.default.url(
            for: .applicationSupportDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        ) else { return nil }
        return base.appendingPathComponent("airhop/iptproxy", isDirectory: true)
    }

    /// Start `transports`, returning the loopback port each is listening on, or
    /// nil if any could not start.
    ///
    /// A nil is fatal to the caller: Arti would otherwise be asked for a bridge
    /// whose transport is missing, and a user who asked for a bridge is likely
    /// somewhere a direct connection is unsafe.
    func start(_ transports: Set<AirhopTransport>) -> [AirhopTransport: UInt16]? {
        guard !transports.isEmpty else { return [:] }

        lock.lock()
        defer { lock.unlock() }

        guard let controller = ensureControllerLocked() else { return nil }

        var ports: [AirhopTransport: UInt16] = [:]
        for transport in transports {
            if !running.contains(transport) {
                do {
                    // No upstream proxy: Arti is the only thing dialling these.
                    try controller.start(transport.rawValue, proxy: "")
                } catch {
                    stopLocked()
                    return nil
                }
                running.insert(transport)
            }
            // Ports are assigned by the library, never chosen. A zero means the
            // listener is not up despite start having returned.
            let port = controller.port(transport.rawValue)
            guard port > 0, port <= 65535 else {
                stopLocked()
                return nil
            }
            ports[transport] = UInt16(port)
        }
        return ports
    }

    /// Stop every running transport. Safe to call when none are.
    func stop() {
        lock.lock()
        defer { lock.unlock() }
        stopLocked()
    }

    /// Stop the transports and delete everything they wrote.
    ///
    /// Panic wipe only. The state directory records which transports ran, and a
    /// gesture that promises local state is gone cannot leave that behind.
    func wipeState() {
        lock.lock()
        stopLocked()
        controller = nil
        lock.unlock()

        guard let dir = Self.stateDirectoryURL() else { return }
        try? FileManager.default.removeItem(at: dir)
    }

    // MARK: - Private

    private func stopLocked() {
        guard let controller else { return }
        for transport in running {
            controller.stop(transport.rawValue)
        }
        running.removeAll()
    }

    private func ensureControllerLocked() -> IPtProxyController? {
        if let controller { return controller }
        guard let dir = Self.stateDirectoryURL()?.path else { return nil }
        try? FileManager.default.createDirectory(
            at: URL(fileURLWithPath: dir), withIntermediateDirectories: true
        )

        // Logging off. The log records bridge addresses, which is the most
        // incriminating thing this device could write down, and nothing reads it.
        //
        // The initialiser returns nil rather than throwing when it cannot set up
        // its directory, so a nil here is a real failure.
        guard let created = IPtProxyController(
            dir,
            enableLogging: false,
            unsafeLogging: false,
            logLevel: "ERROR",
            transportEvents: nil
        ) else { return nil }

        // Snowflake's rendezvous settings, which a bridge line may also carry.
        // IPtProxy applies these only where the line left a value empty, so a
        // pasted line still wins.
        created.snowflakeBrokerUrl = AirhopSnowflake.brokerURL
        created.snowflakeFrontDomains = AirhopSnowflake.frontDomains
        created.snowflakeIceServers = AirhopSnowflake.iceServers

        controller = created
        return created
    }
}

/// Snowflake rendezvous defaults, matching what Tor Browser ships.
///
/// Set on the controller rather than written into a bridge line, so the line
/// stays short: Arti passes settings through the SOCKS5 handshake, which allows
/// 510 bytes, and a full Snowflake line comes close to that on its own.
enum AirhopSnowflake {
    static let brokerURL = "https://1098762253.rsc.cdn77.org/"
    static let frontDomains = "www.cdn77.com,www.phpmyadmin.net"
    static let iceServers =
        "stun:stun.l.google.com:19302,stun:stun.antisip.com:3478,"
        + "stun:stun.bluesip.net:3478,stun:stun.dus.net:3478,"
        + "stun:stun.epygi.com:3478"
}
