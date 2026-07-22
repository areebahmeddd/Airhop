// AirhopTorSession.swift
//
// URLSession factory that routes traffic through Arti's SOCKS5 proxy when Tor
// is active.
//
// Usage:
//   let session = AirhopTorSession.shared.session
//   let (data, _) = try await session.data(from: url)

import Foundation

/// Provides URLSession instances configured to use the Arti SOCKS5 proxy
/// on 127.0.0.1:39050, or a direct session when Tor is not available.
///
/// `NostrClient` and any other internet-bound code should obtain their
/// URLSession from here rather than constructing one directly.
public final class AirhopTorSession {
    public static let shared = AirhopTorSession()

    private var torSession: URLSession = AirhopTorSession.makeTorSession()
    private var directSession: URLSession = AirhopTorSession.makeDirectSession()
    private var useTorProxy: Bool = true

    private init() {}

    /// The active URLSession. Routes through SOCKS5 when `useTorProxy` is true.
    public var session: URLSession {
        useTorProxy ? torSession : directSession
    }

    /// Switch between Tor-proxied and direct sessions.
    public func setProxyMode(useTor: Bool) {
        guard useTorProxy != useTor else { return }
        useTorProxy = useTor
        rebuild()
    }

    /// Recreate both sessions. Call after Tor restarts so new connections use the fresh port.
    public func rebuild() {
        torSession = AirhopTorSession.makeTorSession()
        directSession = AirhopTorSession.makeDirectSession()
    }

    // MARK: - Session factories

    private static func makeTorSession() -> URLSession {
        let cfg = URLSessionConfiguration.ephemeral
        cfg.waitsForConnectivity = true
        // Arti SOCKS5 port: 39050 (distinct from Orbot/C-Tor which uses 9050).
        cfg.connectionProxyDictionary = [
            "SOCKSEnable": 1,
            "SOCKSProxy": "127.0.0.1",
            "SOCKSPort":  39050,
        ]
        return URLSession(configuration: cfg)
    }

    private static func makeDirectSession() -> URLSession {
        let cfg = URLSessionConfiguration.default
        cfg.waitsForConnectivity = true
        return URLSession(configuration: cfg)
    }
}
