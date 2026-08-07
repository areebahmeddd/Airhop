// A transcription of android/app/src/main/java/org/onemindlabs/airhop/ble/
// AirhopBLEModule.kt, running against the OS model.
//
// It tracks the Kotlin branch for branch, with the source line on each, so a
// scenario failure is evidence about the real module rather than about a
// convenient approximation. What it CANNOT do is prove the Kotlin compiles or
// that the platform behaves as modelled - that still needs a device build. What
// it does prove is that the logic, given the OS behaviours in os.ts, produces
// the right sequence of calls and the right state.
//
// Audit anchors, current file:
//   :90   lazy, nullable bluetoothManager / adapter
//   :127  adapterStateReceiver — ON / TURNING_OFF / OFF
//   :195  initialize() registers the receiver (NOT init{})
//   :262  releaseRadioState()
//   :300  emitEvent — hasActiveReactInstance() guard + try/catch
//   :318  emitAdapterState — change-only
//   :330  getRadioState
//   :420  requestEnableBluetooth
//   :470  openLocationSettings
//   :490  setBackgroundServiceEnabled
//   :508  startAdvertising — precondition rejections
//   :596  stopAdvertising — does NOT touch the foreground service
//   :620  startScanning — precondition rejections incl. location services

import { DeviceEventEmitter } from "react-native";
import { DeviceOS } from "./os";

const EVT_LINK_CONNECTED = "AirhopBLE.linkConnected";
const EVT_LINK_DISCONNECTED = "AirhopBLE.linkDisconnected";
const EVT_ADAPTER_STATE = "AirhopBLE.adapterStateChanged";
const EVT_MESH_STOP_REQUESTED = "AirhopBLE.meshStopRequested";
const EVT_PACKET_RECEIVED = "AirhopBLE.packetReceived";
const EVT_RSSI_UPDATED = "AirhopBLE.rssiUpdated";
const EVT_SCAN_FAILED = "AirhopBLE.scanFailed";

// How a device is wired into a shared radio medium (see sim/harness/radio-fabric).
// Without one installed the module behaves exactly as it did for the
// single-device lifecycle tests: writes resolve into the void.
export interface RadioPort {
  // Bytes leaving this device on a link. The medium decides whether, when, and
  // in what condition they arrive.
  write(linkID: string, dataBase64: string): void;
  // Advertising or scanning changed, so who can see whom may have changed.
  radiosChanged(): void;
}

// The DeviceEventEmitter object THIS module resolved.
//
// mesh-service.ts imports the same symbol from the same specifier, so inside a
// given module registry the two are guaranteed to be the same object. That
// guarantee is the only reliable way for the multi-device harness to get hold
// of the emitter a phone actually uses: reaching for it from outside the
// sandbox can resolve a different copy, and patching the wrong one fails
// silently. See sim/harness/event-router.ts.
export function resolvedDeviceEventEmitter(): Record<string, unknown> {
  return DeviceEventEmitter as unknown as Record<string, unknown>;
}

export interface RadioStateReport {
  supported: boolean;
  poweredOn: boolean;
  authorization: "granted" | "denied" | "blocked" | "unknown";
  // Whether a scan on this device counts as a location access. API <=30 only.
  locationRequiredForScan: boolean;
  locationServicesEnabled: boolean;
  // -1 when the platform has nothing to say. Drives the power policy.
  batteryPercent: number;
  charging: boolean;
}

export interface BleNativeModule {
  startAdvertising(serviceUUID: string, localName: string): Promise<void>;
  stopAdvertising(): Promise<void>;
  startScanning(serviceUUIDs: string[]): Promise<void>;
  stopScanning(): Promise<void>;
  writeToLink(linkID: string, dataBase64: string): Promise<void>;
  getRadioState(): Promise<RadioStateReport>;
  requestEnableBluetooth(): Promise<boolean>;
  openLocationSettings(): Promise<boolean>;
  setBackgroundServiceEnabled(enabled: boolean): Promise<void>;
  setPowerMode(mode: string): Promise<void>;
  getTorProxyPort(): Promise<number>;
  getTorAvailability(): Promise<{
    orbotInstalled: boolean;
    vpnActive: boolean;
  }>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

function rejectWith(code: string, message: string): Promise<never> {
  return Promise.reject(Object.assign(new Error(message), { code }));
}

export class AndroidBleModule implements BleNativeModule {
  private gattServer: { generation: number } | null = null;
  private characteristic: object | null = null;

  private peripheralLinks = new Map<string, { generation: number }>();
  private centralLinks = new Map<string, { generation: number }>();

  // Reproduced, not transcribed: what the platform advertiser/scanner is
  // actually doing, so the harness can assert on it. The Kotlin holds no such
  // flags - it calls through to the adapter every time.
  advertising = false;
  scanning = false;

  // Kotlin :319 — the change-only gate on adapter reporting.
  private lastReportedEnabled: boolean | null = null;

  private unregisterAdapterListener: (() => void) | null = null;
  private receiverRegistered = false;

  constructor(private readonly os: DeviceOS) {
    // Kotlin :90-:104. The adapter is resolved lazily and may be null; nothing
    // here throws. Constructing this module on a device with no Bluetooth used
    // to take the whole app down inside createNativeModules.
    this.os.log(
      "native",
      "MODULE_CONSTRUCTED",
      "no receiver yet, no adapter touched",
    );
  }

  // Kotlin :195-:200. Called once the catalyst instance exists, so the receiver
  // is not live during the window where reaching JS would throw.
  initialize(): void {
    if (this.receiverRegistered) return;
    this.receiverRegistered = true;
    this.unregisterAdapterListener = this.os.onAdapterState((state) => {
      // Kotlin :131-:152
      if (state === "on") {
        this.emitAdapterState(true);
      } else if (state === "turningOff" || state === "off") {
        // Tear down on TURNING_OFF rather than waiting for OFF: by then every
        // handle is already invalid.
        this.releaseRadioState();
        this.emitAdapterState(false);
      }
      // turningOn is deliberately not reported.
    });
    this.os.log("native", "RECEIVER_REGISTERED");
  }

  // Kotlin :232-:260
  invalidate(): void {
    this.unregisterAdapterListener?.();
    this.unregisterAdapterListener = null;
    this.receiverRegistered = false;
    this.scanning = false;
    this.advertising = false;
    this.gattServer = null;
    this.characteristic = null;
    this.lastReportedEnabled = null;
    this.os.stopForegroundService();
  }

  // Kotlin :262-:288
  private releaseRadioState(): void {
    for (const linkID of [
      ...this.peripheralLinks.keys(),
      ...this.centralLinks.keys(),
    ]) {
      this.emitEvent(EVT_LINK_DISCONNECTED, { linkID });
    }
    this.centralLinks.clear();
    this.peripheralLinks.clear();
    this.gattServer = null;
    this.characteristic = null;
    this.advertising = false;
    this.scanning = false;
    this.radioPort?.radiosChanged();
  }

  // Kotlin :318-:325 — never announce an unchanged state.
  private emitAdapterState(enabled: boolean): void {
    if (this.lastReportedEnabled === enabled) return;
    this.lastReportedEnabled = enabled;
    this.emitEvent(EVT_ADAPTER_STATE, { enabled });
  }

  // Kotlin :300-:312.
  //
  // hasActiveReactInstance() guard AND a try/catch. Callers run on threads the
  // OS owns - the main thread for the BroadcastReceiver, binder threads for the
  // GATT callbacks - so an uncaught throw here is process death, which is
  // exactly what this used to be.
  private emitEvent(name: string, body: Record<string, unknown>): void {
    if (!this.os.jsRuntimeReady) {
      this.os.log("native", "EVENT_DROPPED_NO_JS", name);
      return;
    }
    try {
      DeviceEventEmitter.emit(name, body);
    } catch {
      this.os.log("native", "EVENT_DROPPED_THREW", name);
    }
  }

  // Kotlin :330-:352
  async getRadioState(): Promise<RadioStateReport> {
    const supported = this.os.hasBluetooth;
    return {
      supported,
      poweredOn: supported && this.os.adapter === "on",
      authorization: this.currentAuthorization(),
      locationRequiredForScan: this.os.apiLevel < 31,
      locationServicesEnabled: this.os.locationServicesEnabled,
      batteryPercent: this.batteryPercent,
      charging: this.charging,
    };
  }

  // Scenario knobs: what the battery receiver would be reporting.
  batteryPercent = 80;
  charging = false;

  // The effort level native is currently applying. Observable so a scenario can
  // assert that a pocketed phone actually stopped scanning flat out - the
  // duty cycle itself lives below the JS boundary and is deliberately invisible
  // to it, so this is the only thing there is to check.
  powerMode = "balanced";

  // Kotlin setPowerMode. Note what it does NOT do: report a link or adapter
  // change. A duty-cycled scan is still "scanning" as far as JS is concerned,
  // and saying otherwise would have the reconciler try to fix a working state.
  async setPowerMode(mode: string): Promise<void> {
    if (mode === this.powerMode) return;
    this.powerMode = mode;
    this.os.log("native", "POWER_MODE", mode);
  }

  // Kotlin :360-:372
  private currentAuthorization(): "granted" | "denied" {
    // Answers for whatever the mesh needs at this API level, matching
    // requiredBlePermissions() on both sides of the boundary.
    if (this.os.apiLevel < 31) {
      return this.os.checkPermission(
        "android.permission.ACCESS_FINE_LOCATION",
      ) === "granted"
        ? "granted"
        : "denied";
    }
    const needed = [
      "android.permission.BLUETOOTH_SCAN",
      "android.permission.BLUETOOTH_ADVERTISE",
      "android.permission.BLUETOOTH_CONNECT",
    ] as const;
    return needed.every((p) => this.os.checkPermission(p) === "granted")
      ? "granted"
      : "denied";
  }

  // Kotlin :420-:460
  async requestEnableBluetooth(): Promise<boolean> {
    if (!this.os.hasBluetooth) return false;
    if (this.os.adapter === "on") return true;
    if (
      this.os.apiLevel >= 31 &&
      this.os.checkPermission("android.permission.BLUETOOTH_CONNECT") !==
        "granted"
    ) {
      return false;
    }
    this.os.log("native", "ENABLE_BT_DIALOG_SHOWN");
    // The harness's stand-in for the user tapping "Allow" on the system dialog.
    if (this.userWillEnableBluetooth) {
      this.os.setBluetooth(true);
      // The dialog returns once the adapter has settled.
      return true;
    }
    return false;
  }

  // Scenario knob: how the user answers the system enable dialog.
  userWillEnableBluetooth = true;

  // Kotlin :470-:482
  async openLocationSettings(): Promise<boolean> {
    this.os.log("native", "LOCATION_SETTINGS_OPENED");
    return true;
  }

  // Kotlin :490-:504 — the background service, no longer tied to advertising.
  async setBackgroundServiceEnabled(enabled: boolean): Promise<void> {
    try {
      if (enabled) {
        this.os.startForegroundService();
      } else {
        this.os.stopForegroundService();
      }
    } catch (e) {
      this.os.log("native", "FGS_REFUSED", (e as Error).name);
      return rejectWith("FGS_REFUSED", (e as Error).message);
    }
  }

  // Kotlin :508-:582 — every precondition the platform will not report.
  // How many times JS has asked. A device that can never advertise must be
  // asked once, not on a five-second loop for the life of the process.
  advertiseAttempts = 0;

  async startAdvertising(
    _serviceUUID: string,
    _localName: string,
  ): Promise<void> {
    this.advertiseAttempts++;
    if (!this.os.hasBluetooth) {
      return rejectWith("UNSUPPORTED", "This device has no Bluetooth adapter");
    }
    if (this.os.adapter !== "on") {
      return rejectWith("RADIO_OFF", "Bluetooth is switched off");
    }
    // Kotlin :1035 — bluetoothLeAdvertiser is null on a chipset with no
    // peripheral role. Central still works, so this is a partial capability
    // rather than a dead radio, and it can never change.
    if (!this.os.canAdvertise) {
      return rejectWith("UNSUPPORTED", "This device cannot advertise over BLE");
    }
    if (
      this.os.apiLevel >= 31 &&
      this.os.checkPermission("android.permission.BLUETOOTH_ADVERTISE") !==
        "granted"
    ) {
      return rejectWith(
        "PERMISSION_DENIED",
        "BLUETOOTH_ADVERTISE not granted yet",
      );
    }
    try {
      // The stack enforces the grant independently of what the app can see;
      // this is the window a fresh install lands in.
      this.os.requirePermission("android.permission.BLUETOOTH_ADVERTISE");
    } catch {
      return rejectWith(
        "PERMISSION_DENIED",
        "stack has not honoured the grant yet",
      );
    }
    this.setupGattServer();
    this.advertising = true;
    this.os.log("native", "ADVERTISING_STARTED");
    this.radioPort?.radiosChanged();
  }

  // Kotlin :596-:612. Note what is absent: the foreground service.
  async stopAdvertising(): Promise<void> {
    this.advertising = false;
    this.gattServer = null;
    this.characteristic = null;
    this.os.log("native", "ADVERTISING_STOPPED", "FGS untouched");
    this.radioPort?.radiosChanged();
  }

  // Kotlin :620-:690
  async startScanning(_serviceUUIDs: string[]): Promise<void> {
    if (!this.os.hasBluetooth) {
      return rejectWith("UNSUPPORTED", "This device has no Bluetooth adapter");
    }
    if (this.os.adapter !== "on") {
      return rejectWith("RADIO_OFF", "Bluetooth is switched off");
    }
    if (this.os.apiLevel >= 31) {
      if (
        this.os.checkPermission("android.permission.BLUETOOTH_SCAN") !==
        "granted"
      ) {
        return rejectWith(
          "PERMISSION_DENIED",
          "BLUETOOTH_SCAN not granted yet",
        );
      }
    } else {
      // Only below API 31. From there neverForLocation on BLUETOOTH_SCAN takes
      // the scanner out of location's reach entirely.
      if (
        this.os.checkPermission("android.permission.ACCESS_FINE_LOCATION") !==
        "granted"
      ) {
        return rejectWith(
          "PERMISSION_DENIED",
          "Location permission is required for BLE scan results below API 31",
        );
      }
      if (!this.os.locationServicesEnabled) {
        return rejectWith(
          "LOCATION_SERVICES_OFF",
          "Android withholds BLE scan results while location services are off",
        );
      }
    }
    try {
      this.os.requirePermission("android.permission.BLUETOOTH_SCAN");
    } catch {
      return rejectWith(
        "PERMISSION_DENIED",
        "stack has not honoured the grant yet",
      );
    }
    this.scanning = true;
    this.os.log("native", "SCANNING_STARTED");
    this.radioPort?.radiosChanged();
  }

  async stopScanning(): Promise<void> {
    this.scanning = false;
    this.os.log("native", "SCANNING_STOPPED");
    this.radioPort?.radiosChanged();
  }

  private setupGattServer(): void {
    if (this.gattServer !== null) return;
    this.gattServer = { generation: this.os.gattGeneration };
    this.characteristic = {};
    this.os.log("native", "GATT_SERVER_OPENED");
  }

  async writeToLink(linkID: string, dataBase64: string): Promise<void> {
    const central = this.centralLinks.get(linkID);
    if (central !== undefined) {
      if (central.generation !== this.os.gattGeneration) {
        return rejectWith(
          "WRITE_BUSY",
          `GATT handle invalidated for ${linkID}`,
        );
      }
      this.radioPort?.write(linkID, dataBase64);
      return;
    }
    if (this.peripheralLinks.has(linkID)) {
      if (this.characteristic === null) {
        return rejectWith("NOT_READY", "GATT server not initialized");
      }
      this.radioPort?.write(linkID, dataBase64);
      return;
    }
    return rejectWith("UNKNOWN_LINK", `No active link with ID ${linkID}`);
  }

  async getTorProxyPort(): Promise<number> {
    return 0;
  }

  async getTorAvailability(): Promise<{
    orbotInstalled: boolean;
    vpnActive: boolean;
  }> {
    return { orbotInstalled: false, vpnActive: false };
  }

  addListener(): void {
    /* NativeEventEmitter contract */
  }

  removeListeners(): void {
    /* NativeEventEmitter contract */
  }

  // ---- shared radio medium -------------------------------------------------

  // Installed by a RadioFabric when this device is one of many. Null for the
  // single-device lifecycle tests, where nothing is listening anyway.
  radioPort: RadioPort | null = null;

  // Whether this device is currently discoverable to a scanner. Android keeps
  // advertising from the foreground service, so unlike iOS it does not care
  // whether the app is on screen.
  get discoverable(): boolean {
    return this.advertising && this.os.adapter === "on";
  }

  get canScan(): boolean {
    return this.scanning && this.os.adapter === "on";
  }

  // The medium brought a link up. Role is from THIS device's point of view.
  fabricLinkUp(
    linkID: string,
    role: "central" | "peripheral",
    rssi: number,
  ): void {
    const generation = this.os.gattGeneration;
    if (role === "central") this.centralLinks.set(linkID, { generation });
    else this.peripheralLinks.set(linkID, { generation });
    this.os.runOnThread("binder", () => {
      this.emitEvent(EVT_LINK_CONNECTED, { linkID, role, rssi });
    });
  }

  fabricLinkDown(linkID: string): void {
    const had =
      this.centralLinks.delete(linkID) || this.peripheralLinks.delete(linkID);
    if (!had) return;
    this.os.runOnThread("binder", () => {
      this.emitEvent(EVT_LINK_DISCONNECTED, { linkID });
    });
  }

  // Bytes arriving from the medium. Delivered on a binder thread, as a real
  // GATT callback is, so an unguarded throw in JS is process death here too.
  fabricDeliver(linkID: string, dataBase64: string): void {
    if (!this.centralLinks.has(linkID) && !this.peripheralLinks.has(linkID)) {
      return;
    }
    this.os.runOnThread("binder", () => {
      this.emitEvent(EVT_PACKET_RECEIVED, { linkID, dataBase64 });
    });
  }

  fabricRssi(linkID: string, rssi: number): void {
    if (!this.centralLinks.has(linkID) && !this.peripheralLinks.has(linkID)) {
      return;
    }
    this.os.runOnThread("binder", () => {
      this.emitEvent(EVT_RSSI_UPDATED, { linkID, rssi });
    });
  }

  liveLinkIDs(): string[] {
    return [...this.centralLinks.keys(), ...this.peripheralLinks.keys()];
  }

  // ---- test affordances ----------------------------------------------------

  // The platform refusing a scan after accepting the request to start one.
  // ScanCallback.onScanFailed arrives on a binder thread, long after
  // startScan() resolved, which is what makes this the one radio failure the
  // reconciler cannot see for itself. 6 is SCAN_FAILED_SCANNING_TOO_FREQUENTLY,
  // the refusal a duty-cycled scanner is most likely to hit.
  simulateScanFailure(errorCode = 6): void {
    this.scanning = false;
    this.os.log("native", "SCAN_FAILED", String(errorCode));
    this.os.runOnThread("binder", () => {
      this.emitEvent(EVT_SCAN_FAILED, { errorCode });
    });
  }

  simulatePeerConnect(linkID: string): void {
    if (!this.scanning || this.os.adapter !== "on") return;
    // The OS withholds scan results with location off, but only while a scan
    // still counts as a location access - which is API <=30 now.
    if (this.os.apiLevel < 31 && !this.os.locationServicesEnabled) return;
    this.centralLinks.set(linkID, { generation: this.os.gattGeneration });
    this.os.runOnThread("binder", () => {
      this.emitEvent(EVT_LINK_CONNECTED, {
        linkID,
        role: "central",
        rssi: -60,
      });
    });
  }

  // Kotlin :810-:845 — the notification's "Stop mesh" action.
  requestMeshStop(): void {
    this.os.runOnThread("main", () => {
      if (!this.os.jsRuntimeReady) {
        // No JS to hand the shutdown to. The notification is about to
        // disappear either way, so the radios have to come down here or they
        // keep running with no UI left that can stop them.
        this.forceStopRadios();
        return;
      }
      this.emitEvent(EVT_MESH_STOP_REQUESTED, {});
    });
  }

  // Kotlin :832-:845
  private forceStopRadios(): void {
    this.scanning = false;
    this.advertising = false;
    this.gattServer = null;
    this.characteristic = null;
    this.os.stopForegroundService();
    this.os.log("native", "FORCE_STOPPED_RADIOS", "no JS runtime to ask");
  }

  staleLinkCount(): number {
    let stale = 0;
    for (const [, link] of this.centralLinks) {
      if (link.generation !== this.os.gattGeneration) stale++;
    }
    return stale;
  }
}
