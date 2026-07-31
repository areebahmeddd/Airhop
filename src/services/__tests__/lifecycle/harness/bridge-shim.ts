// Indirection so a scenario can install a fresh native module per run while
// mesh-service keeps the module-scope import it does in production
// (src/services/mesh-service.ts:26). Swapping the import itself between tests
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
  getTorProxyPort: () => req().getTorProxyPort(),
  getTorAvailability: () => req().getTorAvailability(),
  addListener: (e) => req().addListener(e),
  removeListeners: (n) => req().removeListeners(n),
};

// WiFi Aware / MultipeerConnectivity is optional on every device, and
// mesh-service already null-guards it. Kept inert so a WiFi failure never
// masks a BLE finding.
export const wifiBridge = {
  startWiFi: async (): Promise<void> => undefined,
  stopWiFi: async (): Promise<void> => undefined,
  writeToWiFiLink: async (): Promise<void> => undefined,
  addListener: (): void => undefined,
  removeListeners: (): void => undefined,
};
