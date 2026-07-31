// App preferences: theme, media auto-download, and upload quality.
// MMKV-persisted so choices survive app restarts. Reset to defaults by the
// panic wipe (via reset()), so a wipe leaves a true first-run state with no
// trace of the previous user's choices.

import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { validateRelayUrl } from "../core/nostr/geo-relay";
import type { BitcoinUnit } from "../core/payments/cashu";

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
  // Whether holding the mic streams live to everyone in Bluetooth range
  // (walkie-talkie) or just records a voice note to send on release. On by
  // default, matching bitchat's PTTSettings. Turning it off makes voice behave
  // exactly as it did before live voice existed, in both directions: no live
  // sending, and incoming bursts are ignored rather than played.
  liveVoiceEnabled: boolean;
  uploadQuality: UploadQuality;
  // Whether this device acts as an internet gateway: relaying mesh-only peers'
  // geohash events to Nostr (toGateway carriers) and, in future, rebroadcasting
  // relay traffic to the mesh. Off by default, matching bitchat; enabling it
  // spends this device's battery and data on behalf of nearby offline peers.
  gatewayEnabled: boolean;
  // Whether this device bridges its public #bluetooth mesh chat to a geohash-cell
  // rendezvous on Nostr, stitching separate mesh islands together over the
  // internet. Off by default: enabling it publishes your public messages (signed
  // by an unlinkable per-cell key) so an out-of-range island can see them. A
  // per-message "nearby only" control keeps any single message radio-only.
  bridgeEnabled: boolean;
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
  // Master switch for all internet (Nostr) connectivity: DM/channel fallback,
  // location channels, courier drops, the gateway, and the mesh bridge. On by
  // default. Off makes Airhop pure Bluetooth: no relay is contacted at all, and
  // the internet-dependent features are inert (and shown disabled).
  internetEnabled: boolean;
  // Whether the app auto-selects the nearest relays for a location cell from its
  // vendored directory. On by default. Off uses only the custom relays below (a
  // power-user choice); with neither, location channels have no relays.
  geoRelayDiscovery: boolean;
  // User-added relay URLs (wss://...), always tried for location channels in
  // addition to discovery, and the sole source when discovery is off.
  customRelays: string[];
  // Whether balances read in satoshis or in bitcoin. A display choice only:
  // one bitcoin is exactly 100,000,000 satoshis, so this is a rename rather
  // than a conversion, needs no price feed, and works offline.
  bitcoinUnit: BitcoinUnit;
  // Monospace typeface for keys/IDs/geohashes/amounts. Live: changing it
  // recomputes styles immediately via useThemeColors (see ui/theme.ts).
  monoFont: MonoFont;
  // How long (seconds) a sent message is held with an "undo" pill before it
  // transmits. 0 means no hold: messages send immediately. Default 2.
  undoSendSeconds: number;
  // Whether the one-time screen explaining WHY a chat app needs Bluetooth and
  // Location has been shown. Not a preference, but it belongs here because it
  // has to survive relaunch and be cleared by the panic wipe: after a wipe the
  // app is a first-run install again, and the next person deserves the same
  // explanation before the OS asks them for anything.
  permissionPrimerSeen: boolean;
  // Whether the user has dealt with (or dismissed) the note about aggressive
  // OEM background limits. One-time advice, not a setting, and never shown again
  // once acknowledged - the alternative is a banner that nags forever, because
  // there is no reliable way to detect an OEM autostart whitelist.
  backgroundLimitsAcknowledged: boolean;
  setTheme: (theme: ThemePreference) => void;
  setAutoDownloadMedia: (enabled: boolean) => void;
  setLiveVoiceEnabled: (enabled: boolean) => void;
  setUploadQuality: (quality: UploadQuality) => void;
  setGatewayEnabled: (enabled: boolean) => void;
  setBridgeEnabled: (enabled: boolean) => void;
  setInternetEnabled: (enabled: boolean) => void;
  setGeoRelayDiscovery: (enabled: boolean) => void;
  addCustomRelay: (url: string) => void;
  removeCustomRelay: (url: string) => void;
  setTorEnabled: (enabled: boolean) => void;
  setBitcoinUnit: (unit: BitcoinUnit) => void;
  setAllowMintOverClearnet: (allowed: boolean) => void;
  setMonoFont: (font: MonoFont) => void;
  setUndoSendSeconds: (seconds: number) => void;
  markPermissionPrimerSeen: () => void;
  markBackgroundLimitsAcknowledged: () => void;
  // Restore first-run defaults. Used by the panic wipe.
  reset: () => void;
}

const DEFAULTS = {
  // Follow the OS appearance by default so a new user gets whichever of light or
  // dark their phone is already set to, rather than being forced into dark.
  theme: "system",
  autoDownloadMedia: true,
  liveVoiceEnabled: true,
  uploadQuality: "high",
  gatewayEnabled: false,
  bridgeEnabled: false,
  internetEnabled: true,
  geoRelayDiscovery: true,
  customRelays: [] as string[],
  torEnabled: false,
  allowMintOverClearnet: false,
  // Sats by default: it is the unit people actually quote amounts in, and it
  // avoids showing a new user a balance that reads 0.00000000.
  bitcoinUnit: "sat",
  // The device's own monospace by default, so a new install looks native and
  // familiar. JetBrains Mono is offered as an opt-in choice under Appearance.
  monoFont: "system",
  undoSendSeconds: 2,
  permissionPrimerSeen: false,
  backgroundLimitsAcknowledged: false,
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
      setLiveVoiceEnabled(enabled) {
        set({ liveVoiceEnabled: enabled });
      },
      setUploadQuality(quality) {
        set({ uploadQuality: quality });
      },
      setGatewayEnabled(enabled) {
        set({ gatewayEnabled: enabled });
      },
      setBridgeEnabled(enabled) {
        set({ bridgeEnabled: enabled });
      },
      setInternetEnabled(enabled) {
        set({ internetEnabled: enabled });
      },
      setGeoRelayDiscovery(enabled) {
        set({ geoRelayDiscovery: enabled });
      },
      addCustomRelay(url) {
        // Validate + normalize to wss://host[:port] and de-duplicate. Invalid or
        // unsupported entries (bad host, IP, loopback, credentials, etc.) are
        // rejected, matching bitchat's relay bar. The UI validates first for
        // feedback; this is the defensive backstop.
        const normalized = validateRelayUrl(url);
        if (normalized === null) return;
        set((s) =>
          s.customRelays.includes(normalized)
            ? s
            : { customRelays: [...s.customRelays, normalized] },
        );
      },
      removeCustomRelay(url) {
        set((s) => ({
          customRelays: s.customRelays.filter((r) => r !== url),
        }));
      },
      setTorEnabled(enabled) {
        set({ torEnabled: enabled });
      },
      setBitcoinUnit(unit) {
        set({ bitcoinUnit: unit });
      },
      setAllowMintOverClearnet(allowed) {
        set({ allowMintOverClearnet: allowed });
      },
      setUndoSendSeconds(seconds) {
        set({ undoSendSeconds: seconds });
      },
      setMonoFont(font) {
        set({ monoFont: font });
      },
      markPermissionPrimerSeen() {
        set({ permissionPrimerSeen: true });
      },
      markBackgroundLimitsAcknowledged() {
        set({ backgroundLimitsAcknowledged: true });
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
