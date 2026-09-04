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
// library is generated from src/ffi_c.rs, so the declarations below and the Rust
// they bind to cannot drift without the build saying so.

import Foundation
#if canImport(Network)
import Network
#endif

// ---- Arti FFI ---------------------------------------------------------------
//
// Cheap and non-blocking. See native/arti/src/ffi_c.rs for the contract and the
// error codes.
//
// Bound by symbol rather than through a bridging header, which keeps the Xcode
// target free of a modulemap for a handful of functions. A missing symbol is a link
// error; what the linker cannot catch is one present in a device slice and
// absent from a simulator slice, which build-apple.sh checks for.

@_silgen_name("airhop_tor_start")
private func airhop_tor_start(
    _ dataDir: UnsafePointer<CChar>,
    _ socksPort: UInt16,
    _ bridgeLines: UnsafePointer<CChar>?,
    _ obfs4Port: UInt16,
    _ snowflakePort: UInt16
) -> Int32

@_silgen_name("airhop_tor_stop")
private func airhop_tor_stop() -> Int32

@_silgen_name("airhop_tor_set_dormant")
private func airhop_tor_set_dormant(_ dormant: Bool) -> Int32

@_silgen_name("airhop_tor_status")
private func airhop_tor_status() -> Int32

@_silgen_name("airhop_tor_summary")
private func airhop_tor_summary(_ buf: UnsafeMutablePointer<CChar>, _ len: Int32) -> Int32

/// Return codes from the native client, mirroring AIRHOP_TOR_* in
/// native/arti/src/lib.rs. Only the two the manager distinguishes are named;
/// every other failure is reported by its number, which is enough to look up.
enum AirhopTorRC {
    static let ok: Int32 = 0
    static let alreadyRunning: Int32 = -1
}

/// What Arti reports about itself, decoded from the packed status word.
///
/// The Rust side owns this state and nothing here caches it: asking is a lock
/// and a few bit shifts, cheaper than the bookkeeping a mirror needs to stay
/// honest.
struct ArtiStatus {
    let running: Bool
    let ready: Bool
    let blocked: Bool
    /// Circuits run through a bridge rather than a public relay. The two differ
    /// in what an observer on this network can see, so the app says which.
    let bridged: Bool
    let progress: Int

    // Mirrors AIRHOP_TOR_STATUS_* in native/arti/src/lib.rs.
    private static let bitRunning: Int32 = 1 << 0
    private static let bitReady: Int32 = 1 << 1
    private static let bitBlocked: Int32 = 1 << 2
    private static let bitBridged: Int32 = 1 << 3
    private static let progressShift: Int32 = 8

    init(packed: Int32) {
        running = packed & Self.bitRunning != 0
        ready = packed & Self.bitReady != 0
        blocked = packed & Self.bitBlocked != 0
        bridged = packed & Self.bitBridged != 0
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
    /// Terminal for this attempt: Arti reporting it cannot make forward
    /// progress, or the bootstrap deadline elapsing. Without it the app cannot
    /// tell "still forming" from "never coming", and goes on claiming onion
    /// routing over a client that has given up.
    static let AirhopTorDidStall       = Notification.Name("AirhopTorDidStall")
}

// ---- SOCKS endpoint ---------------------------------------------------------

/// Outside the manager because AirhopTorSocket reads it off the main actor, and
/// the manager is @MainActor. Both sides read these, so the port cannot drift.
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

    // MARK: - Private state

    private var restarting: Bool = false
    private var isAppForeground: Bool = true
#if canImport(Network)
    // Held so it is installed exactly once, and so a wipe can cancel it.
    private var pathMonitor: NWPathMonitor?
#endif
    private(set) public var allowAutoStart: Bool = false

    /// The bridge lines the current session was started with, empty for a direct
    /// connection.
    ///
    /// Held because startIfNeeded is also reached from the path monitor and from
    /// a foreground resume, and a restart has to use the configuration the user
    /// chose rather than silently dropping to a direct route. Cleared by
    /// shutdownCompletely, which is the withdrawal of that choice.
    private var bridgeLines: String = ""

    /// A poll loop belonging to a superseded attempt can still be alive, and
    /// would otherwise stomp the new attempt's flags and post a second stall.
    private var attemptEpoch = 0

    /// How long a bootstrap may run without either completing or admitting it is
    /// blocked. A backstop, not the primary signal: Arti reports a blockage
    /// directly and usually long before this.
    private static let bootstrapDeadline: TimeInterval = 75

    private init() {}

    // MARK: - Public API

    /// Allow automatic startup on the next `startIfNeeded()` call, reaching the
    /// network through `bridgeLines` when any are given.
    public func enableAutoStart(bridgeLines: String) {
        self.bridgeLines = bridgeLines
        allowAutoStart = true
    }

    /// No-op when `allowAutoStart` is false or the app is backgrounded. Whether
    /// a client exists is asked of Arti rather than tracked here, so this is
    /// safe to call from several places at once.
    ///
    /// `completion` is called once the native start has answered, which is what
    /// `AirhopTorModule.startTor` resolves on. `false` means one thing: a start
    /// was attempted and failed. Already running, or no start attempted, is
    /// `true`, because the caller has nothing to unwind.
    ///
    /// Calling it before the native side answers would clear `torStartPending`
    /// in `tor-routing.ts` while the client was still being built, leaving iOS
    /// without the marker Android has.
    ///
    /// Nil for the internal callers, the path monitor and the foreground resume,
    /// which want the attempt made and have nobody to answer.
    public func startIfNeeded(completion: (@MainActor (Bool) -> Void)? = nil) {
        guard allowAutoStart, isAppForeground else {
            // Nothing attempted, so nothing to report as failed. The next
            // foreground calls this again.
            completion?(true)
            return
        }
        guard !ArtiStatus.current.running else {
            completion?(true)
            return
        }

        attemptEpoch &+= 1
        let epoch = attemptEpoch
        isStarting = true
        NotificationCenter.default.post(name: .AirhopTorWillStart, object: nil)

        guard let dir = dataDirectoryURL()?.path else {
            failAttempt(epoch)
            completion?(false)
            return
        }
        try? FileManager.default.createDirectory(
            at: URL(fileURLWithPath: dir), withIntermediateDirectories: true
        )

        let lines = bridgeLines

        // Off the main actor: building the client touches the filesystem and
        // acquires Arti's state-directory lock, and starting a transport opens a
        // listener and may reach the network. None of that belongs on the thread
        // drawing the settings screen.
        Task.detached(priority: .userInitiated) { [weak self] in
            // Transports first, because Arti needs the ports they landed on and
            // those are assigned by the library rather than chosen.
            //
            // Fail closed when they do not come up: starting Arti anyway would
            // drop the bridge and take a direct route for a user who asked not
            // to have one.
            guard let ports = AirhopIPtProxy.shared.start(AirhopTransport.named(in: lines)) else {
                await MainActor.run {
                    self?.failAttempt(epoch)
                    completion?(false)
                }
                return
            }
            let rc = dir.withCString { dirPtr in
                lines.withCString { linesPtr in
                    airhop_tor_start(
                        dirPtr,
                        UInt16(AirhopTorEndpoint.socksPort),
                        linesPtr,
                        ports[.obfs4] ?? 0,
                        ports[.snowflake] ?? 0
                    )
                }
            }
            // Wound back here rather than on the main actor below, because
            // stopping a transport is a blocking call into Go.
            if rc != AirhopTorRC.ok, rc != AirhopTorRC.alreadyRunning {
                AirhopIPtProxy.shared.stop()
            }
            await MainActor.run {
                guard let self, epoch == self.attemptEpoch else {
                    // Superseded by a later attempt, which owns the outcome.
                    // Reported as success: the path monitor bumps the epoch on a
                    // network change, and failing here would have the JS side
                    // turn Tor off underneath the attempt that replaced this one.
                    completion?(true)
                    return
                }
                // Already running is a success. startIfNeeded reads the
                // status before dispatching, so the JS toggle and the path
                // monitor arriving together both see a stopped client and both
                // start; the second gets this code back.
                guard rc == AirhopTorRC.ok || rc == AirhopTorRC.alreadyRunning else {
                    // Arti never started, so no bootstrap will run and no
                    // deadline will elapse. Without reporting it here the banner
                    // sits on "starting" for the whole session over a client
                    // that does not exist.
                    self.failAttempt(epoch)
                    completion?(false)
                    return
                }
                // The listener is bound by the time start returns, so there is
                // nothing to probe for. The implementation this replaced bound
                // the port only after bootstrap, which is why it needed a
                // separate SOCKS reachability poll and a second timeout to go
                // with it.
                self.startStatusPoll(epoch)
                self.startPathMonitorIfNeeded()
                completion?(true)
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
            let status = ArtiStatus.current
            if status.ready { return true }
            // Give up as soon as the answer is known. A bridge deadline runs to
            // three minutes, and Arti reporting a blockage, or an attempt that
            // failed before it began, is that answer already. Waiting out the
            // rest would leave the user on a spinner for a refused bridge line.
            //
            // `isStarting` covers the window between dispatching a start and
            // the client existing, where `running` is legitimately false.
            if status.blocked { return false }
            if !status.running, await !MainActor.run(body: { self.isStarting }) {
                return false
            }
            try? await Task.sleep(nanoseconds: 200_000_000)
        }
        return ArtiStatus.current.ready
    }

    /// Called when the app enters the background.
    ///
    /// Sleeps Arti instead of stopping it. iOS suspends the process, so
    /// circuits do not survive a long spell there either way, but dormancy lets
    /// Arti wind down and pick up again on resume. A stop would drop the
    /// guards: a fresh bootstrap on every return, and a device that looks new
    /// to a guard each time.
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
    /// Revokes auto-start consent: a full shutdown is only reached by the user
    /// switching Tor off or by a panic wipe, and both are withdrawals. Leaving
    /// the flag set would let the path monitor restart Arti behind someone who
    /// turned it off, repopulating the directory a wipe exists to destroy.
    /// `startTor` re-grants it.
    public func shutdownCompletely() {
        allowAutoStart = false
        bridgeLines = ""
#if canImport(Network)
        pathMonitor?.cancel()
        pathMonitor = nil
#endif
        attemptEpoch &+= 1
        stopStatusPoll()
        isReady = false
        isStarting = false
        restarting = false

        // Off the main actor: stop waits for the runtime to wind down, bounded
        // in Rust at two seconds, and that must not land on the thread drawing
        // the toggle the user just tapped.
        Task.detached(priority: .userInitiated) {
            _ = airhop_tor_stop()
            // After Arti, so nothing is left dialling a transport that has gone.
            AirhopIPtProxy.shared.stop()
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
    /// The data directory sits under Application Support, so nothing the wipe
    /// already did reached it. It holds a cached consensus, chosen guards,
    /// directory information and timestamps: on-disk evidence that this device
    /// used Tor, from around here, at around this time. A gesture that promises
    /// local state is gone cannot leave it behind.
    ///
    /// Waits for Arti to be down before deleting, because a directory removed
    /// under a running client is one the client is free to rewrite.
    func wipeState() async {
        // Revoke auto-start consent FIRST, or the wipe does not stick. A live
        // NWPathMonitor calls ensureRunningOnForeground() on every satisfied
        // path update and its only gate is this flag, so a Wi-Fi to cellular
        // handover seconds later would restart Arti and repopulate exactly the
        // evidence this exists to destroy.
        allowAutoStart = false
        bridgeLines = ""
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
            // The transports write state too: which of them ran is the same
            // class of evidence as Arti's cached consensus.
            AirhopIPtProxy.shared.wipeState()
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
    /// Polling, not a callback, because a callback from a Rust thread
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
                let stop = await MainActor.run { () -> Bool in
                    guard epoch == self.attemptEpoch else { return true }
                    self.applyStatus(status)

                    if status.blocked {
                        // Arti says it cannot get there from here. This is the
                        // answer a censored network gives, and reporting it is
                        // the difference between "Airhop is broken" and "this
                        // network blocks Tor".
                        self.reportStall(epoch)
                        return true
                    }
                    if !status.running {
                        // Gone without anyone here asking for it.
                        self.reportStall(epoch)
                        return true
                    }
                    if !status.ready, Date() >= deadline {
                        // The backstop: neither progressing nor admitting it.
                        self.reportStall(epoch)
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
        isStarting = status.running && !status.ready && !status.blocked
        if status.ready, !isReady {
            isReady = true
            NotificationCenter.default.post(name: .AirhopTorDidBecomeReady, object: nil)
        } else if !status.ready {
            isReady = false
        }
    }

    /// A start that never got as far as running.
    private func failAttempt(_ epoch: Int) {
        guard epoch == attemptEpoch else { return }
        isStarting = false
        NotificationCenter.default.post(name: .AirhopTorDidStall, object: nil)
    }

    /// A start that ran and then stopped going anywhere.
    private func reportStall(_ epoch: Int) {
        guard epoch == attemptEpoch else { return }
        isStarting = false
        isReady = false
        stopStatusPoll()
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
