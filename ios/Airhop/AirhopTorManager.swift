// AirhopTorManager.swift
//
// Arti-based Tor integration for Airhop.
//
// Boots the embedded Tor client from native/arti and exposes its SOCKS5 proxy
// on 127.0.0.1:39050. NostrClient and anything else internet-bound routes
// through that port; nothing else in the app talks to Tor.
//
// Binary dependency: ios/Frameworks/arti.xcframework, built by
// native/arti/build-apple.sh from native/arti/src. The header beside the
// library is generated from src/ffi.rs, so the declarations below and the Rust
// they bind to cannot drift without the build saying so.

import Foundation
#if canImport(Network)
import Network
#endif

// ---- Arti FFI ---------------------------------------------------------------
//
// Five entry points, all of them cheap and none of them blocking. See
// native/arti/src/ffi.rs for the contract and the error codes.
//
// Bound by symbol rather than through a bridging header, which keeps the Xcode
// target free of a modulemap for five functions. A symbol that is missing
// outright is a link error, so a rename cannot reach a user. What the linker
// will not catch is a symbol present in one slice and absent from another, which
// is what a partial rebuild produces and which only fails when somebody happens
// to build for that slice. build-apple.sh checks all five in every slice for
// exactly that reason.

@_silgen_name("airhop_tor_start")
private func airhop_tor_start(_ dataDir: UnsafePointer<CChar>, _ socksPort: UInt16) -> Int32

@_silgen_name("airhop_tor_stop")
private func airhop_tor_stop() -> Int32

@_silgen_name("airhop_tor_set_dormant")
private func airhop_tor_set_dormant(_ dormant: Bool) -> Int32

@_silgen_name("airhop_tor_status")
private func airhop_tor_status() -> Int32

@_silgen_name("airhop_tor_summary")
private func airhop_tor_summary(_ buf: UnsafeMutablePointer<CChar>, _ len: Int32) -> Int32

/// What Arti reports about itself, decoded from the packed status word.
///
/// The Rust side owns this state, so nothing here caches it. Asking is a lock
/// and a few bit shifts, which is cheaper than the bookkeeping needed to keep a
/// mirror of it honest, and a mirror is what used to let the manager believe Tor
/// was running after it had stopped.
struct ArtiStatus {
    let running: Bool
    let ready: Bool
    let blocked: Bool
    let progress: Int

    // Mirrors AIRHOP_TOR_STATUS_* in native/arti/src/lib.rs.
    private static let bitRunning: Int32 = 1 << 0
    private static let bitReady: Int32 = 1 << 1
    private static let bitBlocked: Int32 = 1 << 2
    private static let progressShift: Int32 = 8

    init(packed: Int32) {
        running = packed & Self.bitRunning != 0
        ready = packed & Self.bitReady != 0
        blocked = packed & Self.bitBlocked != 0
        progress = Int((packed >> Self.progressShift) & 0xFF)
    }

    /// Safe to read at any time, including before a start and after a stop.
    static var current: ArtiStatus { ArtiStatus(packed: airhop_tor_status()) }

    /// Arti's own description of the current stage. Display and logs only.
    static var summary: String {
        var buf = [CChar](repeating: 0, count: 256)
        let written = airhop_tor_summary(&buf, Int32(buf.count))
        return written > 0 ? String(cString: buf) : ""
    }
}

// ---- Notification names -----------------------------------------------------

public extension Notification.Name {
    static let AirhopTorWillStart      = Notification.Name("AirhopTorWillStart")
    static let AirhopTorWillRestart    = Notification.Name("AirhopTorWillRestart")
    static let AirhopTorDidBecomeReady = Notification.Name("AirhopTorDidBecomeReady")
    /// Tor is not going to connect on this network, or has stopped being able
    /// to. Terminal for this attempt.
    ///
    /// Two things reach it. Arti reporting that it cannot make forward progress,
    /// which is what a network blocking Tor produces and which now arrives in
    /// seconds rather than being inferred, and the bootstrap deadline elapsing,
    /// which is the backstop for a bootstrap that is neither progressing nor
    /// admitting it. Without this the app cannot tell "still forming" from
    /// "never coming" and goes on claiming onion routing over a client that has
    /// given up.
    static let AirhopTorDidStall       = Notification.Name("AirhopTorDidStall")
}

// ---- SOCKS endpoint ---------------------------------------------------------

/// Where Arti's SOCKS5 listener lives.
///
/// Outside the manager because it is read off the main actor: AirhopTorSocket
/// builds its URLSession on its own queue and the manager is @MainActor, so
/// reaching through the singleton for a constant is a data race the compiler is
/// right to reject. Both sides read these, so the port cannot drift.
enum AirhopTorEndpoint {
    /// 39050, not 9050. Nothing else on the device is expected to hold it, and
    /// keeping clear of the conventional Tor port avoids colliding with a
    /// separately installed Tor the user is running for something else.
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

    let socksHost: String = AirhopTorEndpoint.socksHost
    let socksPort: Int = AirhopTorEndpoint.socksPort

    // MARK: - Published state

    @Published private(set) public var isReady: Bool = false
    @Published private(set) public var isStarting: Bool = false
    @Published private(set) public var lastError: Error?
    @Published private(set) public var bootstrapProgress: Int = 0
    @Published private(set) public var bootstrapSummary: String = ""

    // MARK: - Private state

    private var restarting: Bool = false
    private var isAppForeground: Bool = true
#if canImport(Network)
    // Held so it is installed exactly once, and so a wipe can cancel it.
    private var pathMonitor: NWPathMonitor?
#endif
    private(set) public var allowAutoStart: Bool = false

    /// Which start attempt is current.
    ///
    /// A poll loop belonging to a superseded attempt can still be alive, and
    /// would otherwise stomp the new attempt's flags and post a second stall. It
    /// captures this and checks it before writing.
    private var attemptEpoch = 0

    /// How long a bootstrap may run without either completing or admitting it is
    /// blocked. A backstop, not the primary signal: Arti reports a blockage
    /// directly and usually long before this.
    private static let bootstrapDeadline: TimeInterval = 75

    private init() {}

    // MARK: - Public API

    /// Allow automatic startup on the next `startIfNeeded()` call.
    public func enableAutoStart() {
        allowAutoStart = true
    }

    /// Start Arti if it is not already running. No-op when `allowAutoStart` is
    /// false or the app is in the background.
    ///
    /// Whether a client already exists is asked of Arti rather than tracked
    /// here. A second `start` while one is running is refused by the Rust under
    /// its own lock, so this is safe to call from several places at once.
    public func startIfNeeded() {
        guard allowAutoStart, isAppForeground else { return }
        guard !ArtiStatus.current.running else { return }

        attemptEpoch &+= 1
        let epoch = attemptEpoch
        isStarting = true
        lastError = nil
        bootstrapProgress = 0
        bootstrapSummary = ""
        NotificationCenter.default.post(name: .AirhopTorWillStart, object: nil)

        guard let dir = dataDirectoryURL()?.path else {
            failAttempt(epoch, code: -1, message: "Data directory unavailable")
            return
        }
        try? FileManager.default.createDirectory(
            at: URL(fileURLWithPath: dir), withIntermediateDirectories: true
        )

        // Off the main actor: building the client touches the filesystem and
        // acquires Arti's state-directory lock, and neither belongs on the
        // thread drawing the settings screen.
        Task.detached(priority: .userInitiated) { [weak self] in
            let rc = dir.withCString { airhop_tor_start($0, UInt16(AirhopTorEndpoint.socksPort)) }
            await MainActor.run {
                guard let self, epoch == self.attemptEpoch else { return }
                guard rc == 0 else {
                    // Arti never started, so no bootstrap will run and no
                    // deadline will elapse. Without reporting it here the banner
                    // sits on "starting" for the whole session over a client
                    // that does not exist.
                    self.failAttempt(epoch, code: Int(rc), message: "arti start failed (rc=\(rc))")
                    return
                }
                // The listener is bound by the time start returns, so there is
                // nothing to probe for. The implementation this replaced bound
                // the port only after bootstrap, which is why it needed a
                // separate SOCKS reachability poll and a second timeout to go
                // with it.
                self.startStatusPoll(epoch)
                self.startPathMonitorIfNeeded()
            }
        }
    }

    public func setAppForeground(_ foreground: Bool) {
        isAppForeground = foreground
    }

    /// Wait up to `timeout` seconds for Tor to be ready. Returns false on
    /// timeout.
    nonisolated
    public func awaitReady(timeout: TimeInterval = 75.0) async -> Bool {
        await MainActor.run {
            if self.isAppForeground { self.startIfNeeded() }
        }
        let deadline = Date().addingTimeInterval(timeout)
        while Date() < deadline {
            if ArtiStatus.current.ready { return true }
            try? await Task.sleep(nanoseconds: 200_000_000)
        }
        return ArtiStatus.current.ready
    }

    /// Called when the app enters the background.
    ///
    /// Puts Arti to sleep rather than stopping it. iOS suspends the process, so
    /// circuits and guard connections do not survive a long background spell
    /// either way, but dormancy lets Arti wind its own background work down and
    /// pick it up again on resume. Stopping instead would drop the guards, cost
    /// the user a fresh bootstrap on every return to the app, and make this
    /// device look like a brand new client to a guard each time.
    public func goDormantOnBackground() {
        _ = airhop_tor_set_dormant(true)
        // The claim comes down with it. Whether circuits survived the suspension
        // is not knowable until Arti wakes and says so, and "ready" must never
        // be asserted on the strength of having been ready earlier.
        isReady = false
    }

    /// Called when the app returns to the foreground.
    ///
    /// Wakes Arti, and starts it only if it is genuinely gone. The restart path
    /// exists for a client the OS reclaimed, not for a normal resume.
    public func ensureRunningOnForeground() {
        guard allowAutoStart else { return }
        _ = airhop_tor_set_dormant(false)

        let status = ArtiStatus.current
        if status.running {
            // Alive, so let the poll loop report what waking up produced rather
            // than asserting anything here.
            applyStatus(status)
            if pollTask == nil { startStatusPoll(attemptEpoch) }
            return
        }
        guard !restarting, !isStarting else { return }
        restarting = true
        NotificationCenter.default.post(name: .AirhopTorWillRestart, object: nil)
        isStarting = true
        startIfNeeded()
        restarting = false
    }

    /// Fully shut Arti down. Safe to call from any context.
    ///
    /// Revokes auto-start consent, because a complete shutdown is only reached
    /// by the user switching Tor off or by a panic wipe, and both are
    /// withdrawals. Leaving the flag set keeps the path monitor eligible to
    /// restart Arti behind someone who turned it off, burning battery and
    /// repopulating the data directory a wipe exists to destroy. `startTor`
    /// re-grants it.
    public func shutdownCompletely() {
        allowAutoStart = false
#if canImport(Network)
        pathMonitor?.cancel()
        pathMonitor = nil
#endif
        attemptEpoch &+= 1
        stopStatusPoll()
        isReady = false
        isStarting = false
        bootstrapProgress = 0
        bootstrapSummary = ""
        restarting = false

        // Off the main actor: stop waits for the runtime to wind down, bounded
        // in Rust at two seconds, and that must not land on the thread drawing
        // the toggle the user just tapped.
        Task.detached(priority: .userInitiated) {
            _ = airhop_tor_stop()
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

    /// Stop Arti and destroy everything it has written to disk. Panic wipe only.
    ///
    /// The data directory lives under Application Support rather than the cache,
    /// so nothing the wipe already did reached it. What it holds is Tor client
    /// state: a cached consensus, chosen guard nodes, directory information,
    /// timestamps. Together that is on-disk evidence of the shape "this device
    /// used Tor, from around here, at around this time". A gesture whose whole
    /// promise is that local state is gone cannot leave it behind.
    ///
    /// Waits for Arti to actually be down before deleting, because a directory
    /// removed under a running client is one the client is free to rewrite.
    func wipeState() async {
        // Revoke auto-start consent FIRST, or the wipe does not stick. A live
        // NWPathMonitor calls ensureRunningOnForeground() on every satisfied
        // path update and its only gate is this flag, so a Wi-Fi to cellular
        // handover seconds later would restart Arti and repopulate exactly the
        // evidence this exists to destroy.
        allowAutoStart = false
#if canImport(Network)
        pathMonitor?.cancel()
        pathMonitor = nil
#endif
        attemptEpoch &+= 1
        stopStatusPoll()
        isReady = false
        isStarting = false

        guard let dir = dataDirectoryURL() else { return }
        // Both the stop and the delete run off the main actor. `airhop_tor_stop`
        // blocks while the runtime winds down and `removeItem` walks a directory
        // tree, and neither belongs on the main thread during a gesture whose
        // whole appeal is that it is instant.
        await Task.detached(priority: .userInitiated) {
            _ = airhop_tor_stop()
            // Deleted whether or not the stop reported success. A directory
            // unlinked under a still-running Arti is worse than one deleted
            // cleanly, and far better than leaving the consensus and guard
            // history intact because shutdown was slow.
            try? FileManager.default.removeItem(at: dir)
        }.value
    }

    // MARK: - Status polling

    private var pollTask: Task<Void, Never>?

    /// Mirror Arti's status into the published properties.
    ///
    /// Polling rather than a callback, because a callback from a Rust thread
    /// into Swift would need its own lifetime rules and the thing being watched
    /// changes a handful of times a minute. The interval is what keeps it cheap:
    /// once a second while something is happening, once every ten seconds when
    /// nothing is.
    private func startStatusPoll(_ epoch: Int) {
        stopStatusPoll()
        let deadline = Date().addingTimeInterval(Self.bootstrapDeadline)
        pollTask = Task { [weak self] in
            while !Task.isCancelled {
                guard let self else { return }
                let status = ArtiStatus.current
                let summary = ArtiStatus.summary
                let stop = await MainActor.run { () -> Bool in
                    guard epoch == self.attemptEpoch else { return true }
                    self.bootstrapSummary = summary
                    self.applyStatus(status)

                    if status.blocked {
                        // Arti says it cannot get there from here. This is the
                        // answer a censored network gives, and reporting it is
                        // the difference between "Airhop is broken" and "this
                        // network blocks Tor".
                        self.reportStall(
                            epoch,
                            code: -15,
                            message: summary.isEmpty ? "Tor cannot connect on this network" : summary
                        )
                        return true
                    }
                    if !status.running {
                        // Gone without anyone here asking for it.
                        self.reportStall(epoch, code: -16, message: "Tor stopped unexpectedly")
                        return true
                    }
                    if !status.ready, Date() >= deadline {
                        self.reportStall(
                            epoch, code: -15, message: "Tor did not connect within 75s"
                        )
                        return true
                    }
                    return false
                }
                if stop { return }
                // Ready is the quiet state, but not a finished one: circuits are
                // lost and rebuilt, and a claim that stops being true has to be
                // withdrawn rather than left standing until the next foreground.
                let interval: UInt64 = status.ready ? 10_000_000_000 : 1_000_000_000
                try? await Task.sleep(nanoseconds: interval)
            }
        }
    }

    private func stopStatusPoll() {
        pollTask?.cancel()
        pollTask = nil
    }

    private func applyStatus(_ status: ArtiStatus) {
        bootstrapProgress = status.progress
        isStarting = status.running && !status.ready && !status.blocked
        if status.ready, !isReady {
            isReady = true
            NotificationCenter.default.post(name: .AirhopTorDidBecomeReady, object: nil)
        } else if !status.ready {
            isReady = false
        }
    }

    /// A start that never got as far as running.
    private func failAttempt(_ epoch: Int, code: Int, message: String) {
        guard epoch == attemptEpoch else { return }
        isStarting = false
        lastError = NSError(
            domain: "AirhopTorManager", code: code,
            userInfo: [NSLocalizedDescriptionKey: message]
        )
        NotificationCenter.default.post(name: .AirhopTorDidStall, object: nil)
    }

    /// A start that ran and then stopped going anywhere.
    private func reportStall(_ epoch: Int, code: Int, message: String) {
        guard epoch == attemptEpoch else { return }
        isStarting = false
        isReady = false
        stopStatusPoll()
        lastError = NSError(
            domain: "AirhopTorManager", code: code,
            userInfo: [NSLocalizedDescriptionKey: message]
        )
        NotificationCenter.default.post(name: .AirhopTorDidStall, object: nil)
    }

    // MARK: - Path monitoring (network change recovery)

    private func startPathMonitorIfNeeded() {
#if canImport(Network)
        // "IfNeeded" was once aspirational: with no guard, every start installed
        // another monitor, so each network change fanned out into that many
        // concurrent recovery attempts and each monitor held a dispatch queue
        // for the life of the process.
        guard pathMonitor == nil else { return }
        let monitor = NWPathMonitor()
        pathMonitor = monitor
        monitor.pathUpdateHandler = { [weak self] path in
            guard path.status == .satisfied else { return }
            Task { @MainActor in
                self?.ensureRunningOnForeground()
            }
        }
        monitor.start(queue: DispatchQueue.global(qos: .utility))
#endif
    }
}
