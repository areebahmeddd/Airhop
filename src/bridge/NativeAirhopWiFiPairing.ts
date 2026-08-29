// The native contract for Wi-Fi Aware device pairing.
//
// Hand-maintained, not Codegen input. See NativeAirhopBLE.ts for why.
//
// iOS ONLY, backed by AirhopWiFiPairing.swift. Absent on Android rather than
// stubbed, because Apple's Wi-Fi Aware has no unpaired mode and Android's needs
// no pairing at all. services/wifi-pairing-service.ts optional-chains and reads
// a missing module as "this platform has no pairing gate".
//
// Separate from NativeAirhopWiFi because that spec is the transport, which both
// platforms implement in full. Pairing is a precondition to HAVING links here,
// not a property of a link.
//
// Events emitted by native code:
//
//   AirhopWiFiPairing.devicesChanged { count }
//
// Fires on every change to the paired list, including one made in the Settings
// app, which has no other signal at all.
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

// What this device can do, and what it is currently paired with.
export interface PairingState {
  // Whether Wi-Fi Aware exists here at all: iOS 26 or later, on hardware that
  // supports it (iPhone 12 and later), in a build whose Info.plist declares the
  // service. False is permanent for this device and this build.
  supported: boolean;
  // How many devices this app is paired with. Zero means the transport has
  // nobody to reach and will refuse to attach.
  count: number;
}

export interface Spec extends TurboModule {
  // Both facts in one answer, matching getRadioState on the BLE side: they are
  // read together on every refresh, and two calls could return a pair of answers
  // that never held at the same moment.
  getPairingState(): Promise<PairingState>;

  // Show the system pairing sheet.
  //
  // Pairing is two-sided, the way Bluetooth pairing is: `mode` is "find" to
  // browse for a device that has made itself discoverable, or "discoverable" to
  // advertise so the other one can find this.
  //
  // The labels are drawn on the screen that launches Apple's sheet, which is
  // ours rather than the system's, and arrive translated because no user-facing
  // string may be written in native code.
  //
  // Resolves when the screen is dismissed, paired or not: the result arrives
  // through devicesChanged. Rejects with WIFI_AWARE_UNSUPPORTED or NO_PRESENTER.
  presentPairing(
    mode: string,
    actionLabel: string,
    cancelLabel: string,
    unavailableLabel: string,
  ): Promise<void>;

  // Required by the NativeEventEmitter contract.
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// `get`, not `getEnforcing`: Android registers no such module, and a device
// without pairing must still run the mesh.
export default TurboModuleRegistry.get<Spec>("AirhopWiFiPairing");
