import { t } from "../i18n";
// Where media (photos, videos, files, voice notes) may be sent.
//
// Media rides the BLE file-transfer path only: it is flood-broadcast over
// Bluetooth, never bridged to Nostr, and is signed but not encrypted. So it is
// offered only where that is coherent:
//   - `#bluetooth`, the public Bluetooth-mesh channel (public anyway, and
//     everyone there is reachable over BLE).
//   - Direct mesh DMs (`dm:<peerID>`), which travel over BLE to that peer.
//
// It is OFF everywhere else:
//   - Location channels and teleported `geohash:<gh>` cells are Nostr-scoped;
//     media can't ride Nostr, so remote participants would never receive it.
//   - Private `#name` channels and `group:<id>` groups encrypt their text, so
//     broadcasting unencrypted media would quietly break that privacy.
//   - Geohash DMs (`dm:nostr_<pubkey>`) are Nostr-only pseudonym chats.
//
// This mirrors bitchat's `canSendMediaInCurrentContext` (media only in `.mesh`
// and mesh peer DMs), so the two apps behave the same about what a channel can
// carry.
// The public BLE broadcast channel: bitchat's single mesh room, which its UI
// labels "bluetooth" rather than naming as a channel.
//
// Lives here, in a util with no service dependencies, because both the mesh
// service and the chat screens need it and neither may import the other
// (mesh-service already imports file-transfer-service). It decides where an
// untagged broadcast attachment lands, whether media and live voice are
// allowed, and which room shows the bridge toggle.
export const BRIDGE_CHANNEL = "#bluetooth";

export function canSendMedia(channel: string): boolean {
  if (channel.startsWith("dm:")) return !channel.startsWith("dm:nostr_");
  return channel === BRIDGE_CHANNEL;
}

// The location-scoped channels, listed here rather than imported so this stays
// a pure util with no service dependencies. Source of truth for the named ones
// is GEO_CHANNEL_PRECISION in services/geohash-channel-service; a teleported
// cell is keyed `geohash:<gh>`. Pinned by this module's tests.
const GEO_CHANNELS = new Set([
  "#block",
  "#neighborhood",
  "#city",
  "#province",
  "#region",
]);

function isLocationChannel(channel: string): boolean {
  return GEO_CHANNELS.has(channel) || channel.startsWith("geohash:");
}

// Why media is off here, in one sentence, for the disabled attach and mic
// buttons. Showing them greyed rather than hiding them answers "where did the
// plus go" before it is asked, and this is what they say when tapped. Returns
// null wherever media IS allowed, so a caller can key off this one call.
export function mediaBlockedReason(channel: string): string | null {
  if (canSendMedia(channel)) return null;
  if (channel.startsWith("dm:nostr_")) {
    return t("media.blocked.nostr_only");
  }
  if (isLocationChannel(channel)) {
    return t("media.blocked.location_channel");
  }
  // Everything left is private: a `#name` channel or a `group:<id>`.
  return t(
    channel.startsWith("group:")
      ? "media.blocked.private_group"
      : "media.blocked.private_channel",
  );
}
