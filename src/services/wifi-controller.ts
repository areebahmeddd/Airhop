// The one place that decides whether the WiFi Aware fast path should be
// running, and makes reality match.
//
// Both platforms, one reconciler: nothing below asks which it is driving. What
// differs is which failures each can report, and every one is a `code` rather
// than a platform check.
//
// The one structural difference is the pairing gate: Apple's Wi-Fi Aware has no
// unpaired mode, so on iOS this will not attach until a device is paired. See
// `setPairedCount`.
//
// This is radio-controller.ts's counterpart, and it exists for the same reason
// that one does. WiFi was started exactly once per MeshService.start(), like
// this:
//
//     NativeAirhopWiFi?.startWiFi().catch(() => {});
//
// One attempt, no retry, and the rejection code - the only thing that says
// WHICH of eight failures happened - discarded before anything could read it.
// Every failure mode the BLE reconciler was written to eliminate was still
// fully present here:
//
//   1. WiFi switched off when the mesh started meant the attach was refused,
//      swallowed, and never retried. Turning WiFi on afterwards changed
//      nothing for the rest of the process, because nothing was watching and
//      nothing was going to ask again.
//   2. NEARBY_WIFI_DEVICES granted a moment after the mesh started (the
//      ordinary first-install race, and the reason the BLE controller has a
//      backoff at all) left the fast path dead on a device that was entitled
//      to it.
//   3. WiFi toggled off mid-session tore the sockets down natively, and the
//      module latched itself into a "started" state it could not leave, so
//      even an explicit restart resolved instantly having done nothing.
//
// The shape that fixes all three is the same reconciler the radios already use:
// a DESIRED state, an OBSERVED outcome, and one idempotent pass that closes the
// gap and schedules a retry when it cannot.
//
// What is deliberately different from the BLE controller:
//
//   * No BLOCKER is published. WiFi Aware is an extra link between two phones on
//     the same platform, and BLE carries everything either way. A user whose
//     WiFi is off has not lost the mesh, and saying they have would be a false
//     alarm on the one screen that must stay trustworthy.
//
//     What it does report, through `onState`, is which of those situations it is
//     in, so the Mesh tab can say the fast path is off in the same neutral voice
//     it uses for battery saver. Worth saying at all because an attachment over
//     BLE alone drops fragments and retries, which reads as the app being slow.
//   * "Unsupported" is latched forever rather than retried. No hardware, or an
//     API level below the data path, is not a state a device leaves.

import NativeAirhopWiFi from "@bridge/NativeAirhopWiFi";
import type { WifiFastPath } from "@store/mesh-state-store";

// Retry schedule for an attach that was refused. Slower than the BLE ladder at
// every step: nothing the user is looking at depends on this transport, so the
// cost of being a few seconds late is nil and the cost of polling a radio in a
// pocket is not.
const BACKOFF_MS = [500, 1500, 4000, 10_000, 30_000] as const;

// Rejection codes the native modules use. Kept as a union here rather than
// matched on message text: a human-readable string is a UI concern, and control
// flow that reads it breaks the first time somebody rewords it.
type WiFiFailure =
  // No Aware hardware, or an OS too old for the data path. Permanent.
  | "unsupported"
  // Aware exists but is not usable right now: WiFi off, tethering active, the
  // OS reclaiming the radio. Clears on its own.
  | "unavailable"
  // NEARBY_WIFI_DEVICES (or location, below API 33) is missing. Clears when the
  // user grants it, which we learn about on the next refresh.
  | "permission"
  // iOS only. Nothing is paired, so there is nobody to reach. Unlike every other
  // transient failure this one is NOT retried: only a pairing changes it, and
  // the pairing module reports the moment one does.
  | "unpaired"
  // Attach or socket setup failed for some other reason. Treated as transient,
  // since we have nothing better to assume.
  | "transient";

function classify(error: unknown): WiFiFailure {
  const code = (error as { code?: string } | undefined)?.code;
  switch (code) {
    case "WIFI_AWARE_UNSUPPORTED":
      return "unsupported";
    case "WIFI_AWARE_UNAVAILABLE":
      return "unavailable";
    case "PERMISSION_DENIED":
      return "permission";
    case "WIFI_AWARE_UNPAIRED":
      return "unpaired";
    default:
      return "transient";
  }
}

export class WiFiController {
  // Told whenever the reported state changes, never on every pass: the reconciler
  // runs on a retry ladder and re-reporting "still off" every few seconds would
  // churn a subscriber for no news. Optional so the tests (and any caller with
  // nothing to show) construct it bare.
  constructor(private readonly onState?: (state: WifiFastPath) => void) {}

  // Last thing handed to onState, so only transitions are reported.
  private reported: WifiFastPath = "unknown";

  private report(state: WifiFastPath): void {
    if (state === this.reported) return;
    this.reported = state;
    this.onState?.(state);
  }

  private desiredRunning = false;
  // Paired devices, or null on a platform with no pairing gate. null rather than
  // a sentinel so Android carries no iOS concept: every comparison is `=== 0`,
  // which null never satisfies.
  //
  // Null on iOS too until the pairing module's first report, which arrives
  // within a tick of startup: attaching before the list is known would run a
  // radio for devices we have not confirmed exist.
  private pairedCount: number | null = null;
  // Whether native has confirmed the transport is up. Only ever set from a call
  // that resolved, so it cannot claim more than the device agreed to.
  private started = false;
  // Latched when native says this device has no fast path and never will. Never
  // cleared: nothing about a chipset or an OS version changes within a process.
  private unsupported = false;
  // The last failure, so a caller (and a test) can tell "we chose not to" from
  // "we tried and were refused".
  private lastFailure: WiFiFailure | null = null;

  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private attempt = 0;
  // Guards two reconciles overlapping. startWiFi is async and a resume landing
  // mid-attach would otherwise issue a second one, which on Android leaks the
  // first WifiAwareSession.
  private reconciling = false;
  private dirty = false;
  private disposed = false;

  // Bumped whenever intent changes under an in-flight attach: stop(), dispose(),
  // and an availability drop. `reconcileOnce` captures it before awaiting
  // startWiFi and re-checks it after, so a resolve that lands late cannot mark
  // the transport started against an intent that has already moved on.
  //
  // Without it the availability edge re-created the latch this whole file exists
  // to remove: the drop set started=false and scheduled a retry, then the stale
  // attach resolved and set started=true, and from then on every retry, every
  // refresh() and even a later "available again" returned early at the guard.
  private generation = 0;

  start(): void {
    this.desiredRunning = true;
    this.attempt = 0;
    void this.reconcile();
  }

  stop(): void {
    this.desiredRunning = false;
    this.generation += 1;
    this.clearTimer();
    void this.reconcile();
  }

  // Driven by services/wifi-pairing-service.ts. Both edges matter and neither
  // has another signal: the first pairing is what lets the transport attach, and
  // the last unpairing happens in the Settings app, where nothing else would
  // tell us and a listener would keep running for a device that is gone.
  setPairedCount(count: number): void {
    if (this.pairedCount === count) return;
    this.pairedCount = count;
    this.attempt = 0;
    void this.reconcile();
  }

  // The world may have moved: the app was resumed, a permission was granted, the
  // user pulled to refresh. Same contract as the radio controller's refresh -
  // callers do not have to know whether it is necessary.
  refresh(): void {
    if (this.unsupported) return;
    this.attempt = 0;
    void this.reconcile();
  }

  // Native saw WiFi Aware become available or stop being available.
  //
  // Losing availability is the case that is otherwise unrecoverable. The
  // framework terminates the discovery sessions while the module keeps its attach
  // handle, so it believes it is still running and every later start resolves
  // instantly having done nothing. Forgetting that belief here is what lets the
  // next pass do real work.
  onAvailabilityChanged(available: boolean): void {
    if (this.unsupported) return;
    if (!available) {
      this.started = false;
      // Deliberately NOT reported as "WiFi off" here, however much it looks
      // like it. AirhopWiFiModule emits this same `available: false` from two
      // places: the framework's state broadcast (the radio really has gone) and
      // reportDiscoveryRefused (publish or subscribe was refused, on a device
      // whose WiFi is on). Guessing "off" would put a banner about a toggle in
      // front of someone whose toggle is already on.
      //
      // The retry below answers it properly within half a second: startWiFi
      // re-reads `isAvailable` natively and rejects with a code that says which
      // of the two it was, and reconcileOnce reports THAT.
      // Invalidate any attach still in flight: its resolve would otherwise
      // land after this and re-assert `started` over a transport the framework
      // has just torn down.
      this.generation += 1;
      // Release the native handle rather than leaving a dead session attached.
      // Idempotent, so this is safe even if native has already torn it down.
      void NativeAirhopWiFi?.stopWiFi().catch(() => {});
      // Then keep trying, on the slow ladder.
      //
      // Android will say when the radio is back, so this is only a backstop
      // there. iOS has no "became available" callback at all - the report only
      // ever comes on a failure - so without this the transport would sit dead
      // until the user happened to background and reopen the app. The ladder
      // tops out at half a minute and each refused attempt is cheap.
      this.attempt = 0;
      this.scheduleRetry();
      return;
    }
    this.attempt = 0;
    void this.reconcile();
  }

  dispose(): void {
    this.disposed = true;
    this.generation += 1;
    this.clearTimer();
    // Release the native session unconditionally. Safe today only because every
    // caller happens to stop() first; one refactor away from leaving a live
    // WiFi Aware session behind a disposed controller. Idempotent.
    this.desiredRunning = false;
    if (this.started) void this.releaseNative();
  }

  private clearTimer(): void {
    if (this.retryTimer !== null) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  private scheduleRetry(): void {
    if (this.disposed || !this.desiredRunning) return;
    if (this.retryTimer !== null) return;
    const delay = BACKOFF_MS[Math.min(this.attempt, BACKOFF_MS.length - 1)];
    this.attempt++;
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      void this.reconcile();
    }, delay);
  }

  private async reconcile(): Promise<void> {
    if (this.disposed) return;
    if (this.reconciling) {
      this.dirty = true;
      return;
    }
    this.reconciling = true;
    try {
      do {
        this.dirty = false;
        await this.reconcileOnce();
      } while (this.dirty && !this.disposed);
    } finally {
      this.reconciling = false;
    }
  }

  private async reconcileOnce(): Promise<void> {
    const generation = this.generation;
    // No module at all: every iOS build, and Android below API 26 where the
    // package does not register one. Latched, so a device with no fast path is
    // asked once and never polled again.
    if (NativeAirhopWiFi === null || NativeAirhopWiFi === undefined) {
      this.unsupported = true;
      this.report("unsupported");
      return;
    }

    if (!this.desiredRunning) {
      if (!this.started) return;
      await this.releaseNative();
      return;
    }

    if (this.unsupported) return;

    // Nothing paired means nobody to reach. Ahead of the `started` guard rather
    // than beside it, because this edge has to tear an attached transport back
    // down when the last pairing is removed.
    if (this.pairedCount === 0) {
      if (this.started) await this.releaseNative();
      this.report("unpaired");
      return;
    }

    if (this.started) return;

    try {
      await NativeAirhopWiFi.startWiFi();
    } catch (error) {
      const failure = classify(error);
      this.lastFailure = failure;
      if (failure === "unsupported") {
        // Asked once, never again. This is the branch the BLE controller learned
        // to add after retrying an UNSUPPORTED advertiser every five seconds for
        // the life of the process.
        this.unsupported = true;
        this.report("unsupported");
        return;
      }
      // "unavailable" is the one the user can act on, and the only one the Mesh
      // tab shows: the radio exists and is switched off. A transient attach
      // failure is reported as no reading rather than as WiFi being off, since
      // saying so would send someone to a toggle that is already on.
      // Nothing to retry: only a pairing changes this, and `setPairedCount`
      // runs a pass the moment one does.
      if (failure === "unpaired") {
        this.report("unpaired");
        return;
      }
      this.report(
        failure === "unavailable"
          ? "unavailable"
          : failure === "permission"
            ? "permission"
            : "unknown",
      );
      // Everything else can change: the user turns WiFi on, stops tethering, or
      // grants the permission. A permission refusal is retried too, on the slow
      // end of the ladder - unlike Bluetooth there is no banner asking the user
      // to act, so this transport has nothing but the retry.
      this.scheduleRetry();
      return;
    }

    // Intent moved while the attach was in flight, so this result is stale.
    // Release what native opened and let the pass the change scheduled decide
    // what happens next.
    if (generation !== this.generation) {
      await this.releaseNative();
      return;
    }

    // Native really did attach, so record that before consulting intent again.
    // The handle exists whatever anyone wants now, and something has to release
    // it.
    this.started = true;
    this.lastFailure = null;
    this.attempt = 0;
    this.report("active");

    // `stop()` and `dispose()` are synchronous calls that can land while the
    // attach above is in flight - the user choosing Away, or a panic wipe, on
    // the same tick. Releasing here rather than deferring to the loop, because
    // the loop does not run again once disposed, and leaving the socket open
    // over a stopped mesh is exactly the leak this controller exists to avoid.
    if (!this.desiredRunning || this.disposed) {
      await this.releaseNative();
    }
  }

  // Bring the native transport down and stop believing it is up. Idempotent. One
  // of the two places `started` deliberately goes back to false; the other is
  // onAvailabilityChanged, when the framework withdraws the radio underneath us.
  private async releaseNative(): Promise<void> {
    this.started = false;
    try {
      await NativeAirhopWiFi?.stopWiFi();
    } catch {
      // Stopping is best-effort. The sockets go with the process either way,
      // and a refused stop must not leave `started` claiming a live transport.
    }
  }

  get isStarted(): boolean {
    return this.started;
  }

  get isUnsupported(): boolean {
    return this.unsupported;
  }

  get failure(): WiFiFailure | null {
    return this.lastFailure;
  }
}
