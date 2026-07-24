// App preferences: theme, media auto-download, and upload quality.
// MMKV-persisted so choices survive app restarts. Reset to defaults by the
// panic wipe (via reset()), so a wipe leaves a true first-run state with no
// trace of the previous user's choices.

import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark" | "system";
export type UploadQuality = "low" | "medium" | "high";

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
  // Whether the Payments feature is switched on. Off hides the Wallet tab
  // from the tab bar; it does not touch the wallet's stored proofs, so
  // turning it back on restores the balance untouched.
  paymentsEnabled: boolean;
  // Whether this device acts as an internet gateway: relaying mesh-only peers'
  // geohash events to Nostr (toGateway carriers) and, in future, rebroadcasting
  // relay traffic to the mesh. Off by default, matching bitchat; enabling it
  // spends this device's battery and data on behalf of nearby offline peers.
  gatewayEnabled: boolean;
  setTheme: (theme: ThemePreference) => void;
  setAutoDownloadMedia: (enabled: boolean) => void;
  setUploadQuality: (quality: UploadQuality) => void;
  setPaymentsEnabled: (enabled: boolean) => void;
  setGatewayEnabled: (enabled: boolean) => void;
  // Restore first-run defaults. Used by the panic wipe.
  reset: () => void;
}

const DEFAULTS = {
  // Follow the OS appearance by default so a new user gets whichever of light or
  // dark their phone is already set to, rather than being forced into dark.
  theme: "system",
  autoDownloadMedia: true,
  uploadQuality: "high",
  paymentsEnabled: true,
  gatewayEnabled: false,
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
      setPaymentsEnabled(enabled) {
        set({ paymentsEnabled: enabled });
      },
      setGatewayEnabled(enabled) {
        set({ gatewayEnabled: enabled });
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
