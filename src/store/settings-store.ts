// App preferences: theme, media auto-download, and upload quality.
// MMKV-persisted so choices survive app restarts. Reset to defaults by the
// panic wipe (via reset()), so a wipe leaves a true first-run state with no
// trace of the previous user's choices.

import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark" | "system";
export type UploadQuality = "low" | "medium" | "high";
// The typeface for the app's monospace text (keys, IDs, geohashes, amounts):
// the device's built-in monospace, or a bundled coding font.
export type MonoFont = "system" | "firacode" | "jetbrains";

// expo-image-picker's `quality` option (0-1 JPEG compression factor).
export const UPLOAD_QUALITY_VALUES: Record<UploadQuality, number> = {
  low: 0.4,
  medium: 0.65,
  high: 0.85,
};

interface SettingsState {
  theme: ThemePreference;
  autoDownloadMedia: boolean;
  uploadQuality: UploadQuality;
  // Whether this device acts as an internet gateway: relaying mesh-only peers'
  // geohash events to Nostr (toGateway carriers) and, in future, rebroadcasting
  // relay traffic to the mesh. Off by default, matching bitchat; enabling it
  // spends this device's battery and data on behalf of nearby offline peers.
  gatewayEnabled: boolean;
  // Whether Nostr traffic is routed through Tor. On iOS this drives the in-app
  // Arti SOCKS proxy; on Android it records that the user relies on Orbot's VPN.
  // Persisted so the choice is applied before the first relay connects at
  // startup (see tor-routing.ts), never leaking the clear net for a Tor user.
  torEnabled: boolean;
  // Whether Cashu mint HTTP calls may go out over the clear net while Tor is
  // on. Tor only covers Nostr WebSockets on iOS (Arti is a per-socket SOCKS
  // shim, and mint calls are plain fetch), so with Tor enabled a mint request
  // would reveal this device's IP to the mint and link it to the proofs being
  // swapped. Off by default: mint calls are refused instead, and the wallet
  // stays fully usable offline. Android is unaffected, since Orbot's VPN routes
  // every socket, so this flag is only consulted on iOS.
  allowMintOverClearnet: boolean;
  // Monospace typeface for keys/IDs/geohashes/amounts. Live: changing it
  // recomputes styles immediately via useThemeColors (see ui/theme.ts).
  monoFont: MonoFont;
  setTheme: (theme: ThemePreference) => void;
  setAutoDownloadMedia: (enabled: boolean) => void;
  setUploadQuality: (quality: UploadQuality) => void;
  setGatewayEnabled: (enabled: boolean) => void;
  setTorEnabled: (enabled: boolean) => void;
  setAllowMintOverClearnet: (allowed: boolean) => void;
  setMonoFont: (font: MonoFont) => void;
  // Restore first-run defaults. Used by the panic wipe.
  reset: () => void;
}

const DEFAULTS = {
  // Follow the OS appearance by default so a new user gets whichever of light or
  // dark their phone is already set to, rather than being forced into dark.
  theme: "system",
  autoDownloadMedia: true,
  uploadQuality: "high",
  gatewayEnabled: false,
  torEnabled: false,
  allowMintOverClearnet: false,
  // The device's own monospace by default, so a new install looks native and
  // familiar. JetBrains Mono is offered as an opt-in choice under Appearance.
  monoFont: "system",
} satisfies Partial<SettingsState>;

const storage = createMMKV({ id: "settings-store" });

const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      setTheme(theme) {
        set({ theme });
      },
      setAutoDownloadMedia(enabled) {
        set({ autoDownloadMedia: enabled });
      },
      setUploadQuality(quality) {
        set({ uploadQuality: quality });
      },
      setGatewayEnabled(enabled) {
        set({ gatewayEnabled: enabled });
      },
      setTorEnabled(enabled) {
        set({ torEnabled: enabled });
      },
      setAllowMintOverClearnet(allowed) {
        set({ allowMintOverClearnet: allowed });
      },
      setMonoFont(font) {
        set({ monoFont: font });
      },
      reset() {
        set({ ...DEFAULTS });
      },
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
