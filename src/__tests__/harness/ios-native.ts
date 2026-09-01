// A transcription of ios/Airhop/AirhopBLEModule.swift, running against the OS
// model. Same contract as the Android transcription: branch for branch, with
// the Swift line on each.
//
// Audit anchors, current file:
//   :98   ensureCentralManager / ensurePeripheralManager, created ONCE
//   :128  applyState(), the reconciler every entry point funnels into
//   :175  registerService()
//   :200  startAdvertising, refuses per CBManagerState
//   :250  startScanning, same
//   :300  getRadioState, answers before any manager exists
//   :560  centralManagerDidUpdateState, all six states
//   :620  reportAdapterState, change-only
//   :745  peripheralManagerDidUpdateState, all six states, real teardown

import { DeviceEventEmitter } from "react-native";
import type {
  BleNativeModule,
  RadioPort,
  RadioStateReport,
} from "./android-native";
import type { CBManagerState, DeviceOS } from "./os";

const EVT_LINK_CONNECTED = "AirhopBLE.linkConnected";
const EVT_LINK_DISCONNECTED = "AirhopBLE.linkDisconnected";
const EVT_ADAPTER_STATE = "AirhopBLE.adapterStateChanged";
const EVT_PACKET_RECEIVED = "AirhopBLE.packetReceived";
const EVT_RSSI_UPDATED = "AirhopBLE.rssiUpdated";

// How long CoreBluetooth takes to deliver the first didUpdateState after a
// manager is constructed.
const MANAGER_INIT_MS = 60;
// didAdd(service:) turnaround.
const SERVICE_ADD_MS = 10;

function rejectWith(code: string, message: string): Promise<never> {
  return Promise.reject(Object.assign(new Error(message), { code }));
}

export class IosBleModule implements BleNativeModule {
  private centralManager: { state: CBManagerState } | null = null;
  private peripheralManager: { state: CBManagerState } | null = null;
  // Written on service registration, cleared on a power cycle. Only read back
  // by the harness to confirm the service really was rebuilt.
  characteristic: object | null = null;

  private centralLinks = new Map<string, { generation: number }>();
  private readyCentralLinks = new Set<string>();
  private peripheralLinks = new Map<string, { generation: number }>();

  // Intent, separate from reality.
  private wantScanning = false;
  private wantAdvertising = false;
  private serviceRegistered = false;

  // Change-only reporting.
  private lastReportedEnabled: boolean | null = null;

  // Observables for the harness.
  centralManagersCreated = 0;
  peripheralManagersCreated = 0;
  advertising = false;
  scanning = false;

  authorized = true;

  constructor(private readonly os: DeviceOS) {
    os.onAdapterState(() => {
      if (this.centralManager !== null) {
        this.centralManager.state = this.os.cbState(this.authorized);
        this.os.runOnThread("bleQueue", () =>
          this.centralManagerDidUpdateState(),
        );
      }
      if (this.peripheralManager !== null) {
        this.peripheralManager.state = this.os.cbState(this.authorized);
        this.os.runOnThread("bleQueue", () =>
          this.peripheralManagerDidUpdateState(),
        );
      }
    });
  }

  // One manager each, for the life of the process.
  private ensureCentralManager(): { state: CBManagerState } {
    if (this.centralManager !== null) return this.centralManager;
    const manager: { state: CBManagerState } = { state: "unknown" };
    this.centralManager = manager;
    this.centralManagersCreated++;
    this.os.log(
      "native",
      "CBCentralManager_CREATED",
      `#${this.centralManagersCreated}`,
    );
    this.os.schedule(MANAGER_INIT_MS, () => {
      manager.state = this.os.cbState(this.authorized);
      this.centralManagerDidUpdateState();
    });
    return manager;
  }

  private ensurePeripheralManager(): { state: CBManagerState } {
    if (this.peripheralManager !== null) return this.peripheralManager;
    const manager: { state: CBManagerState } = { state: "unknown" };
    this.peripheralManager = manager;
    this.peripheralManagersCreated++;
    this.os.log(
      "native",
      "CBPeripheralManager_CREATED",
      `#${this.peripheralManagersCreated}`,
    );
    this.os.schedule(MANAGER_INIT_MS, () => {
      manager.state = this.os.cbState(this.authorized);
      this.peripheralManagerDidUpdateState();
    });
    return manager;
  }

  // The reconciler. Idempotent by construction.
  private applyState(): void {
    const before = `${this.scanning}/${this.advertising}`;
    this.applyStateInner();
    if (`${this.scanning}/${this.advertising}` !== before) {
      this.radioPort?.radiosChanged();
    }
  }

  private applyStateInner(): void {
    const centralReady = this.centralManager?.state === "poweredOn";
    const peripheralReady = this.peripheralManager?.state === "poweredOn";

    if (this.wantScanning && centralReady) {
      if (!this.scanning) {
        this.scanning = true;
        this.os.log("native", "SCANNING_STARTED");
      }
    } else if (this.scanning) {
      this.scanning = false;
      this.os.log("native", "SCANNING_STOPPED");
    }

    if (this.wantAdvertising && peripheralReady) {
      if (!this.serviceRegistered) {
        this.registerService();
      } else if (!this.advertising) {
        this.advertising = true;
        this.os.log("native", "ADVERTISING_STARTED");
      }
    } else if (this.advertising) {
      this.advertising = false;
      this.os.log("native", "ADVERTISING_STOPPED");
    }
  }

  private registerService(): void {
    this.characteristic = {};
    this.os.schedule(SERVICE_ADD_MS, () => {
      // didAdd(service:)
      this.serviceRegistered = true;
      this.applyState();
    });
  }

  private refusalFor(
    state: CBManagerState,
  ): { code: string; msg: string } | null {
    switch (state) {
      case "poweredOn":
        return null;
      case "unauthorized":
        return {
          code: "PERMISSION_DENIED",
          msg: "Bluetooth permission was denied",
        };
      case "unsupported":
        return {
          code: "UNSUPPORTED",
          msg: "This device does not support Bluetooth LE",
        };
      case "poweredOff":
        return { code: "RADIO_OFF", msg: "Bluetooth is switched off" };
      default:
        return { code: "RADIO_OFF", msg: "Bluetooth is not ready yet" };
    }
  }

  async startAdvertising(
    _serviceUUID: string,
    _localName: string,
  ): Promise<void> {
    this.wantAdvertising = true;
    const manager = this.ensurePeripheralManager();
    const refusal = this.refusalFor(manager.state);
    if (refusal !== null) return rejectWith(refusal.code, refusal.msg);
    this.applyState();
  }

  async stopAdvertising(): Promise<void> {
    this.wantAdvertising = false;
    this.applyState();
  }

  async startScanning(_serviceUUIDs: string[]): Promise<void> {
    this.wantScanning = true;
    const manager = this.ensureCentralManager();
    const refusal = this.refusalFor(manager.state);
    if (refusal !== null) return rejectWith(refusal.code, refusal.msg);
    this.applyState();
  }

  async stopScanning(): Promise<void> {
    this.wantScanning = false;
    this.applyState();
  }

  // Answers honestly before any manager exists, by building the
  // one shared manager here rather than reading a nil.
  async getRadioState(): Promise<RadioStateReport> {
    const manager = this.ensureCentralManager();
    let authorization: RadioStateReport["authorization"];
    if (!this.authorized) {
      // iOS never re-prompts once denied, so denial is permanent.
      authorization = "blocked";
    } else if (manager.state === "unknown") {
      authorization = "unknown";
    } else {
      authorization = "granted";
    }
    return {
      supported: manager.state !== "unsupported" && this.os.hasBluetooth,
      poweredOn: manager.state === "poweredOn",
      authorization,
      // Never gates BLE on iOS: CoreBluetooth has no location coupling to
      // assert away, so there is nothing for the blocker to consider.
      locationRequiredForScan: false,
      locationServicesEnabled: true,
      // CoreBluetooth exposes no scan-rate control, so a battery reading would
      // have nothing to drive.
      batteryPercent: -1,
      charging: false,
    };
  }

  // No such API on iOS; the caller falls back to Settings.
  async requestEnableBluetooth(): Promise<boolean> {
    return false;
  }

  async openLocationSettings(): Promise<boolean> {
    return false;
  }

  // Background BLE comes from UIBackgroundModes, not from us.
  async setBackgroundServiceEnabled(_enabled: boolean): Promise<void> {
    return;
  }

  // No-op: CoreBluetooth has no scan-rate knob and already throttles background
  // BLE on the app's behalf.
  async setPowerMode(_mode: string): Promise<void> {
    return;
  }

  // Every CBManagerState does its own work.
  private centralManagerDidUpdateState(): void {
    const state = this.centralManager?.state ?? "unknown";
    this.reportAdapterState(state === "poweredOn");

    switch (state) {
      case "poweredOn":
        this.applyState();
        break;
      case "poweredOff":
      case "unauthorized":
      case "resetting":
        this.retireAllCentralLinks();
        this.scanning = false;
        break;
      case "unsupported":
        this.scanning = false;
        break;
      case "unknown":
        break;
    }
    this.radioPort?.radiosChanged();
  }

  private reportAdapterState(enabled: boolean): void {
    if (this.lastReportedEnabled === enabled) return;
    this.lastReportedEnabled = enabled;
    this.emitEvent(EVT_ADAPTER_STATE, { enabled });
  }

  private retireAllCentralLinks(): void {
    for (const linkID of this.centralLinks.keys()) {
      this.emitEvent(EVT_LINK_DISCONNECTED, { linkID });
    }
    this.centralLinks.clear();
    this.readyCentralLinks.clear();
  }

  private retireAllCentralSubscribers(): void {
    for (const linkID of this.peripheralLinks.keys()) {
      this.emitEvent(EVT_LINK_DISCONNECTED, { linkID });
    }
    this.peripheralLinks.clear();
  }

  // The method that can leave an iPhone invisible.
  private peripheralManagerDidUpdateState(): void {
    const state = this.peripheralManager?.state ?? "unknown";
    switch (state) {
      case "poweredOn":
        // CoreBluetooth discards registered services across a power cycle.
        this.serviceRegistered = false;
        this.advertising = false;
        this.applyState();
        break;
      case "poweredOff":
      case "unauthorized":
      case "resetting":
        this.retireAllCentralSubscribers();
        this.serviceRegistered = false;
        this.advertising = false;
        this.characteristic = null;
        break;
      case "unsupported":
        this.advertising = false;
        break;
      case "unknown":
        break;
    }
    this.radioPort?.radiosChanged();
  }

  // RCTEventEmitter drops an event with no listeners; iOS has no equivalent of
  // the Android crash.
  private emitEvent(name: string, body: Record<string, unknown>): void {
    if (!this.os.jsRuntimeReady) {
      this.os.log("native", "EVENT_DROPPED_NO_JS", name);
      return;
    }
    DeviceEventEmitter.emit(name, body);
  }

  async writeToLink(linkID: string, dataBase64: string): Promise<void> {
    if (this.centralLinks.has(linkID)) {
      if (!this.readyCentralLinks.has(linkID)) {
        return rejectWith("NOT_READY", `Link ${linkID} is not notifying yet`);
      }
      const link = this.centralLinks.get(linkID);
      if (link !== undefined && link.generation !== this.os.gattGeneration) {
        return rejectWith("WRITE_BUSY", "stale link");
      }
      this.radioPort?.write(linkID, dataBase64);
      return;
    }
    if (this.peripheralLinks.has(linkID)) {
      this.radioPort?.write(linkID, dataBase64);
      return;
    }
    return rejectWith("UNKNOWN_LINK", `No active link with ID ${linkID}`);
  }

  addListener(): void {
    /* RCTEventEmitter contract */
  }

  removeListeners(): void {
    /* RCTEventEmitter contract */
  }

  // ---- shared radio medium ----

  radioPort: RadioPort | null = null;

  // The rule that costs iPhone-to-Android discovery: once the app leaves the
  // foreground CoreBluetooth moves the service UUID into the advertisement
  // overflow area and drops the local name, so only another iOS device scanning
  // for that exact UUID can still see it. Modelled here rather than in the
  // medium because it is a property of THIS radio, and the medium only has to
  // ask whether the far side is an iPhone.
  get discoverable(): boolean {
    return this.advertising;
  }

  get discoverableToAndroid(): boolean {
    return this.advertising && this.os.appForeground;
  }

  get canScan(): boolean {
    return this.scanning;
  }

  fabricLinkUp(
    linkID: string,
    role: "central" | "peripheral",
    rssi: number,
  ): void {
    const generation = this.os.gattGeneration;
    if (role === "central") {
      this.centralLinks.set(linkID, { generation });
      this.readyCentralLinks.add(linkID);
    } else {
      this.peripheralLinks.set(linkID, { generation });
    }
    this.os.runOnThread("bleQueue", () => {
      this.emitEvent(EVT_LINK_CONNECTED, { linkID, role, rssi });
    });
  }

  fabricLinkDown(linkID: string): void {
    const had =
      this.centralLinks.delete(linkID) || this.peripheralLinks.delete(linkID);
    this.readyCentralLinks.delete(linkID);
    if (!had) return;
    this.os.runOnThread("bleQueue", () => {
      this.emitEvent(EVT_LINK_DISCONNECTED, { linkID });
    });
  }

  fabricDeliver(linkID: string, dataBase64: string): void {
    if (!this.centralLinks.has(linkID) && !this.peripheralLinks.has(linkID)) {
      return;
    }
    this.os.runOnThread("bleQueue", () => {
      this.emitEvent(EVT_PACKET_RECEIVED, { linkID, dataBase64 });
    });
  }

  fabricRssi(linkID: string, rssi: number): void {
    if (!this.centralLinks.has(linkID) && !this.peripheralLinks.has(linkID)) {
      return;
    }
    this.os.runOnThread("bleQueue", () => {
      this.emitEvent(EVT_RSSI_UPDATED, { linkID, rssi });
    });
  }

  liveLinkIDs(): string[] {
    return [...this.centralLinks.keys(), ...this.peripheralLinks.keys()];
  }

  // ---- test affordances ----

  simulatePeerConnect(linkID: string): void {
    if (!this.scanning) return;
    this.centralLinks.set(linkID, { generation: this.os.gattGeneration });
    this.readyCentralLinks.add(linkID);
    this.os.runOnThread("bleQueue", () => {
      this.emitEvent(EVT_LINK_CONNECTED, {
        linkID,
        role: "central",
        rssi: -60,
      });
    });
  }

  staleLinkCount(): number {
    let stale = 0;
    for (const [, link] of this.centralLinks) {
      if (link.generation !== this.os.gattGeneration) stale++;
    }
    return stale;
  }
}

export { EVT_ADAPTER_STATE, EVT_LINK_CONNECTED, EVT_LINK_DISCONNECTED };
