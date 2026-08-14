// The one place that decides whether the BLE radios should be running, and
// makes reality match.
//
// This exists because "start the radios" was previously spread across
// mesh-service.start(), retryRadios(), setDiscoverable(), scheduleRadioRestart()
// and App.tsx's resume handler, each issuing native calls on its own authority
// and each swallowing whatever came back. Five callers with no shared idea of
// what state the radios were meant to be in produced three distinct failures:
//
//   1. A permission grant is visible to the app before the Bluetooth stack
//      honours it. Calls issued in that window threw SecurityException, were
//      swallowed by `.catch(() => {})`, and nothing retried - so a fresh
//      install sat with both radios dead behind a UI claiming everything was
//      fine, until the user force-quit and relaunched.
//   2. On iOS, every CBManager state callback was reported to JS as a radio
//      change, which scheduled a restart, which constructed a new CBManager,
//      which fired a state callback. Fourteen central and fourteen peripheral
//      managers were allocated in ten seconds on an idle phone.
//   3. Going Invisible called stopAdvertising(), which on Android also tore
//      down the foreground service, silently ending background operation for a
//      mesh that was still meant to be scanning and relaying.
//
// The shape that fixes all three is a reconciler, not a set of commands:
//
//   - There is a DESIRED state (running? discoverable?) and a set of DEVICE
//     FACTS (radio on? permission held? location services on?).
//   - reconcile() computes the single reason we cannot run, publishes it, and
//     issues only the native calls needed to close the gap.
//   - It is idempotent. Calling it when nothing has changed does nothing, which
//     is what makes it safe to call from an event handler, a resume, a timer,
//     and a user tap without any of them needing to know about the others.
//   - Native calls that cannot succeed REJECT with a reason rather than
//     resolving into the void, and a rejection schedules a retry with backoff
//     instead of being discarded.
//
// The backoff is deliberately not a fixed sleep. bitchat-android waits a flat
// second after granting permissions ("This solves the issue where app needs
// restart to work on first install", MainActivity.kt:684). A flat wait is both
// too long on a fast device and too short on a slow one; retrying until the
// stack actually accepts the call is correct on every device and instant on
// most.

import AirhopBLE from "@bridge/NativeAirhopBLE";
import { useMeshStateStore, type BleBlocker } from "@store/mesh-state-store";
import { useSettingsStore } from "@store/settings-store";
import { PowerPolicy } from "./power-policy";

// The facts the device reports about itself. Every field is observed, never
// assumed - the previous code assumed all of them and was wrong about each one
// on some device.
export interface RadioFacts {
  // This device has a Bluetooth LE radio at all.
  supported: boolean;
  // The radio is switched on and usable right now.
  poweredOn: boolean;
  // Whether the app may use Bluetooth. "unknown" is the honest answer before
  // the platform has told us, and is treated as "keep trying", not as denial.
  authorization: "granted" | "denied" | "blocked" | "unknown";
  // Android: whether a BLE scan on this device counts as a location access.
  // True only below API 31, where usesPermissionFlags="neverForLocation" does
  // not exist on BLUETOOTH_SCAN. Always false on iOS.
  locationRequiredForScan: boolean;
  // Android: the OS-wide location toggle, as the device reports it. Scan
  // results are withheld without it however healthy everything else looks -
  // but only while locationRequiredForScan is true. Always true on iOS.
  locationServicesEnabled: boolean;
  // 0-100, or null when unknown (iOS always, Android before the first battery
  // broadcast). Drives how hard the radios run - see power-policy.ts.
  batteryPercent: number | null;
  charging: boolean;
}

// Retry schedule for a radio that could not start. Grows so a genuinely blocked
// device is not polled forever, caps so recovery is never more than a few
// seconds away once the blocker clears.
const BACKOFF_MS = [200, 400, 800, 1600, 3200, 5000] as const;

// How long after the adapter reports ON before we believe it. Android
// broadcasts STATE_ON as the stack comes up, not once it can accept work, and a
// scan issued in that window is accepted and silently does nothing.
const ADAPTER_SETTLE_MS = 400;

// ScanCallback.SCAN_FAILED_SCANNING_TOO_FREQUENTLY. Android allows roughly five
// scan starts per 30 second window per app and silently refuses the rest.
const SCAN_FAILED_SCANNING_TOO_FREQUENTLY = 6;

// How long to stand down after that particular refusal. Retrying on the usual
// ladder would spend the whole window being refused again, and each refusal
// costs another start against the next window's budget.
const SCAN_THROTTLE_BACKOFF_MS = 30_000;

export const BLE_SERVICE_UUID = "F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C";

// Turn observed facts into the one thing standing in the way. Pure, so the
// mapping is testable without a device and cannot drift from the banner copy.
export function blockerFor(
  facts: RadioFacts,
  // Whether a permission refusal is permanent. Neither platform reports this
  // through the radio: Android needs an Activity to ask
  // shouldShowRequestPermissionRationale, and the answer is only really known at
  // the moment the request returns. So it is carried alongside the facts rather
  // than being re-derived from them, and a native "denied" is refined by it.
  permissionBlocked = false,
): BleBlocker {
  if (!facts.supported) return "unsupported";
  if (facts.authorization === "blocked") return "permission-blocked";
  if (facts.authorization === "denied") {
    // Below API 31 the permission the mesh waits on is location, and the app
    // settings page has no Bluetooth row to point at. Checked before the
    // denied/blocked split because both resolve to the same action, so only a
    // label nuance is lost and the label is what this case exists to correct.
    if (facts.locationRequiredForScan) return "location-permission";
    return permissionBlocked ? "permission-blocked" : "permission-denied";
  }
  // "unknown" means the platform has not reported yet - which means it has not
  // reported the POWER state either. Checked before poweredOn for exactly that
  // reason: reading the not-yet-initialised default as "the radio is off" is
  // what made every iOS cold launch open with "Bluetooth off · mesh
  // unavailable" on a perfectly healthy phone.
  if (facts.authorization === "unknown") return "starting";
  // Order matters below: a radio that is off is the more actionable complaint,
  // and telling someone their location settings are wrong while Bluetooth is
  // off sends them to fix the wrong thing.
  if (!facts.poweredOn) return "adapter-off";
  // Android 11 and below only: from API 31 neverForLocation stops the toggle
  // gating the scanner. Read as a fact rather than a Platform.Version test so
  // the decision stays in this one pure function.
  if (facts.locationRequiredForScan && !facts.locationServicesEnabled) {
    return "location-services-off";
  }
  return "none";
}

interface Desired {
  running: boolean;
  discoverable: boolean;
}

export class RadioController {
  private desired: Desired = { running: false, discoverable: true };
  // What we believe the radios are actually doing. Only ever set from a native
  // call that resolved, so it can never claim more than the device confirmed.
  private actual = { scanning: false, advertising: false };

  // How hard the radios should be working. Kept apart from `desired` because it
  // is derived from the device rather than chosen by the user: nothing about a
  // power mode changes WHETHER we scan, only how often and how loudly.
  private readonly power = new PowerPolicy();
  // Whether the app is on screen. The single biggest input to the power policy
  // - a pocketed phone has nobody waiting on discovery latency - and the one
  // thing native cannot observe for us.
  private appForeground = true;

  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private settleTimer: ReturnType<typeof setTimeout> | null = null;
  private attempt = 0;
  // Guards against two reconciles overlapping. Native calls are async, and a
  // resume landing mid-reconcile would otherwise issue a duplicate startScan.
  private reconciling = false;
  // Set when something changed while a reconcile was in flight, so the change
  // is not lost to the guard above.
  private dirty = false;
  private disposed = false;

  // The last facts we published, so an unchanged report costs nothing. This is
  // the dedupe that stops an adapter event turning into a restart turning into
  // another adapter event.
  private lastBlocker: BleBlocker | null = null;

  constructor(private readonly peerID: string) {}

  // ---- intent ---------------------------------------------------------------

  start(): void {
    this.desired.running = true;
    this.attempt = 0;
    void this.reconcile();
  }

  // Record that the mesh is stopping, without touching the radios yet.
  //
  // Splitting this out is what lets a caller say goodbye on links that are
  // still open. `stop()` reaches the native "stop scanning, stop advertising"
  // call before it returns, so anything sent afterwards is handed to a
  // transport already told to shut down. Suspending first takes the decision
  // out of reach of any later event, then the caller applies the teardown when
  // its farewells are on the wire.
  //
  // Safe to leave suspended: nothing restarts the radios while `running` is
  // false, so the only cost of a delayed `stop()` is the radios staying up for
  // that long.
  suspend(): void {
    this.desired.running = false;
    this.clearTimers();
  }

  // Bring everything down and stop trying. Distinct from a blocker: this is the
  // user choosing to be offline, and nothing should quietly undo it.
  stop(): void {
    this.suspend();
    void this.reconcile();
  }

  // Invisible: keep scanning and relaying, stop announcing ourselves. Crucially
  // NOT the same as stopping the mesh - the background service stays up,
  // because the mesh is still doing work.
  setDiscoverable(enabled: boolean): void {
    if (this.desired.discoverable === enabled) return;
    this.desired.discoverable = enabled;
    void this.reconcile();
  }

  // The radio changed under us, or the user came back to the app, or they tapped
  // a banner. All three mean "the facts may have moved"; none of them need to
  // know what the others are doing.
  refresh(): void {
    this.attempt = 0;
    // Forget what we believe about the background service.
    //
    // An aggressive OEM battery manager can reap a foreground service without
    // telling anyone, and there is no callback for it. Caching "we started it"
    // meant that once it was reaped it never came back for the rest of the
    // session, and the mesh silently stopped surviving backgrounding. A resume
    // is precisely the moment that belief is least trustworthy, so drop it and
    // let the reconcile below re-assert.
    this.backgroundServiceOn = null;
    void this.reconcile();
  }

  // A native adapter-state event. Reported for real transitions only; we still
  // wait out the settle window before believing an ON, because the platform
  // announces the radio before it can accept work.
  onAdapterChanged(poweredOn: boolean): void {
    if (this.settleTimer !== null) {
      clearTimeout(this.settleTimer);
      this.settleTimer = null;
    }
    if (!poweredOn) {
      // Everything the radio was carrying is gone. Record that immediately
      // rather than discovering it one failed write at a time.
      this.actual = { scanning: false, advertising: false };
      this.attempt = 0;
      void this.reconcile();
      return;
    }
    this.settleTimer = setTimeout(() => {
      this.settleTimer = null;
      this.attempt = 0;
      void this.reconcile();
    }, ADAPTER_SETTLE_MS);
  }

  dispose(): void {
    this.disposed = true;
    this.clearTimers();
  }

  // ---- reconciliation -------------------------------------------------------

  private clearTimers(): void {
    if (this.retryTimer !== null) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.settleTimer !== null) {
      clearTimeout(this.settleTimer);
      this.settleTimer = null;
    }
  }

  private publish(blocker: BleBlocker): void {
    if (blocker === this.lastBlocker) return;
    this.lastBlocker = blocker;
    useMeshStateStore.getState().setBleBlocker(blocker);
  }

  // `minDelayMs` is for the refusals whose own recovery window is longer than
  // anything on the ladder. It raises this one retry rather than the schedule,
  // so an ordinary permission-settling retry stays as quick as it was.
  private scheduleRetry(minDelayMs = 0): void {
    if (this.disposed || !this.desired.running) return;
    if (this.retryTimer !== null) return;
    const delay = Math.max(
      BACKOFF_MS[Math.min(this.attempt, BACKOFF_MS.length - 1)],
      minDelayMs,
    );
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
    // Shutting down needs no facts: stop whatever is up and let the background
    // service go with it.
    if (!this.desired.running) {
      // Forced, not reconciled: `actual` is what JS believes, and both native
      // modules keep an intent latch this side cannot see. On any drift - a
      // restored process, a radio that came back on its own - the delta sends
      // nothing while the latch survives, and native can advertise a device
      // whose owner chose Away. Stopping is idempotent, so forcing is cheap.
      await this.applyRadios(
        { scanning: false, advertising: false },
        /* force */ true,
      );
      await this.setBackgroundService(false);
      // Native keeps whatever mode it was last given, and a stopped radio has
      // no mode worth remembering. Forgetting ours means the next start sends
      // one explicitly rather than assuming the two sides still agree.
      this.power.reset();
      this.publishPowerSaving();
      this.publish("none");
      return;
    }

    const facts = await this.readFacts();
    // Reading the device is the one slow step here, and intent can change while
    // it is in flight - the user choosing Away, or a panic wipe, lands as an
    // ordinary synchronous call on the same tick. Without this re-check the rest
    // of this pass would go on to start radios the user has just asked to stop.
    // The outer loop re-runs on `dirty`, so bailing here loses nothing.
    if (!this.desired.running || this.disposed) {
      this.dirty = true;
      return;
    }

    const blocker = blockerFor(
      facts,
      useMeshStateStore.getState().blePermissionBlocked,
    );
    this.publish(blocker);

    if (blocker !== "none") {
      // Nothing we can do about it from here, but the radios must not be left
      // half-up, and the background notification must not claim an active mesh
      // over a radio that cannot run.
      this.actual = { scanning: false, advertising: false };
      await this.setBackgroundService(false);
      // Whatever the battery is doing, it is not why the mesh is down. Two
      // explanations for one empty radar is one too many.
      useMeshStateStore.getState().setPowerSaving(false);
      // "unsupported" and the two permission refusals will not change without
      // the user acting, and each has a banner asking them to; polling would
      // only burn battery. Everything else is worth waiting out.
      if (
        blocker !== "unsupported" &&
        blocker !== "permission-blocked" &&
        blocker !== "permission-denied"
      ) {
        this.scheduleRetry();
      }
      return;
    }

    // Set the effort level BEFORE starting anything, so the first scan already
    // runs at the right rate rather than starting flat out and being restarted
    // a moment later.
    await this.applyPowerMode(facts);

    const ok = await this.applyRadios({
      scanning: true,
      advertising: this.desired.discoverable,
    });
    // The background service exists to keep a RUNNING mesh alive off-screen, so
    // it is tied to the mesh running - not, as before, to advertising. Invisible
    // stops advertising and must keep relaying.
    //
    // Gated on SCANNING, not on the combined result.
    //
    // This used to be issued whatever `applyRadios` reported, which put a
    // persistent "Airhop mesh active" notification over a phone whose scanner
    // had just refused. Gating it on `ok` fixed that and introduced the opposite
    // fault: `ok` is also false when only ADVERTISING failed, and a device that
    // scans and relays perfectly well but cannot advertise would then lose the
    // service that keeps it alive off screen. Both directions are wrong for the
    // same reason, which is that `ok` answers "did every call succeed" and the
    // service exists for "is this device still doing mesh work".
    //
    // Scanning is that question. A phone that scans is receiving and relaying
    // for everyone around it, which is worth holding the process up for whether
    // or not anybody can see it back. The retry below re-asserts advertising.
    // Gated on the preference as well as on the radio. Off means the mesh runs
    // only while the app is in front of the user: no foreground service, no
    // persistent notification, and no radio work once it is closed. The radios
    // themselves are untouched, so nothing about this session changes.
    await this.setBackgroundService(
      this.actual.scanning && useSettingsStore.getState().backgroundMeshEnabled,
    );

    if (ok) {
      this.attempt = 0;
    } else {
      // A native call refused. The usual reason is a permission the app can see
      // but the stack has not honoured yet, which resolves itself in a few
      // hundred milliseconds - so retry rather than give up.
      this.scheduleRetry();
    }
  }

  // Push the current power mode down, if it changed.
  //
  // PowerPolicy returns null when nothing moved, which is the common case:
  // applying a mode restarts the scan, so doing it on every reconcile would
  // cost more battery than the policy saves.
  private async applyPowerMode(facts: RadioFacts): Promise<void> {
    const mode = this.power.next({
      batteryPercent: facts.batteryPercent,
      charging: facts.charging,
      appForeground: this.appForeground,
    });
    // Publish whether the user would NOTICE the reduction, which is not the same
    // as whether there is one. Backgrounded, every mode is reduced and nobody is
    // waiting on discovery; on screen with a nearly flat battery, peers take
    // half a minute to appear and that needs saying. Recomputed on every pass,
    // not only on a change, because coming back to the foreground changes the
    // answer without necessarily changing the mode.
    this.publishPowerSaving();
    if (mode === null) return;
    try {
      await AirhopBLE.setPowerMode(mode);
    } catch {
      // Older native module, or the radio went away mid-call. The mode is
      // advisory - the mesh runs either way - and the next reconcile retries.
    }
  }

  private publishPowerSaving(): void {
    const mode = this.power.current;
    const noticeable =
      this.appForeground &&
      (mode === "power-saver" || mode === "ultra-low-power");
    const store = useMeshStateStore.getState();
    if (store.powerSaving !== noticeable) store.setPowerSaving(noticeable);
  }

  // The app came to the front or went away. Foreground state is the strongest
  // input to the power policy, so this is worth a reconcile on its own.
  setAppForeground(foreground: boolean): void {
    if (this.appForeground === foreground) return;
    this.appForeground = foreground;
    void this.reconcile();
  }

  // Native saw the battery move enough to possibly matter.
  onPowerStateChanged(): void {
    void this.reconcile();
  }

  // The platform refused a scan after accepting the call to start one. The one
  // failure the reconciler cannot observe for itself: startScan() resolved, so
  // `actual.scanning` is true and every later pass sees nothing to close.
  // Android only; CoreBluetooth reports refusals as an adapter change.
  onScanFailed(errorCode: number): void {
    this.actual.scanning = false;
    // scheduleRetry keeps the first timer it is given, so a pending 200ms
    // attempt would pre-empt the stand-down below and be refused too.
    if (this.retryTimer !== null) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    this.scheduleRetry(
      errorCode === SCAN_FAILED_SCANNING_TOO_FREQUENTLY
        ? SCAN_THROTTLE_BACKOFF_MS
        : 0,
    );
  }

  // Read what the device says about itself, tolerating an older native module
  // that does not implement the call yet.
  private async readFacts(): Promise<RadioFacts> {
    try {
      const state = await AirhopBLE.getRadioState();
      return {
        supported: state.supported,
        poweredOn: state.poweredOn,
        authorization: state.authorization,
        locationRequiredForScan: state.locationRequiredForScan,
        locationServicesEnabled: state.locationServicesEnabled,
        // Native reports -1 when it has nothing to say (iOS, or Android before
        // the first battery broadcast). Normalised to null here so the policy
        // has one "unknown" to reason about instead of a magic number.
        batteryPercent: state.batteryPercent < 0 ? null : state.batteryPercent,
        charging: state.charging,
      };
    } catch {
      // Unreadable this instant. "unknown" reads as "starting", which retries,
      // rather than as a denial the user would be asked to fix.
      return {
        supported: true,
        poweredOn: false,
        authorization: "unknown",
        locationRequiredForScan: false,
        locationServicesEnabled: true,
        batteryPercent: null,
        charging: false,
      };
    }
  }

  // Issue only the calls that close the gap. Returns false if any refused.
  //
  // `force` sends both calls regardless, for the shutdown path where native may
  // hold intent this side cannot see. Nothing else should need it.
  private async applyRadios(
    target: {
      scanning: boolean;
      advertising: boolean;
    },
    force = false,
  ): Promise<boolean> {
    let ok = true;

    if (force || target.scanning !== this.actual.scanning) {
      try {
        if (target.scanning) {
          await AirhopBLE.startScanning([BLE_SERVICE_UUID]);
        } else {
          await AirhopBLE.stopScanning();
        }
        this.actual.scanning = target.scanning;
      } catch {
        ok = false;
      }
    }

    // A device with no BLE peripheral role never gets asked again.
    //
    // Some chipsets at the API 26 floor report a null bluetoothLeAdvertiser, and
    // native answers UNSUPPORTED. That is not a transient refusal, but it used
    // to be treated as one: applyRadios returned false, reconcileOnce scheduled
    // a retry, the backoff capped at five seconds, and the app called
    // startAdvertising every five seconds for as long as the mesh ran. Battery
    // and logcat spend, forever, on a question whose answer cannot change.
    //
    // Scanning and relaying are untouched, so the mesh still works from this
    // phone's side. What it loses is being discovered, which is why the store is
    // told: the Mesh tab says so once rather than leaving someone to wonder why
    // they can see everyone and nobody answers.
    const wantAdvertise = target.advertising && !this.advertisingUnsupported;
    if (force || wantAdvertise !== this.actual.advertising) {
      try {
        if (wantAdvertise) {
          await AirhopBLE.startAdvertising(BLE_SERVICE_UUID, this.peerID);
        } else {
          await AirhopBLE.stopAdvertising();
        }
        this.actual.advertising = wantAdvertise;
      } catch (e) {
        if ((e as { code?: string } | undefined)?.code === "UNSUPPORTED") {
          this.advertisingUnsupported = true;
          this.actual.advertising = false;
          useMeshStateStore.getState().setBleAdvertisingUnsupported(true);
          // Deliberately NOT a failure. Returning false here would schedule the
          // retry this whole branch exists to stop.
        } else {
          ok = false;
        }
      }
    }

    return ok;
  }

  // Latched once native answers UNSUPPORTED to startAdvertising: this chipset
  // has no peripheral role and never will. Never cleared, because nothing about
  // a device changes that. See applyRadios.
  private advertisingUnsupported = false;

  // null means "we do not know", which forces the next reconcile to re-assert.
  private backgroundServiceOn: boolean | null = false;

  private async setBackgroundService(enabled: boolean): Promise<void> {
    if (this.backgroundServiceOn === enabled) return;
    try {
      await AirhopBLE.setBackgroundServiceEnabled(enabled);
      this.backgroundServiceOn = enabled;
    } catch {
      // Refused (typically a background-start restriction on Android 12+).
      // The mesh runs fine in the foreground either way, and the next
      // reconcile - which a resume always triggers - will try again.
    }
  }

  // ---- introspection, for tests and diagnostics -----------------------------

  get currentBlocker(): BleBlocker | null {
    return this.lastBlocker;
  }

  get isScanning(): boolean {
    return this.actual.scanning;
  }

  get isAdvertising(): boolean {
    return this.actual.advertising;
  }
}
