// What settings search searches, and how it ranks.
//
// Hand-written, since the screens render their rows in JSX.
// `settings-index.test.ts` keeps it in sync with them.
//
// Indexed: every row the shared row primitives render unconditionally. Not
// indexed: state-dependent rows, live diagnostics readouts, "Coming soon" rows,
// and the relay lists (raw Pressables, so they cannot carry a highlight).

import Feather from "@expo/vector-icons/Feather";
import { getLanguage, type TranslationKey, type Translator } from "@i18n";
import { scoreMatch, searchKey } from "@utils/search-text";
import { Platform } from "react-native";

// Which sub-screen the hub is showing. Here rather than in profile-screen so
// the index can name a destination without importing the screen.
export type SettingsView =
  | "root"
  | "search"
  | "general"
  | "security"
  | "network"
  | "tor"
  | "permissions"
  | "storage"
  | "diagnostics"
  | "help"
  | "terms"
  | "privacy"
  | "support"
  | "about"
  | "version"
  | "licenses";

// Settings that live in a sheet rather than on a screen.
export type SettingsSheet = "appearance" | "status";

// Every id a row can be asked to highlight. Written out rather than derived,
// because the index below is typed against it.
export type SettingId =
  | "background"
  | "live-voice"
  | "mesh-bridge"
  | "gateway"
  | "transfer"
  | "wipe"
  | "undo"
  | "media-quality"
  | "media-retention"
  | "show-media"
  | "reset"
  | "forward-secrecy"
  | "signed-packets"
  | "hide-previews"
  | "internet"
  | "relay-discovery"
  | "bitchat"
  | "lan"
  | "network-usage"
  | "storage-usage"
  | "cache"
  | "perm-bluetooth"
  | "perm-location"
  | "perm-notifications"
  | "perm-camera"
  | "perm-photos"
  | "perm-microphone"
  | "help-contact"
  | "help-bug"
  | "help-faq"
  | "support-card"
  | "support-sponsors"
  | "release-notes"
  | "source";

// Where tapping a result goes.
export type SettingsTarget =
  // A whole screen. Nothing to point at: all of it is the answer.
  | { kind: "screen"; view: SettingsView }
  // One row on a screen. Open it, then scroll to the row and light it.
  | { kind: "row"; view: SettingsView; id: SettingId }
  // A row in a sheet. Sheets belong to the hub, so this returns there first.
  | { kind: "sheet"; sheet: SettingsSheet };

export interface SettingsEntry {
  key: string;
  labelKey: TranslationKey;
  // Matched as well as shown: a row is findable by what it does, not only by
  // what it is called.
  descriptionKey?: TranslationKey;
  // Where the row lives. Shown under the label on a result.
  sectionKey: TranslationKey;
  icon: keyof typeof Feather.glyphMap;
  target: SettingsTarget;
  // Set only for a row one platform does not render.
  platform?: "android" | "ios";
}

// The hub's own name, worn by the rows that live on it.
const HUB: TranslationKey = "nav.tab.profile";

export const SETTINGS_INDEX = [
  // ---- The hub itself ----
  {
    key: "status",
    labelKey: "settings.status.title",
    descriptionKey: "settings.status.desc",
    sectionKey: HUB,
    icon: "wifi",
    target: { kind: "sheet", sheet: "status" },
  },
  {
    key: "background",
    labelKey: "settings.conn.background",
    descriptionKey: "settings.conn.background_desc",
    sectionKey: HUB,
    icon: "power",
    target: { kind: "row", view: "root", id: "background" },
    platform: "android",
  },
  {
    key: "live-voice",
    labelKey: "settings.conn.live_voice",
    descriptionKey: "settings.conn.live_voice_desc",
    sectionKey: HUB,
    icon: "mic",
    target: { kind: "row", view: "root", id: "live-voice" },
  },
  {
    key: "mesh-bridge",
    labelKey: "settings.conn.bridge",
    descriptionKey: "settings.conn.bridge_desc",
    sectionKey: HUB,
    icon: "git-merge",
    target: { kind: "row", view: "root", id: "mesh-bridge" },
  },
  {
    key: "gateway",
    labelKey: "settings.conn.gateway",
    descriptionKey: "settings.conn.gateway_desc",
    sectionKey: HUB,
    icon: "cast",
    target: { kind: "row", view: "root", id: "gateway" },
  },
  {
    key: "tor",
    labelKey: "settings.conn.tor",
    descriptionKey: "settings.conn.tor_desc",
    sectionKey: HUB,
    icon: "globe",
    target: { kind: "screen", view: "tor" },
  },
  {
    key: "transfer",
    labelKey: "settings.transfer.title",
    descriptionKey: "settings.transfer.desc",
    sectionKey: HUB,
    icon: "smartphone",
    target: { kind: "row", view: "root", id: "transfer" },
  },
  {
    key: "wipe",
    labelKey: "settings.wipe.title",
    descriptionKey: "settings.wipe.desc",
    sectionKey: HUB,
    icon: "alert-triangle",
    target: { kind: "row", view: "root", id: "wipe" },
  },

  // ---- The hub's nav rows ----
  {
    key: "section-general",
    labelKey: "settings.section.general",
    descriptionKey: "settings.section.general_desc",
    sectionKey: HUB,
    icon: "settings",
    target: { kind: "screen", view: "general" },
  },
  {
    key: "section-security",
    labelKey: "settings.section.privacy",
    descriptionKey: "settings.section.privacy_desc",
    sectionKey: HUB,
    icon: "lock",
    target: { kind: "screen", view: "security" },
  },
  {
    key: "section-network",
    labelKey: "settings.section.network",
    descriptionKey: "settings.section.network_desc",
    sectionKey: HUB,
    icon: "radio",
    target: { kind: "screen", view: "network" },
  },
  {
    key: "section-storage",
    labelKey: "settings.section.storage",
    descriptionKey: "settings.section.storage_desc",
    sectionKey: HUB,
    icon: "hard-drive",
    target: { kind: "screen", view: "storage" },
  },
  {
    key: "section-permissions",
    labelKey: "settings.section.permissions",
    descriptionKey: "settings.section.permissions_desc",
    sectionKey: HUB,
    icon: "key",
    target: { kind: "screen", view: "permissions" },
  },
  {
    key: "section-diagnostics",
    labelKey: "settings.section.diagnostics",
    descriptionKey: "settings.section.diagnostics_desc",
    sectionKey: HUB,
    icon: "activity",
    target: { kind: "screen", view: "diagnostics" },
  },
  {
    key: "section-appearance",
    labelKey: "settings.section.appearance",
    descriptionKey: "settings.section.appearance_desc",
    sectionKey: HUB,
    icon: "sliders",
    target: { kind: "sheet", sheet: "appearance" },
  },
  {
    key: "section-help",
    labelKey: "settings.section.help",
    descriptionKey: "settings.section.help_desc",
    sectionKey: HUB,
    icon: "help-circle",
    target: { kind: "screen", view: "help" },
  },
  {
    key: "section-support",
    labelKey: "settings.section.support",
    descriptionKey: "settings.section.support_desc",
    sectionKey: HUB,
    icon: "heart",
    target: { kind: "screen", view: "support" },
  },
  {
    key: "section-about",
    labelKey: "settings.section.about",
    descriptionKey: "settings.section.about_desc",
    sectionKey: HUB,
    icon: "info",
    target: { kind: "screen", view: "about" },
  },

  // ---- Appearance (a sheet) ----
  {
    key: "theme",
    labelKey: "settings.group.theme",
    sectionKey: "settings.section.appearance",
    icon: "sun",
    target: { kind: "sheet", sheet: "appearance" },
  },
  {
    key: "font",
    labelKey: "settings.group.font",
    sectionKey: "settings.section.appearance",
    icon: "type",
    target: { kind: "sheet", sheet: "appearance" },
  },
  {
    key: "language",
    labelKey: "settings.group.language",
    sectionKey: "settings.section.appearance",
    icon: "globe",
    target: { kind: "sheet", sheet: "appearance" },
  },

  // ---- General ----
  {
    key: "undo",
    labelKey: "settings.general.undo",
    descriptionKey: "settings.general.undo_desc",
    sectionKey: "settings.section.general",
    icon: "rotate-ccw",
    target: { kind: "row", view: "general", id: "undo" },
  },
  {
    key: "media-quality",
    labelKey: "settings.general.quality",
    sectionKey: "settings.section.general",
    icon: "image",
    target: { kind: "row", view: "general", id: "media-quality" },
  },
  {
    key: "media-retention",
    labelKey: "settings.general.media_retention",
    descriptionKey: "settings.general.media_retention_desc",
    sectionKey: "settings.section.general",
    icon: "clock",
    target: { kind: "row", view: "general", id: "media-retention" },
  },
  {
    key: "show-media",
    labelKey: "settings.general.show_media",
    descriptionKey: "settings.general.show_media_desc",
    sectionKey: "settings.section.general",
    icon: "eye",
    target: { kind: "row", view: "general", id: "show-media" },
  },
  {
    key: "reset",
    labelKey: "settings.general.reset",
    descriptionKey: "settings.general.reset_desc",
    sectionKey: "settings.section.general",
    icon: "refresh-ccw",
    target: { kind: "row", view: "general", id: "reset" },
  },

  // ---- Privacy & security ----
  {
    key: "forward-secrecy",
    labelKey: "settings.security.forward_secrecy",
    descriptionKey: "settings.security.forward_secrecy_desc",
    sectionKey: "settings.section.privacy",
    icon: "repeat",
    target: { kind: "row", view: "security", id: "forward-secrecy" },
  },
  {
    key: "signed-packets",
    labelKey: "settings.security.signed_packets",
    descriptionKey: "settings.security.signed_packets_desc",
    sectionKey: "settings.section.privacy",
    icon: "check-circle",
    target: { kind: "row", view: "security", id: "signed-packets" },
  },
  {
    key: "hide-previews",
    labelKey: "settings.security.hide_previews",
    descriptionKey: "settings.security.hide_previews_desc",
    sectionKey: "settings.section.privacy",
    icon: "eye-off",
    target: { kind: "row", view: "security", id: "hide-previews" },
  },

  // ---- Network & relays ----
  {
    key: "internet",
    labelKey: "settings.network.internet",
    descriptionKey: "settings.network.internet_desc",
    sectionKey: "settings.section.network",
    icon: "cloud",
    target: { kind: "row", view: "network", id: "internet" },
  },
  {
    key: "relay-discovery",
    labelKey: "settings.network.discovery",
    descriptionKey: "settings.network.discovery_desc",
    sectionKey: "settings.section.network",
    icon: "map-pin",
    target: { kind: "row", view: "network", id: "relay-discovery" },
  },
  {
    key: "bitchat",
    labelKey: "settings.network.bitchat",
    descriptionKey: "settings.network.bitchat_desc",
    sectionKey: "settings.section.network",
    icon: "bluetooth",
    target: { kind: "row", view: "network", id: "bitchat" },
  },
  {
    key: "lan",
    labelKey: "settings.network.lan",
    descriptionKey: "settings.network.lan_desc",
    sectionKey: "settings.section.network",
    icon: "wifi",
    target: { kind: "row", view: "network", id: "lan" },
  },

  // ---- Storage & data ----
  {
    key: "network-usage",
    labelKey: "settings.storage.network_usage",
    sectionKey: "settings.section.storage",
    icon: "activity",
    target: { kind: "row", view: "storage", id: "network-usage" },
  },
  {
    key: "storage-usage",
    labelKey: "settings.storage.storage_usage",
    descriptionKey: "settings.storage.storage_usage_desc",
    sectionKey: "settings.section.storage",
    icon: "hard-drive",
    target: { kind: "row", view: "storage", id: "storage-usage" },
  },
  {
    key: "cache",
    labelKey: "settings.storage.cache",
    sectionKey: "settings.section.storage",
    icon: "trash-2",
    target: { kind: "row", view: "storage", id: "cache" },
  },

  // ---- Permissions ----
  {
    key: "perm-bluetooth",
    labelKey: "settings.permissions.bluetooth",
    descriptionKey: "settings.permissions.bluetooth_desc",
    sectionKey: "settings.section.permissions",
    icon: "bluetooth",
    target: { kind: "row", view: "permissions", id: "perm-bluetooth" },
  },
  {
    key: "perm-location",
    labelKey: "settings.permissions.location",
    descriptionKey: "settings.permissions.location_desc",
    sectionKey: "settings.section.permissions",
    icon: "map-pin",
    target: { kind: "row", view: "permissions", id: "perm-location" },
  },
  {
    key: "perm-notifications",
    labelKey: "settings.permissions.notifications",
    descriptionKey: "settings.permissions.notifications_desc",
    sectionKey: "settings.section.permissions",
    icon: "bell",
    target: { kind: "row", view: "permissions", id: "perm-notifications" },
  },
  {
    key: "perm-camera",
    labelKey: "settings.permissions.camera",
    descriptionKey: "settings.permissions.camera_desc",
    sectionKey: "settings.section.permissions",
    icon: "camera",
    target: { kind: "row", view: "permissions", id: "perm-camera" },
  },
  {
    key: "perm-photos",
    labelKey: "settings.permissions.photos",
    descriptionKey: "settings.permissions.photos_desc",
    sectionKey: "settings.section.permissions",
    icon: "image",
    target: { kind: "row", view: "permissions", id: "perm-photos" },
  },
  {
    key: "perm-microphone",
    labelKey: "settings.permissions.microphone",
    descriptionKey: "settings.permissions.microphone_desc",
    sectionKey: "settings.section.permissions",
    icon: "mic",
    target: { kind: "row", view: "permissions", id: "perm-microphone" },
  },

  // ---- Help & feedback ----
  {
    key: "help-contact",
    labelKey: "settings.help.contact",
    sectionKey: "settings.section.help",
    icon: "life-buoy",
    target: { kind: "row", view: "help", id: "help-contact" },
  },
  {
    key: "help-bug",
    labelKey: "settings.help.bug",
    descriptionKey: "settings.help.bug_desc",
    sectionKey: "settings.section.help",
    icon: "alert-circle",
    target: { kind: "row", view: "help", id: "help-bug" },
  },
  {
    key: "help-faq",
    labelKey: "settings.help.faq",
    descriptionKey: "settings.help.faq_desc",
    sectionKey: "settings.section.help",
    icon: "help-circle",
    target: { kind: "row", view: "help", id: "help-faq" },
  },
  {
    key: "terms",
    labelKey: "legal.terms",
    descriptionKey: "settings.help.terms_desc",
    sectionKey: "settings.section.help",
    icon: "file-text",
    target: { kind: "screen", view: "terms" },
  },
  {
    key: "privacy-policy",
    labelKey: "legal.privacy",
    descriptionKey: "settings.help.privacy_desc",
    sectionKey: "settings.section.help",
    icon: "shield",
    target: { kind: "screen", view: "privacy" },
  },

  // ---- Support ----
  {
    key: "support-card",
    labelKey: "settings.support.card",
    descriptionKey: "settings.support.card_desc",
    sectionKey: "settings.section.support",
    icon: "credit-card",
    target: { kind: "row", view: "support", id: "support-card" },
  },
  {
    key: "support-sponsors",
    labelKey: "settings.support.sponsors",
    descriptionKey: "settings.support.sponsors_desc",
    sectionKey: "settings.section.support",
    icon: "github",
    target: { kind: "row", view: "support", id: "support-sponsors" },
  },

  // ---- About ----
  {
    key: "version",
    labelKey: "settings.about.version",
    descriptionKey: "settings.about.version_desc",
    sectionKey: "settings.section.about",
    icon: "tag",
    target: { kind: "screen", view: "version" },
  },
  {
    key: "release-notes",
    labelKey: "settings.about.release_notes",
    descriptionKey: "settings.about.release_notes_desc",
    sectionKey: "settings.section.about",
    icon: "clock",
    target: { kind: "row", view: "about", id: "release-notes" },
  },
  {
    key: "source",
    labelKey: "settings.about.source",
    sectionKey: "settings.section.about",
    icon: "github",
    target: { kind: "row", view: "about", id: "source" },
  },
  {
    key: "licenses",
    labelKey: "settings.about.licenses",
    descriptionKey: "settings.about.licenses_desc",
    sectionKey: "settings.section.about",
    icon: "file-text",
    target: { kind: "screen", view: "licenses" },
  },
] as const satisfies readonly SettingsEntry[];

export interface SettingsHit {
  entry: SettingsEntry;
  score: number;
}

// A name match is what was being looked for; a description match is a maybe.
// The section sits between, so "network" groups that screen's rows without
// burying the row actually called Network.
const LABEL_WEIGHT = 100;
const SECTION_WEIGHT = 10;
const DESCRIPTION_WEIGHT = 1;

// Rank every indexed setting against `query`. The translator is passed in
// because this matches what is on screen, and a module-level `t` would freeze
// at the language the app started in.
export function searchSettings(query: string, T: Translator): SettingsHit[] {
  const q = searchKey(query.trim());
  if (!q) return [];
  const hits: SettingsHit[] = [];
  // Widened: the const assertion holds the literals to the shape, it is not
  // meant to be read back one tuple member at a time.
  const entries: readonly SettingsEntry[] = SETTINGS_INDEX;
  for (const entry of entries) {
    if (entry.platform !== undefined && entry.platform !== Platform.OS) {
      continue;
    }
    const score = Math.max(
      fieldScore(T(entry.labelKey), q) * LABEL_WEIGHT,
      fieldScore(T(entry.sectionKey), q) * SECTION_WEIGHT,
      entry.descriptionKey === undefined
        ? 0
        : fieldScore(T(entry.descriptionKey), q) * DESCRIPTION_WEIGHT,
    );
    if (score > 0) hits.push({ entry, score });
  }
  return hits.sort(
    // Ordered in the language being read: `localeCompare` with no locale asks
    // for the device's default, not the app's.
    (a, b) =>
      b.score - a.score ||
      T(a.entry.labelKey).localeCompare(T(b.entry.labelKey), getLanguage()),
  );
}

// 0 when the query is not in `text`, otherwise how good the match is.
function fieldScore(text: string, q: string): number {
  const hay = searchKey(text);
  const index = hay.indexOf(q);
  return index === -1 ? 0 : scoreMatch(hay, index);
}
