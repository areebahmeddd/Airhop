// A model of the operating system, not of Airhop.
//
// The lifecycle bugs we are chasing all live in the gap between what the app
// believes about the device and what the device is actually doing. A test that
// mocks the native module away cannot find them, because the mock agrees with
// the app by construction. So this file models the OS side of that gap - the
// rules Android and iOS actually enforce - and the native modules are modelled
// separately (android-native.ts, ios-native.ts) as code running ON this OS.
//
// Everything the OS enforces here is a real, documented behaviour:
//
//   - A runtime permission is granted to the APP before it is enforced by the
//     Bluetooth STACK. PermissionsAndroid resolves on the first; BLE calls are
//     checked against the second. bitchat-android papers over the window with
//     `delay(1000)` and the comment "This solves the issue where app needs
//     restart to work on first install" (MainActivity.kt:684). Modelled as
//     `permissionSettleMs`.
//   - Turning the adapter off invalidates every GATT handle the app holds. The
//     handles stay non-null and look alive; every call through them fails.
//   - An uncaught exception on any Android thread kills the process. There is no
//     "it threw but carried on" - a BroadcastReceiver that throws takes the app
//     with it.
//   - Reaching JS from native is only legal while a React runtime exists.
//     Bridgeless RN throws IllegalStateException otherwise.
//   - startForegroundService() from the background is refused on Android 12+.
//   - CoreBluetooth reports state asynchronously after a manager is constructed,
//     and drops any command issued before it reaches poweredOn.
//
// The trace this records is the deliverable: it is how we can watch a scenario
// wedge and see which call was swallowed, without a device in hand.

export type Platform = "android" | "ios";

// Android adapter states. The TURNING_* transitions matter: a scan issued
// during TURNING_ON is accepted by the API and silently does nothing.
export type AdapterState = "off" | "turningOn" | "on" | "turningOff";

export type AndroidPermission =
  | "android.permission.BLUETOOTH_SCAN"
  | "android.permission.BLUETOOTH_ADVERTISE"
  | "android.permission.BLUETOOTH_CONNECT"
  | "android.permission.ACCESS_FINE_LOCATION"
  | "android.permission.ACCESS_COARSE_LOCATION"
  | "android.permission.NEARBY_WIFI_DEVICES"
  | "android.permission.POST_NOTIFICATIONS";

export type PermissionState = "undetermined" | "granted" | "denied" | "blocked";

// CBManagerState, in full. Airhop's Swift currently handles exactly one of
// these; the other five are the bug surface.
export type CBManagerState =
  | "unknown"
  | "resetting"
  | "unsupported"
  | "unauthorized"
  | "poweredOff"
  | "poweredOn";

export interface TraceEvent {
  atMs: number;
  // Where the line came from, so a trace reads as a conversation between
  // layers rather than a flat log.
  source: "os" | "native" | "js" | "user" | "verdict";
  kind: string;
  detail?: string;
}

// Thrown by the OS model when the app calls a BLE API without the permission
// the stack requires at that instant. Mirrors Android's SecurityException.
export class SecurityException extends Error {
  constructor(permission: string) {
    super(`SecurityException: missing ${permission}`);
    this.name = "SecurityException";
  }
}

// Thrown when native reaches for JS with no live React runtime. This is the
// bridgeless-mode failure that Airhop's emitEvent() does not guard against.
export class IllegalStateException extends Error {
  constructor(message: string) {
    super(`IllegalStateException: ${message}`);
    this.name = "IllegalStateException";
  }
}

export class ForegroundServiceStartNotAllowedException extends Error {
  constructor() {
    super("ForegroundServiceStartNotAllowedException");
    this.name = "ForegroundServiceStartNotAllowedException";
  }
}

export interface DeviceOptions {
  platform: Platform;
  // Android API level. 31+ gates the BLUETOOTH_* runtime permissions; 33+ adds
  // NEARBY_WIFI_DEVICES and POST_NOTIFICATIONS.
  apiLevel?: number;
  adapter?: AdapterState;
  locationServicesEnabled?: boolean;
  // How long after the user taps "Allow" the Bluetooth stack actually honours
  // the grant. Zero models an ideal device; real hardware is not ideal, and
  // this is the window bitchat's delay(1000) exists to clear.
  permissionSettleMs?: number;
  // Whether the device has a Bluetooth adapter at all.
  hasBluetooth?: boolean;
  // Some chipsets at the API 26 floor have a working central role and no
  // peripheral one, so they scan and relay but can never be discovered.
  canAdvertise?: boolean;
  hasWifiAware?: boolean;
  // Multi-device simulation only. A device in a world does not own the clock:
  // the world advances one set of fake timers for everybody, so each device has
  // to read the time rather than count it. Left unset, the device keeps its own
  // counter and `advance()` works as it does for a single-device lifecycle test.
  clock?: () => number;
  // Where trace lines go when this device is one of many. Without it a device
  // only has its own trace, which is unreadable for a scenario whose whole point
  // is the order of events ACROSS devices.
  sink?: (event: TraceEvent) => void;
  // Label used by the shared sink to say which phone a line came from.
  label?: string;
  // Multi-device simulation only. Wraps every native-to-JS callback so the
  // event router knows whose code is running; see sim/harness/event-router.ts.
  // Without it a phone's native events would be delivered to every phone.
  runAs?: <T>(fn: () => T) => T;
}

export class DeviceOS {
  readonly platform: Platform;
  readonly apiLevel: number;
  readonly hasBluetooth: boolean;
  readonly canAdvertise: boolean;
  readonly hasWifiAware: boolean;
  readonly permissionSettleMs: number;

  adapter: AdapterState;
  locationServicesEnabled: boolean;
  appForeground = true;
  // Whether a React runtime exists to receive events. False before the bundle
  // has finished loading and after the instance is destroyed - both windows in
  // which native code can still be invoked by the OS.
  jsRuntimeReady = false;
  // Set when an uncaught exception reaches the top of a thread. Once true the
  // process is dead and nothing else should run.
  crashed: string | null = null;

  // What the app is told it has (PermissionsAndroid.check).
  private granted: Partial<Record<AndroidPermission, PermissionState>> = {};
  // What the Bluetooth stack will actually honour right now. Lags `granted` by
  // permissionSettleMs. This split is the whole point of the model.
  private enforced = new Set<AndroidPermission>();

  private nowMs = 0;
  private readonly clock?: () => number;
  private readonly sink?: (event: TraceEvent) => void;
  private readonly runAs?: <T>(fn: () => T) => T;
  readonly label: string;
  readonly trace: TraceEvent[] = [];

  // Foreground service state, so we can assert the mesh keeps running when
  // backgrounded - and notice when advertising quietly takes it down.
  foregroundServiceRunning = false;

  constructor(opts: DeviceOptions) {
    this.platform = opts.platform;
    this.apiLevel = opts.apiLevel ?? 34;
    this.hasBluetooth = opts.hasBluetooth ?? true;
    this.canAdvertise = opts.canAdvertise ?? true;
    this.hasWifiAware = opts.hasWifiAware ?? false;
    this.permissionSettleMs = opts.permissionSettleMs ?? 0;
    this.adapter = opts.adapter ?? "on";
    this.locationServicesEnabled = opts.locationServicesEnabled ?? true;
    this.clock = opts.clock;
    this.sink = opts.sink;
    this.label = opts.label ?? "device";
    this.runAs = opts.runAs;
  }

  // ---- clock ---------------------------------------------------------------

  // There is exactly one clock in this harness: Jest's fake timers. The OS
  // model, the native modules, and the real mesh-service (whose
  // scheduleRadioRestart uses a bare setTimeout) all schedule onto it, so their
  // ordering in a scenario is the same ordering they would have on a device.
  // Running two clocks side by side would let the harness invent an interleave
  // that hardware never produces, which is the one thing a race-condition
  // harness must not do.

  get now(): number {
    return this.clock?.() ?? this.nowMs;
  }

  schedule(delayMs: number, fn: () => void): () => void {
    const handle = setTimeout(() => {
      this.runOnThread("timer", fn);
    }, delayMs);
    return () => clearTimeout(handle);
  }

  // Step the clock forward, flushing microtasks between steps so promise
  // continuations (every native call is a Promise) land in a realistic order
  // relative to timers rather than all at once at the end.
  async advance(ms: number): Promise<void> {
    const step = 5;
    let remaining = ms;
    while (remaining > 0) {
      const chunk = Math.min(step, remaining);
      this.nowMs += chunk;
      jest.advanceTimersByTime(chunk);
      // Two flushes: one for the continuation, one for anything it chains.
      await Promise.resolve();
      await Promise.resolve();
      remaining -= chunk;
    }
  }

  // ---- trace ---------------------------------------------------------------

  log(source: TraceEvent["source"], kind: string, detail?: string): void {
    const event: TraceEvent = { atMs: this.now, source, kind, detail };
    this.trace.push(event);
    this.sink?.(event);
  }

  formatTrace(): string {
    return this.trace
      .map((e) => {
        const t = String(e.atMs).padStart(5, " ");
        const src = e.source.padEnd(7, " ");
        return `${t}ms ${src} ${e.kind}${e.detail !== undefined ? ` — ${e.detail}` : ""}`;
      })
      .join("\n");
  }

  // ---- process model -------------------------------------------------------

  // Run a block the way the OS runs it: on a thread with no exception handler
  // above it. Android does not have a concept of a callback that throws and is
  // ignored - the process dies. Modelling that honestly is what lets the
  // harness distinguish "swallowed error" from "app crash", which is the exact
  // difference between the two symptoms we are chasing.
  runOnThread(name: string, fn: () => void): void {
    if (this.crashed !== null) return;
    try {
      // Everything native hands to JS goes through here, which makes it the one
      // place that can tell the event router whose phone is executing.
      if (this.runAs !== undefined) this.runAs(fn);
      else fn();
    } catch (e) {
      const err = e as Error;
      this.crashed = `${err.name}: ${err.message} (on ${name} thread)`;
      this.log("os", "PROCESS_CRASH", this.crashed);
    }
  }

  // Native reaching into JS. Throws exactly where bridgeless React Native
  // throws, so an unguarded emit is fatal here in the same way it is fatal on
  // a real device.
  requireJsRuntime(): void {
    if (!this.jsRuntimeReady) {
      throw new IllegalStateException(
        "Tried to access a JS module before the React instance was fully set up or after it was destroyed",
      );
    }
  }

  // ---- permissions ---------------------------------------------------------

  setPermission(p: AndroidPermission, state: PermissionState): void {
    this.granted[p] = state;
    if (state === "granted") {
      // The app can see the grant immediately. The stack honours it later.
      if (this.permissionSettleMs === 0) {
        this.enforced.add(p);
      } else {
        this.schedule(this.permissionSettleMs, () => {
          this.enforced.add(p);
          this.log("os", "PERMISSION_EFFECTIVE", p.split(".").pop());
        });
      }
    } else {
      this.enforced.delete(p);
    }
  }

  checkPermission(p: AndroidPermission): PermissionState {
    return this.granted[p] ?? "undetermined";
  }

  // The check the Bluetooth stack performs. iOS has no equivalent: CoreBluetooth
  // reports .unauthorized through the manager state instead of throwing.
  requirePermission(p: AndroidPermission): void {
    if (this.platform !== "android") return;
    if (this.apiLevel < 31 && p.startsWith("android.permission.BLUETOOTH_")) {
      return;
    }
    if (!this.enforced.has(p)) throw new SecurityException(p);
  }

  // ---- radio ---------------------------------------------------------------

  // Move the adapter through the states a real toggle passes through, so code
  // that only handles the endpoints is observably wrong. Listeners registered
  // by the native module receive every transition, as they would from
  // ACTION_STATE_CHANGED / centralManagerDidUpdateState.
  private adapterListeners: ((s: AdapterState) => void)[] = [];

  onAdapterState(fn: (s: AdapterState) => void): () => void {
    this.adapterListeners.push(fn);
    return () => {
      const i = this.adapterListeners.indexOf(fn);
      if (i >= 0) this.adapterListeners.splice(i, 1);
    };
  }

  private emitAdapter(s: AdapterState): void {
    this.adapter = s;
    this.log("os", "ADAPTER_STATE", s);
    // Broadcast delivery is on the main thread, with nothing above it to catch.
    for (const fn of [...this.adapterListeners]) {
      this.runOnThread("main", () => fn(s));
      if (this.crashed !== null) return;
    }
  }

  setBluetooth(on: boolean): void {
    if (!this.hasBluetooth) return;
    if (on) {
      if (this.adapter === "on") return;
      this.emitAdapter("turningOn");
      this.schedule(120, () => {
        // Every GATT handle from before the toggle is dead. Anything the app
        // still holds is a lie it has not discovered yet.
        this.emitAdapter("on");
      });
    } else {
      if (this.adapter === "off") return;
      this.emitAdapter("turningOff");
      this.gattGeneration++;
      this.schedule(80, () => this.emitAdapter("off"));
    }
  }

  // Bumped on every power cycle. A native module holding a handle from an
  // earlier generation is holding an invalid handle, whether or not it knows.
  gattGeneration = 0;

  // ---- foreground service --------------------------------------------------

  startForegroundService(): void {
    if (this.platform !== "android") return;
    if (this.apiLevel >= 31 && !this.appForeground) {
      throw new ForegroundServiceStartNotAllowedException();
    }
    // Android 14 checks that the app holds a permission matching the declared
    // service type at the moment startForeground runs.
    if (this.apiLevel >= 34) {
      const anyBt =
        this.enforced.has("android.permission.BLUETOOTH_CONNECT") ||
        this.enforced.has("android.permission.BLUETOOTH_SCAN") ||
        this.enforced.has("android.permission.BLUETOOTH_ADVERTISE");
      if (!anyBt) {
        throw new SecurityException(
          "FOREGROUND_SERVICE_CONNECTED_DEVICE requires a Bluetooth permission",
        );
      }
    }
    this.foregroundServiceRunning = true;
    this.log("os", "FGS_START");
  }

  stopForegroundService(): void {
    if (!this.foregroundServiceRunning) return;
    this.foregroundServiceRunning = false;
    this.log("os", "FGS_STOP");
  }

  // ---- iOS ----------------------------------------------------------------

  // CoreBluetooth's view of the same radio, including the states Airhop's Swift
  // never inspects.
  cbState(authorized = true): CBManagerState {
    if (!this.hasBluetooth) return "unsupported";
    if (!authorized) return "unauthorized";
    switch (this.adapter) {
      case "on":
        return "poweredOn";
      case "turningOn":
      case "turningOff":
        return "resetting";
      case "off":
        return "poweredOff";
    }
  }
}
