// AirhopTorManager.swift
//
// Arti-based Tor integration for Airhop.
//
// Boots a local Arti client and exposes a SOCKS5 proxy on 127.0.0.1:39050.
// NostrClient and any other internet-bound networking should await readiness
// before connecting, then route all traffic through this proxy.
//
// Binary dependency: ios/Frameworks/arti.xcframework (must be added to the
// Xcode target under "Frameworks, Libraries, and Embedded Content").

import Foundation
#if canImport(Network)
import Network
#endif

// ---- Arti FFI declarations --------------------------------------------------
// Symbols exported from arti.xcframework (Rust static library).
// These map directly to the C ABI exposed by the Arti client library.

@_silgen_name("arti_start")
private func arti_start(_ dataDir: UnsafePointer<CChar>, _ socksPort: UInt16) -> Int32

@_silgen_name("arti_stop")
private func arti_stop() -> Int32

@_silgen_name("arti_is_running")
private func arti_is_running() -> Int32

@_silgen_name("arti_bootstrap_progress")
private func arti_bootstrap_progress() -> Int32

@_silgen_name("arti_bootstrap_summary")
private func arti_bootstrap_summary(_ buf: UnsafeMutablePointer<CChar>, _ len: Int32) -> Int32

// ---- Notification names -----------------------------------------------------

public extension Notification.Name {
    static let AirhopTorWillStart    = Notification.Name("AirhopTorWillStart")
    static let AirhopTorWillRestart  = Notification.Name("AirhopTorWillRestart")
    static let AirhopTorDidBecomeReady = Notification.Name("AirhopTorDidBecomeReady")
}

// ---- TorManager -------------------------------------------------------------

/// Manages the Arti Tor client lifecycle for Airhop.
///
/// Access the singleton via `AirhopTorManager.shared`.
/// All @Published properties are safe to observe from the main thread.
@MainActor
public final class AirhopTorManager: ObservableObject {
    public static let shared = AirhopTorManager()

    // SOCKS5 endpoint. Arti uses port 39050, NOT 9050 (which is Orbot/C-Tor).
    let socksHost: String = "127.0.0.1"
    let socksPort: Int = 39050

    // MARK: - Published state

    @Published private(set) public var isReady: Bool = false
    @Published private(set) public var isStarting: Bool = false
    @Published private(set) public var lastError: Error?
    @Published private(set) public var bootstrapProgress: Int = 0
    @Published private(set) public var bootstrapSummary: String = ""

    // MARK: - Private state

    private var socksReady: Bool = false { didSet { recomputeReady() } }
    private var restarting: Bool = false
    private var didStart = false
    private var shutdownsInFlight = 0
    private var startPendingAfterShutdown = false
    private var bootstrapMonitorStarted = false
    private var isAppForeground: Bool = true
    private var lastRestartAt: Date? = nil
    private(set) public var allowAutoStart: Bool = false

    private init() {}

    // MARK: - Public API

    /// Allow automatic startup on the next `startIfNeeded()` call.
    public func enableAutoStart() {
        allowAutoStart = true
    }

    /// Start Arti if not already running. No-op when `allowAutoStart` is false.
    public func startIfNeeded() {
        guard allowAutoStart else { return }
        guard isAppForeground else { return }
        if shutdownsInFlight > 0 {
            startPendingAfterShutdown = true
            return
        }
        guard !didStart else { return }
        didStart = true
        isStarting = true
        lastError = nil
        NotificationCenter.default.post(name: .AirhopTorWillStart, object: nil)
        ensureFilesystemLayout()
        startArti()
        startPathMonitorIfNeeded()
    }

    public func setAppForeground(_ foreground: Bool) {
        isAppForeground = foreground
    }

    /// Wait up to `timeout` seconds for Arti to be bootstrapped and SOCKS-ready.
    /// Returns true when ready, false on timeout.
    nonisolated
    public func awaitReady(timeout: TimeInterval = 75.0) async -> Bool {
        await MainActor.run {
            if self.isAppForeground { self.startIfNeeded() }
        }
        let deadline = Date().addingTimeInterval(timeout)
        if await MainActor.run(body: { self.isReady }) { return true }
        while Date() < deadline {
            try? await Task.sleep(nanoseconds: 200_000_000)
            if await MainActor.run(body: { self.isReady }) { return true }
        }
        return await MainActor.run(body: { self.isReady })
    }

    /// Called when the app enters the background. Marks as not ready so that
    /// foreground recovery triggers a full restart.
    public func goDormantOnBackground() {
        Task { @MainActor in
            self.isReady = false
            self.socksReady = false
            self.isStarting = false
        }
    }

    /// Called when the app returns to the foreground; triggers a restart if needed.
    public func ensureRunningOnForeground() {
        guard allowAutoStart else { return }
        Task.detached(priority: .userInitiated) { [weak self] in
            guard let self else { return }
            let claimed = await MainActor.run {
                if self.isStarting || self.restarting { return false }
                self.restarting = true
                return true
            }
            guard claimed else { return }
            let ready = await MainActor.run { self.isReady }
            if ready {
                await MainActor.run { self.restarting = false }
                return
            }
            await self.restartArti()
            await MainActor.run { self.restarting = false }
        }
    }

    /// Fully shuts down Arti. Safe to call from any context.
    public func shutdownCompletely() {
        startPendingAfterShutdown = false
        shutdownsInFlight += 1
        Task.detached { [weak self] in
            guard let self else { return }
            _ = arti_stop()
            var waited = 0
            while arti_is_running() != 0 && waited < 50 {
                try? await Task.sleep(nanoseconds: 100_000_000)
                waited += 1
            }
            await MainActor.run {
                self.isReady = false
                self.socksReady = false
                self.bootstrapProgress = 0
                self.bootstrapSummary = ""
                self.isStarting = false
                self.didStart = false
                self.restarting = false
                self.bootstrapMonitorStarted = false
                self.shutdownsInFlight -= 1
                if self.shutdownsInFlight == 0 && self.startPendingAfterShutdown {
                    self.startPendingAfterShutdown = false
                    self.startIfNeeded()
                }
            }
        }
    }

    // MARK: - Filesystem

    func dataDirectoryURL() -> URL? {
        guard let base = try? FileManager.default.url(
            for: .applicationSupportDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        ) else { return nil }
        return base.appendingPathComponent("airhop/arti", isDirectory: true)
    }

    private func ensureFilesystemLayout() {
        guard let dir = dataDirectoryURL() else { return }
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
    }

    // MARK: - Arti integration

    private func startArti() {
        guard let dir = dataDirectoryURL()?.path else {
            isStarting = false
            lastError = NSError(
                domain: "AirhopTorManager",
                code: -1,
                userInfo: [NSLocalizedDescriptionKey: "Data directory unavailable"]
            )
            return
        }

        if arti_is_running() != 0 {
            // Already running, just monitor bootstrap progress.
            startBootstrapMonitor()
            return
        }

        let rc = dir.withCString { arti_start($0, UInt16(socksPort)) }
        guard rc == 0 else {
            isStarting = false
            lastError = NSError(
                domain: "AirhopTorManager",
                code: Int(rc),
                userInfo: [NSLocalizedDescriptionKey: "arti_start failed (rc=\(rc))"]
            )
            return
        }

        startBootstrapMonitor()

        // Poll SOCKS port readiness in parallel with the bootstrap monitor.
        Task.detached(priority: .userInitiated) { [weak self] in
            guard let self else { return }
            let ready = await self.waitForSocksReady(timeout: 60.0)
            await MainActor.run {
                self.socksReady = ready
                if !ready {
                    self.lastError = NSError(
                        domain: "AirhopTorManager",
                        code: -14,
                        userInfo: [NSLocalizedDescriptionKey: "SOCKS port not reachable within 60s"]
                    )
                }
            }
        }
    }

    private func restartArti() async {
        await MainActor.run {
            NotificationCenter.default.post(name: .AirhopTorWillRestart, object: nil)
            self.isReady = false
            self.socksReady = false
            self.bootstrapProgress = 0
            self.bootstrapSummary = ""
            self.isStarting = true
            self.lastRestartAt = Date()
        }
        _ = arti_stop()
        var waited = 0
        while arti_is_running() != 0 && waited < 40 {
            try? await Task.sleep(nanoseconds: 100_000_000)
            waited += 1
        }
        await MainActor.run {
            self.bootstrapMonitorStarted = false
            self.didStart = false
            self.startIfNeeded()
        }
    }

    // MARK: - Bootstrap monitoring

    private func startBootstrapMonitor() {
        guard !bootstrapMonitorStarted else { return }
        bootstrapMonitorStarted = true
        Task.detached(priority: .utility) { [weak self] in
            await self?.bootstrapPollLoop()
        }
    }

    private func bootstrapPollLoop() async {
        let deadline = Date().addingTimeInterval(75)
        while Date() < deadline {
            let progress = Int(arti_bootstrap_progress())
            let summary = readBootstrapSummary()
            await MainActor.run {
                self.bootstrapProgress = progress
                self.bootstrapSummary = summary
                if progress >= 100 { self.isStarting = false }
                self.recomputeReady()
            }
            if progress >= 100 { break }
            try? await Task.sleep(nanoseconds: 1_000_000_000)
        }
    }

    private func readBootstrapSummary() -> String {
        var buf = [CChar](repeating: 0, count: 256)
        let len = arti_bootstrap_summary(&buf, Int32(buf.count))
        return len > 0 ? String(cString: buf) : ""
    }

    private func recomputeReady() {
        let newReady = socksReady && bootstrapProgress >= 100
        if newReady && !isReady {
            isReady = true
            NotificationCenter.default.post(name: .AirhopTorDidBecomeReady, object: nil)
        } else if !newReady {
            isReady = false
        }
    }

    // MARK: - SOCKS readiness probe

    private func waitForSocksReady(timeout: TimeInterval) async -> Bool {
        let deadline = Date().addingTimeInterval(timeout)
        while Date() < deadline {
            if await probeSocksOnce() { return true }
            try? await Task.sleep(nanoseconds: 250_000_000)
        }
        return false
    }

    private func probeSocksOnce() async -> Bool {
#if canImport(Network)
        await withCheckedContinuation { cont in
            let params = NWParameters.tcp
            guard let port = NWEndpoint.Port(rawValue: UInt16(socksPort)) else {
                cont.resume(returning: false)
                return
            }
            let conn = NWConnection(
                to: .hostPort(host: .ipv4(.loopback), port: port),
                using: params
            )
            var resumed = false
            let finish: (Bool) -> Void = { value in
                guard !resumed else { return }
                resumed = true
                cont.resume(returning: value)
            }
            conn.stateUpdateHandler = { state in
                switch state {
                case .ready:
                    finish(true)
                    conn.cancel()
                case .failed, .cancelled:
                    finish(false)
                default:
                    break
                }
            }
            DispatchQueue.global(qos: .utility).asyncAfter(deadline: .now() + 1.0) {
                finish(false)
                conn.cancel()
            }
            conn.start(queue: .global(qos: .utility))
        }
#else
        return false
#endif
    }

    // MARK: - Path monitoring (network change recovery)

    private func startPathMonitorIfNeeded() {
#if canImport(Network)
        let monitor = NWPathMonitor()
        monitor.pathUpdateHandler = { [weak self] path in
            guard let self else { return }
            if path.status == .satisfied {
                Task { @MainActor in
                    self.ensureRunningOnForeground()
                }
            }
        }
        monitor.start(queue: DispatchQueue.global(qos: .utility))
#endif
    }
}
