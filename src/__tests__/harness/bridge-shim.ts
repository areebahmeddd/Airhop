// Indirection so a scenario can install a fresh native module per run while
// mesh-service keeps the module-scope import it does in production
// (src/services/mesh-service.ts). Swapping the import itself between tests
// would mean re-importing mesh-service, and its singleton would come with it.

import type { BleNativeModule } from "./android-native";

let current: BleNativeModule | null = null;

export function installNativeBle(m: BleNativeModule | null): void {
  current = m;
}

function req(): BleNativeModule {
  if (current === null) {
    throw new Error("No native BLE module installed for this scenario");
  }
  return current;
}

// Mirrors the TurboModule surface of src/bridge/NativeAirhopBLE.ts exactly.
export const bleBridge: BleNativeModule = {
  startAdvertising: (uuid, name) => req().startAdvertising(uuid, name),
  stopAdvertising: () => req().stopAdvertising(),
  startScanning: (uuids) => req().startScanning(uuids),
  stopScanning: () => req().stopScanning(),
  writeToLink: (id, data) => req().writeToLink(id, data),
  getRadioState: () => req().getRadioState(),
  requestEnableBluetooth: () => req().requestEnableBluetooth(),
  openLocationSettings: () => req().openLocationSettings(),
  setBackgroundServiceEnabled: (enabled) =>
    req().setBackgroundServiceEnabled(enabled),
  setPowerMode: (mode) => req().setPowerMode(mode),
  addListener: (e) => req().addListener(e),
  removeListeners: (n) => req().removeListeners(n),
};

// WiFi Aware / MultipeerConnectivity, same indirection as BLE above.
//
// Inert until a scenario installs a module, because the transport is optional
// on every real device and mesh-service null-guards it: a suite that only cares
// about BLE must not have a WiFi failure masking its finding. A scenario that
// wants the fast path installs one and gets a working transport.
export interface WifiNativeModule {
  startWiFi(): Promise<void>;
  stopWiFi(): Promise<void>;
  writeToWiFiLink(linkID: string, dataBase64: string): Promise<void>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

let currentWifi: WifiNativeModule | null = null;

export function installNativeWifi(m: WifiNativeModule | null): void {
  currentWifi = m;
}

export const wifiBridge = {
  startWiFi: async (): Promise<void> => currentWifi?.startWiFi(),
  stopWiFi: async (): Promise<void> => currentWifi?.stopWiFi(),
  writeToWiFiLink: async (linkID: string, dataBase64: string): Promise<void> =>
    currentWifi?.writeToWiFiLink(linkID, dataBase64),
  addListener: (e: string): void => currentWifi?.addListener(e),
  removeListeners: (n: number): void => currentWifi?.removeListeners(n),
};

// The LAN transport. Unlike WiFi Aware, discovery and dialling are separate:
// mDNS finds everyone on the network and who to connect to is a decision, so
// the module reports what it sees and opens the sockets it is told to.
export interface LanNativeModule {
  startLAN(instanceName: string): Promise<void>;
  stopLAN(): Promise<void>;
  connectToPeer(serviceName: string): Promise<void>;
  writeToLANLink(linkID: string, dataBase64: string): Promise<void>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

let currentLan: LanNativeModule | null = null;

export function installNativeLan(m: LanNativeModule | null): void {
  currentLan = m;
}

export const lanBridge = {
  startLAN: async (instanceName: string): Promise<void> =>
    currentLan?.startLAN(instanceName),
  stopLAN: async (): Promise<void> => currentLan?.stopLAN(),
  connectToPeer: async (serviceName: string): Promise<void> =>
    currentLan?.connectToPeer(serviceName),
  writeToLANLink: async (linkID: string, dataBase64: string): Promise<void> =>
    currentLan?.writeToLANLink(linkID, dataBase64),
  addListener: (e: string): void => currentLan?.addListener(e),
  removeListeners: (n: number): void => currentLan?.removeListeners(n),
};

export const inertLanBridge = {
  startLAN: async (): Promise<void> => undefined,
  stopLAN: async (): Promise<void> => undefined,
  connectToPeer: async (): Promise<void> => undefined,
  writeToLANLink: async (): Promise<void> => undefined,
  addListener: (): void => undefined,
  removeListeners: (): void => undefined,
};

// The original inert form, kept for suites that never install a module.
export const inertWifiBridge = {
  startWiFi: async (): Promise<void> => undefined,
  stopWiFi: async (): Promise<void> => undefined,
  writeToWiFiLink: async (): Promise<void> => undefined,
  addListener: (): void => undefined,
  removeListeners: (): void => undefined,
};
