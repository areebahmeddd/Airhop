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
    /// The bootstrap ran out its deadline without reaching 100%, or the SOCKS
    /// probe never answered. Terminal for this attempt.
    ///
    /// Without this, a circuit that never came up was indistinguishable from one
    /// still forming: the poll loop simply fell out of its `while`, `isStarting`
    /// stayed true forever, and JS went on showing "internet traffic onion
    /// routed" over a Tor client that had never carried a byte. The JS side has
    /// always had a handler for this state (`watchTorBootstrap`); it was the
    /// event that was missing, so the branch was unreachable and the
    /// "Tor blocked" banner was dead code.
    static let AirhopTorDidStall = Notification.Name("AirhopTorDidStall")
}

// ---- SOCKS endpoint ---------------------------------------------------------

/// Where Arti's SOCKS5 listener lives.
///
/// Outside the manager because it is read off the main actor: AirhopTorSocket
/// builds its URLSession on its own queue, and the manager is @MainActor, so
/// reaching through `AirhopTorManager.shared` for a constant is a data race the
/// compiler is right to reject. Both sides read these, so the port cannot drift.
enum AirhopTorEndpoint {
    /// Arti uses 39050, NOT 9050 (which is Orbot/C-Tor).
    static let socksHost = "127.0.0.1"
    static let socksPort = 39050
}

// ---- TorManager -------------------------------------------------------------

/// Manages the Arti Tor client lifecycle for Airhop.
///
/// Access the singleton via `AirhopTorManager.shared`.
/// All @Published properties are safe to observe from the main thread.
@MainActor
public final class AirhopTorManager: ObservableObject {
    public static let shared = AirhopTorManager()

    // SOCKS5 endpoint, shared with AirhopTorSocket. See AirhopTorEndpoint.
    let socksHost: String = AirhopTorEndpoint.socksHost
    let socksPort: Int = AirhopTorEndpoint.socksPort

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
#if canImport(Network)
    // Held so it is installed exactly once, and so a panic wipe can cancel it.
    private var pathMonitor: NWPathMonitor?
#endif
    private(set) public var allowAutoStart: Bool = false

    // Which start attempt is current. Both terminal paths clear `didStart` so a
    // new attempt can begin, which means an older attempt's poll loop or SOCKS
    // probe can still be alive and would otherwise stomp the new attempt's flags
    // and post a second stall. Each captures this and checks it before writing.
    private var attemptEpoch = 0

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
        attemptEpoch &+= 1
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

    /// Stop Arti and destroy everything it has written to disk. Panic wipe only.
    ///
    /// The data directory lives under Application Support, not the cache, so
    /// nothing the wipe already did reached it. What it holds is Tor client
    /// state - a cached consensus, chosen guard nodes, directory information,
    /// timestamps - which is on-disk evidence of the exact shape "this device
    /// used Tor, from around here, at around this time". A gesture whose whole
    /// promise is that local state is gone cannot leave that behind.
    ///
    /// Stopping first, because deleting a directory Arti still has open leaves
    /// it free to rewrite the files afterwards.
    ///
    /// `shutdownCompletely()` is fire-and-forget - it spawns a detached task and
    /// returns at once - so calling it and deleting on the next line did exactly
    /// what this comment says not to do. Awaiting the process actually being
    /// down is what makes the delete final.
    func wipeState() async {
        // Revoke the auto-start consent FIRST, or the wipe does not stick.
        //
        // A live NWPathMonitor calls ensureRunningOnForeground() on every
        // satisfied path update, and its only gate is this flag. Without
        // clearing it, a Wi-Fi to cellular handover seconds after the wipe
        // restarts Arti, which recreates the data directory and repopulates it -
        // restoring exactly the on-disk evidence this function exists to
        // destroy, for the rest of a process the wipe does not restart.
        allowAutoStart = false
#if canImport(Network)
        // Cancel the monitor outright as well as revoking consent. Belt and
        // braces on the one path that could undo this wipe.
        pathMonitor?.cancel()
        pathMonitor = nil
#endif
        shutdownCompletely()
        guard let dir = dataDirectoryURL() else { return }
        // The wait and the delete both run OFF the main actor.
        //
        // `arti_is_running()` is a synchronous FFI call and removeItem walks a
        // directory tree; doing either here would block the main thread for up
        // to five seconds during a gesture whose whole appeal is that it is
        // instant. shutdownCompletely() already polls on a detached task for the
        // same reason, so this matches it.
        await Task.detached(priority: .userInitiated) {
            var waited = 0
            while arti_is_running() != 0 && waited < 50 {
                try? await Task.sleep(nanoseconds: 100_000_000)
                waited += 1
            }
            // Deleted whether or not the stop completed. A directory unlinked
            // under a still-running Arti is worse than one deleted cleanly, but
            // it is far better than leaving the consensus and guard-node history
            // intact because shutdown was slow.
            try? FileManager.default.removeItem(at: dir)
        }.value
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
            // Released for the same reason as the deadline path below: this
            // attempt is over, so startIfNeeded() must be able to try again
            // rather than returning early for the rest of the process.
            didStart = false
            lastError = NSError(
                domain: "AirhopTorManager",
                code: Int(rc),
                userInfo: [NSLocalizedDescriptionKey: "arti_start failed (rc=\(rc))"]
            )
            // Terminal, and JS has to hear it. Arti never started, so no
            // bootstrap monitor runs and no stall deadline will ever elapse:
            // without this post the banner sits on "starting" for the whole
            // session over a Tor client that does not exist.
            NotificationCenter.default.post(name: .AirhopTorDidStall, object: nil)
            return
        }

        startBootstrapMonitor()

        // Poll SOCKS port readiness in parallel with the bootstrap monitor.
        Task.detached(priority: .userInitiated) { [weak self] in
            guard let self else { return }
            let epoch = await MainActor.run { self.attemptEpoch }
            let ready = await self.waitForSocksReady(timeout: 60.0)
            await MainActor.run {
                // A newer attempt has started; this result is about a run nobody
                // is waiting on any more.
                guard epoch == self.attemptEpoch else { return }
                self.socksReady = ready
                if !ready {
                    self.lastError = NSError(
                        domain: "AirhopTorManager",
                        code: -14,
                        userInfo: [NSLocalizedDescriptionKey: "SOCKS port not reachable within 60s"]
                    )
                    // Bootstrap can reach 100% while the proxy never accepts a
                    // connection, and that combination reported nothing: the
                    // poll loop exits "completed", so no stall fires, and
                    // recomputeReady only posts on the false-to-true edge. The
                    // banner then sat on "starting" forever over a circuit that
                    // was up but unusable. This is the same terminal state the
                    // deadline reports, so it says the same thing.
                    self.isStarting = false
                    self.didStart = false
                    self.bootstrapMonitorStarted = false
                    NotificationCenter.default.post(name: .AirhopTorDidStall, object: nil)
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
        let epoch = await MainActor.run { self.attemptEpoch }
        let deadline = Date().addingTimeInterval(75)
        var completed = false
        while Date() < deadline {
            let progress = Int(arti_bootstrap_progress())
            let summary = readBootstrapSummary()
            await MainActor.run {
                self.bootstrapProgress = progress
                self.bootstrapSummary = summary
                if progress >= 100 { self.isStarting = false }
                self.recomputeReady()
            }
            if progress >= 100 { completed = true; break }
            try? await Task.sleep(nanoseconds: 1_000_000_000)
        }
        guard !completed else { return }
        // The deadline passed with the circuit incomplete. Say so.
        //
        // This loop used to just end here, leaving `isStarting` true forever.
        // Everything downstream reads that as "still forming": the JS
        // revalidation on resume returns early on `isStarting`, so it never
        // corrected the claim, and the app kept promising onion routing over a
        // Tor client that had given up. A network that blocks Tor is a normal
        // condition in the places this app exists for, and it has to be
        // reportable rather than indistinguishable from a slow start.
        await MainActor.run {
            // Same reason as the SOCKS probe: do not report a stall against an
            // attempt that has already been superseded.
            guard epoch == self.attemptEpoch else { return }
            self.isStarting = false
            self.bootstrapMonitorStarted = false
            // Release the "already started" latch too. This attempt is over, so
            // a later startIfNeeded() has to be able to try again - without
            // this it returns early forever and recovery depended entirely on a
            // network change happening to fire the path monitor. A user who
            // walks out of a Tor-blocking network and reopens the app would
            // otherwise stay blocked until they toggled Tor off and on.
            self.didStart = false
            self.lastError = NSError(
                domain: "AirhopTorManager",
                code: -15,
                userInfo: [NSLocalizedDescriptionKey: "Tor bootstrap did not complete within 75s"]
            )
            self.recomputeReady()
            NotificationCenter.default.post(name: .AirhopTorDidStall, object: nil)
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
        // "IfNeeded" was aspirational: there was no guard, so every start
        // installed ANOTHER monitor. After a few restarts each network change
        // fanned out into that many concurrent ensureRunningOnForeground()
        // calls, and each monitor held its own dispatch queue for the life of
        // the process. The `restarting` claim downstream made it harmless for
        // correctness but not for cost.
        guard pathMonitor == nil else { return }
        let monitor = NWPathMonitor()
        pathMonitor = monitor
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
