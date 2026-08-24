// App preferences: theme, media auto-download, and upload quality.
// MMKV-persisted so choices survive app restarts. Reset to defaults by the
// panic wipe (via reset()), so a wipe leaves a true first-run state with no
// trace of the previous user's choices.

import { MAX_CUSTOM_RELAYS, validateRelayUrl } from "@core/nostr/geo-relay";
import type { BitcoinUnit } from "@core/payments/cashu";
import type { LanguageCode, LanguagePreference } from "@i18n";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getStorage } from "./mmkv";

// "system" is the unset state, not a listed choice: until you pick a side the
// app is whichever the phone is, and follows it when the phone changes. The
// Appearance picker offers only light and dark, and ticks the resolved one, so
// there is never a row that means "no, really, the other one".
export type ThemePreference = "light" | "dark" | "system";
export type UploadQuality = "low" | "medium" | "high";
// The typeface for the app's monospace text (keys, IDs, geohashes, amounts):
// the device's built-in monospace, or a bundled coding font.
export type MonoFont = "system" | "jetbrains";

// expo-image-picker's `quality` option (0-1 JPEG compression factor).
export const UPLOAD_QUALITY_VALUES: Record<UploadQuality, number> = {
  low: 0.4,
  medium: 0.65,
  high: 0.85,
};

// How long an attachment stays on disk before the launch sweep removes it.
//
// A choice rather than a constant because the ends of the range are different
// situations the app cannot tell apart. A week suits a phone carried through a
// protest, where an old photo on a seized device is the risk. A month suits the
// mesh as an everyday messenger somewhere with no reliable signal, where losing
// a picture is the risk.
//
// No "keep forever": the threat model says an attachment must not outlive its
// conversation, and an unbounded option would retire that promise for whoever
// picked it.
export const MEDIA_RETENTION_DAY_OPTIONS = [7, 14, 30] as const;
export type MediaRetentionDays = (typeof MEDIA_RETENTION_DAY_OPTIONS)[number];

interface SettingsState {
  theme: ThemePreference;
  // The language the app is read in.
  //
  // "system" is the unset state rather than a listed choice, the same shape as
  // `theme` above: until you pick one, Airhop is whichever language the phone
  // is, falling back to English when the phone's language is one Airhop does
  // not ship. Picking explicitly pins it, so a user reading Airhop in Spanish
  // on an English phone keeps Spanish.
  //
  // Stored as a preference, not as the language being rendered. The two differ
  // for exactly one case: Arabic, Persian and Urdu read right to left, and
  // React Native fixes layout direction when the process starts, so choosing
  // one of those takes effect on the next launch. See the direction note in
  // `@i18n`.
  language: LanguagePreference;
  // The language the native layout flag is currently set for.
  //
  // Not a preference and never shown: Airhop's record of a value living outside
  // its stores, in NSUserDefaults and SharedPreferences. At boot
  // `I18nManager.isRTL` gives the frame's direction and this names the language
  // it was built for, which a bare direction cannot: three shipped languages are
  // right to left.
  //
  // Written by `applyLayoutDirection`, read once by `initI18n`, and survives
  // `reset()` because the native flag survives a panic wipe.
  frameLanguage: LanguageCode | null;
  autoDownloadMedia: boolean;
  // Whether holding the mic streams live to everyone in Bluetooth range
  // (walkie-talkie) or just records a voice note to send on release. On by
  // default, matching bitchat's PTTSettings. Turning it off makes voice behave
  // exactly as it did before live voice existed, in both directions: no live
  // sending, and incoming bursts are ignored rather than played.
  liveVoiceEnabled: boolean;
  // Whether the mesh keeps running once the app is closed.
  //
  // On by default: a mesh that stops when you look away is not a mesh. Off
  // trades that for a phone with no persistent notification and no radio work
  // in the background, and the cost is stated plainly on the row - messages
  // stop arriving until Airhop is opened again.
  //
  // Distinct from Away, which stops the mesh even in the foreground. The middle
  // state: run while I am using it, stop when I am not.
  backgroundMeshEnabled: boolean;
  // Whether a system notification withholds the sender and the message body.
  //
  // ON by default, which is the deliberate part. The lock screen is rendered by
  // the OS without unlocking the phone, so a full preview narrates DMs to
  // anyone who can see the screen: someone standing behind you, or a phone left
  // face-up on a table. For the situations this app is built for the realistic
  // compromise is a device taken and looked at, not traffic intercepted, and a
  // notification is the one place plaintext leaves the app by design.
  //
  // Turning it off restores the sender and preview for anyone who would rather
  // have them. Either way the routing payload is unaffected, so tapping a
  // notification still opens the right thread.
  hideNotificationPreviews: boolean;
  uploadQuality: UploadQuality;
  // How many days an attachment survives on disk. Seven by default, matching
  // bitchat's sweep; see MEDIA_RETENTION_DAY_OPTIONS for why it is a choice.
  mediaRetentionDays: MediaRetentionDays;
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
  // Whether the app auto-selects the nearest relays for a cell from its vendored
  // directory. On by default; off uses only the custom relays.
  //
  // RELAY_SOURCE_INVARIANT: never off with an empty customRelays. Held by
  // setGeoRelayDiscovery, removeCustomRelay and the merge hook, because "off
  // with nothing pinned" leaves the switch claiming the app does not
  // auto-select relays while mergeGeoRelays falls back to doing exactly that.
  geoRelayDiscovery: boolean;
  // User-added relay URLs (wss://...), always tried for location channels in
  // addition to discovery, and the sole source when discovery is off. Capped at
  // MAX_CUSTOM_RELAYS: each one is a socket held open on top of the cell's
  // discovered set, and NostrClient's per-call ceiling is sized to fit both.
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
  setLanguage: (language: LanguagePreference) => void;
  setFrameLanguage: (code: LanguageCode) => void;
  setAutoDownloadMedia: (enabled: boolean) => void;
  setLiveVoiceEnabled: (enabled: boolean) => void;
  setBackgroundMeshEnabled: (enabled: boolean) => void;
  setHideNotificationPreviews: (hide: boolean) => void;
  setUploadQuality: (quality: UploadQuality) => void;
  setMediaRetentionDays: (days: MediaRetentionDays) => void;
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
  language: "system",
  // Unknown until the first `applyLayoutDirection`. A fresh install has never
  // called `forceRTL`, so its frame is left to right regardless.
  frameLanguage: null as LanguageCode | null,
  autoDownloadMedia: true,
  liveVoiceEnabled: true,
  backgroundMeshEnabled: true,
  // Private by default; see the field comment above for why.
  hideNotificationPreviews: true,
  uploadQuality: "high",
  mediaRetentionDays: 7,
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

const storage = getStorage("settings-store");

const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,

      setTheme(theme) {
        set({ theme });
      },
      setLanguage(language) {
        set({ language });
      },
      setFrameLanguage(code) {
        set({ frameLanguage: code });
      },
      setAutoDownloadMedia(enabled) {
        set({ autoDownloadMedia: enabled });
      },
      setBackgroundMeshEnabled(enabled) {
        set({ backgroundMeshEnabled: enabled });
      },
      setLiveVoiceEnabled(enabled) {
        set({ liveVoiceEnabled: enabled });
      },
      setHideNotificationPreviews(hide) {
        set({ hideNotificationPreviews: hide });
      },
      setUploadQuality(quality) {
        set({ uploadQuality: quality });
      },
      setMediaRetentionDays(days) {
        set({ mediaRetentionDays: days });
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
        // Refused where it would break RELAY_SOURCE_INVARIANT. The screen blocks
        // this with an explanation; here it is the backstop for every other
        // writer.
        set((s) =>
          !enabled && s.customRelays.length === 0
            ? s
            : { geoRelayDiscovery: enabled },
        );
      },
      addCustomRelay(url) {
        // The screen validates first, for feedback. This is the backstop: a
        // relay that never met validateRelayUrl must not reach a socket.
        const normalized = validateRelayUrl(url);
        if (normalized === null) return;
        set((s) =>
          s.customRelays.includes(normalized) ||
          s.customRelays.length >= MAX_CUSTOM_RELAYS
            ? s
            : { customRelays: [...s.customRelays, normalized] },
        );
      },
      removeCustomRelay(url) {
        // Normalized as the add was, so a relay can be removed as it was typed.
        const normalized = validateRelayUrl(url) ?? url;
        set((s) => {
          // Replaced only when something actually left: the transport watches
          // this array by reference, and filter() returns a fresh one either
          // way, so a removal that removed nothing would rebuild every live cell.
          if (!s.customRelays.includes(normalized)) return s;
          const customRelays = s.customRelays.filter((r) => r !== normalized);
          return customRelays.length === 0
            ? { customRelays, geoRelayDiscovery: true }
            : { customRelays };
        });
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
        // `frameLanguage` is carried through, not defaulted: it describes a
        // native flag a wipe cannot clear, so losing the record would leave the
        // next launch unable to name the direction it woke up in.
        set({ ...DEFAULTS, frameLanguage: get().frameLanguage });
      },
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => mmkvStorage),
      version: 1,
      // Re-validate the custom relays coming off disk. MMKV is plain storage,
      // and unlike every other persisted field these are hostnames rehydration
      // hands to a socket, so one written by a looser build (or edited on disk)
      // would arrive having never met validateRelayUrl. Sanitizing can empty the
      // list, the one path that could rehydrate past RELAY_SOURCE_INVARIANT.
      merge: (persisted, current) => {
        const state = (persisted ?? {}) as Partial<SettingsState>;
        const seen = new Set<string>();
        const customRelays: string[] = [];
        for (const raw of state.customRelays ?? []) {
          const url = typeof raw === "string" ? validateRelayUrl(raw) : null;
          if (url === null || seen.has(url)) continue;
          seen.add(url);
          customRelays.push(url);
        }
        const merged = {
          ...current,
          ...state,
          customRelays: customRelays.slice(0, MAX_CUSTOM_RELAYS),
        };
        if (merged.customRelays.length === 0) merged.geoRelayDiscovery = true;
        return merged;
      },
      // v1 dropped Fira Code. A persisted "firacode" would miss the MONO_FONTS
      // table entirely, and FontFamily.mono reads that table on every style
      // build, so the stale value has to be retired on load rather than guarded
      // against at each read.
      migrate: (persisted, version) => {
        const state = persisted as Partial<SettingsState> | undefined;
        if (state && version < 1 && (state.monoFont as string) === "firacode") {
          return { ...state, monoFont: "system" } as SettingsState;
        }
        return persisted as SettingsState;
      },
    },
  ),
);
