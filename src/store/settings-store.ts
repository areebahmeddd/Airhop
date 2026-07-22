// App preferences: theme, media auto-download, and upload quality.
// MMKV-persisted so choices survive app restarts. Deliberately kept out of
// panic-wipe's MMKV_STORE_IDS: these are device preferences, not identity
// or message data, and should survive a wipe.

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
  setTheme: (theme: ThemePreference) => void;
  setAutoDownloadMedia: (enabled: boolean) => void;
  setUploadQuality: (quality: UploadQuality) => void;
  setPaymentsEnabled: (enabled: boolean) => void;
}

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
      theme: "dark",
      autoDownloadMedia: true,
      uploadQuality: "high",
      paymentsEnabled: true,

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
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
