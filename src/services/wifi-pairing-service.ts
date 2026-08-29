// Wi-Fi Aware pairing: which devices the fast path may reach.
//
// iOS ONLY in effect. On Android `NativeAirhopWiFiPairing` is null, the watcher
// does nothing, and wifi-controller.ts never learns a count, which is what
// leaves its gate open.
//
// Two consumers, one writer, so they cannot disagree: WiFiController through
// `setPairedCount`, and mesh-state-store for the Network screen.

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

// Pairing is two-sided, the way Bluetooth pairing is: one phone looks, the
// other is looked at, at the same moment.
export type PairingMode = "find" | "discoverable";

// False on Android, where the Network screen hides the section rather than
// offering a control that could do nothing.
export function hasWiFiPairing(): boolean {
  return (
    NativeAirhopWiFiPairing !== null && NativeAirhopWiFiPairing !== undefined
  );
}

// Module-level so the function below can re-read the list when the sheet closes,
// without the screen reaching through MeshService for it.
let active: WiFiPairingWatcher | null = null;

// Labels and colours are read here because native owns no user-facing content
// and no visual value. `colors` comes from the caller, a component holding
// `useThemeColors()`, so the launcher answers the theme setting.
//
// Resolves on dismissal, paired or not: the result arrives through the watcher.
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
    // A refusal is transient and the user can tap again. The section only shows
    // when `wifiPairingSupported` is true, so it is not a permanent state.
  }
  // Backstop: `devicesChanged` is the normal path but is dropped when no bridge
  // is attached, and a modal is when that is most likely.
  await active?.refresh();
}

// Narrowed to the five the launcher paints with, so the bridge payload cannot
// become a second copy of the palette.
function palette(colors: ThemeColors): PairingColors {
  return {
    bg: colors.bg,
    surface: colors.surface,
    border: colors.border,
    textPrimary: colors.textPrimary,
    textMuted: colors.textMuted,
  };
}

// Watched for the life of the mesh. Constructed with a callback, so this file
// has no opinion about who is listening.
export class WiFiPairingWatcher {
  constructor(private readonly onCount: (count: number) => void) {}

  private sub: EmitterSubscription | null = null;
  private started = false;

  start(): void {
    if (this.started || !hasWiFiPairing()) return;
    this.started = true;
    active = this;
    // Before the first read, so a pairing made during it is not lost.
    this.sub = DeviceEventEmitter.addListener(
      "AirhopWiFiPairing.devicesChanged",
      ({ count }: { count: number }) => {
        // `supported` cannot change within a process, so carry it forward.
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

  // How the first answer arrives and a missed event is recovered. Not a poll:
  // the subscription above catches an unpairing done in Settings.
  async refresh(): Promise<void> {
    if (!hasWiFiPairing()) return;
    try {
      const state = await NativeAirhopWiFiPairing?.getPairingState();
      if (state !== undefined) this.apply(state);
    } catch {
      // Keep the last answer: reporting zero would tear down a working transport.
    }
  }

  private apply(state: PairingState): void {
    useMeshStateStore.getState().setWifiPairing(state.supported, state.count);
    // Only arm the gate where the framework exists. Reporting zero elsewhere
    // would say "nothing paired" where the answer is "not supported", which no
    // pairing could fix. Left unarmed, the transport asks native and latches.
    if (state.supported) this.onCount(state.count);
  }
}
