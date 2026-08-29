// Wi-Fi Aware pairing: which devices the fast path is allowed to reach.
//
// iOS ONLY in effect. Apple's Wi-Fi Aware has no unpaired mode, so a device must
// be in the app's paired list before any data path to it can exist. On Android
// `NativeAirhopWiFiPairing` is null, the watcher does nothing, and
// wifi-controller.ts never learns a paired count, which is what leaves its gate
// open.
//
// Two consumers, one writer, so they cannot disagree about whether this phone
// has anyone to be fast with: WiFiController through `setPairedCount`, and
// mesh-state-store for the Network screen.

import NativeAirhopWiFiPairing, {
  type PairingColors,
  type PairingState,
} from "@bridge/NativeAirhopWiFiPairing";
import { t } from "@i18n";
import { useMeshStateStore } from "@store/mesh-state-store";
import type { useThemeColors } from "@ui/theme";
import { DeviceEventEmitter, type EmitterSubscription } from "react-native";

// The palette object a screen holds, named the way settings-primitives does.
type ThemeColors = ReturnType<typeof useThemeColors>;

// Which half of the pairing this device is playing. Pairing is two-sided, the
// way Bluetooth pairing is: one phone looks, the other is looked at, both at the
// same moment.
export type PairingMode = "find" | "discoverable";

// Whether this build has a pairing module at all. False on Android, where the
// fast path needs no pairing, and the Network screen hides the section rather
// than offering a control that could not do anything.
export function hasWiFiPairing(): boolean {
  return (
    NativeAirhopWiFiPairing !== null && NativeAirhopWiFiPairing !== undefined
  );
}

// The watcher MeshService is running, if any. Module-level so the function below
// can re-read the list when the sheet closes, without the Network screen
// reaching through MeshService for an object it has no other use for.
let active: WiFiPairingWatcher | null = null;

// Show Apple's pairing sheet.
//
// Copy and colours are read here rather than in Swift because native owns no
// user-facing content and no visual value. `colors` comes from the caller, which
// is a component holding `useThemeColors()`, so the launcher screen answers the
// theme setting like every other surface.
//
// Resolves when the screen is dismissed, paired or not: the result arrives
// through the watcher below.
export async function presentWiFiPairing(
  mode: PairingMode,
  colors: ThemeColors,
): Promise<void> {
  if (!hasWiFiPairing()) return;
  try {
    await NativeAirhopWiFiPairing?.presentPairing(
      mode,
      {
        action:
          mode === "find"
            ? t("settings.network.wifi_pair_find_action")
            : t("settings.network.wifi_pair_show_action"),
        cancel: t("common.cancel"),
        unavailable: t("settings.network.wifi_pair_unavailable"),
      },
      palette(colors),
    );
  } catch {
    // Refused to present, which the screen already covers: the section is only
    // shown when `wifiPairingSupported` is true, and a refusal after that is a
    // transient the user can answer by tapping again.
  }
  // Backstop for an event raised while the sheet was up. `devicesChanged` is the
  // normal path, but it is dropped when no bridge is attached to receive it, and
  // a modal is when that is most likely.
  await active?.refresh();
}

// Only the five tokens the launcher screen paints with, narrowed rather than
// passed whole so the bridge payload cannot quietly become a second copy of the
// palette.
function palette(colors: ThemeColors): PairingColors {
  return {
    bg: colors.bg,
    surface: colors.surface,
    border: colors.border,
    textPrimary: colors.textPrimary,
    textMuted: colors.textMuted,
  };
}

// The paired-device list, watched for the life of the mesh. Constructed with a
// callback rather than reaching for the controller, so this file has no opinion
// about who is listening.
export class WiFiPairingWatcher {
  constructor(private readonly onCount: (count: number) => void) {}

  private sub: EmitterSubscription | null = null;
  private started = false;

  start(): void {
    if (this.started || !hasWiFiPairing()) return;
    this.started = true;
    active = this;
    // Subscribed before the first read, so a pairing completed during that
    // round trip is not lost in the gap.
    this.sub = DeviceEventEmitter.addListener(
      "AirhopWiFiPairing.devicesChanged",
      ({ count }: { count: number }) => {
        // `supported` cannot change within a process, so it is carried forward
        // rather than asked again.
        this.apply({
          supported: useMeshStateStore.getState().wifiPairingSupported,
          count,
        });
      },
    );
    void this.refresh();
  }

  stop(): void {
    this.sub?.remove();
    this.sub = null;
    this.started = false;
    if (active === this) active = null;
  }

  // How the first answer arrives, and how a missed event is recovered. Not a
  // poll: the subscription above is what catches an unpairing done in Settings.
  async refresh(): Promise<void> {
    if (!hasWiFiPairing()) return;
    try {
      const state = await NativeAirhopWiFiPairing?.getPairingState();
      if (state !== undefined) this.apply(state);
    } catch {
      // The store keeps its last answer, which beats reporting zero and tearing
      // down a working transport.
    }
  }

  private apply(state: PairingState): void {
    useMeshStateStore.getState().setWifiPairing(state.supported, state.count);
    this.onCount(state.count);
  }
}
