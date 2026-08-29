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

// The screen's own copy, already translated.
export interface PairingLabels {
  action: string;
  cancel: string;
  unavailable: string;
}

// The tokens the screen paints with, resolved from `useThemeColors()` so it
// answers the theme setting like every other surface.
export interface PairingColors {
  bg: string;
  surface: string;
  border: string;
  textPrimary: string;
  textMuted: string;
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
  // `labels` and `colors` are the screen that launches Apple's sheet, which is
  // ours rather than the system's. Both cross the bridge for the same reason:
  // native owns no user-facing content and no visual value. The strings come
  // from the catalog and the colours from `useThemeColors()`, so the screen
  // follows the app's theme without Swift holding a second palette that would
  // drift from src/ui/theme.ts.
  //
  // Resolves when the screen is dismissed, paired or not: the result arrives
  // through devicesChanged. Rejects with WIFI_AWARE_UNSUPPORTED or NO_PRESENTER.
  presentPairing(
    mode: string,
    labels: PairingLabels,
    colors: PairingColors,
  ): Promise<void>;

  // Required by the NativeEventEmitter contract.
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// `get`, not `getEnforcing`: Android registers no such module, and a device
// without pairing must still run the mesh.
export default TurboModuleRegistry.get<Spec>("AirhopWiFiPairing");
