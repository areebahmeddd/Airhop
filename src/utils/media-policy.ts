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
export function canSendMedia(channel: string): boolean {
  if (channel.startsWith("dm:")) return !channel.startsWith("dm:nostr_");
  return channel === "#bluetooth";
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
    return "You only know this person through a relay, and photos, files and voice notes travel over Bluetooth. Text reaches them anywhere, media needs them nearby.";
  }
  if (isLocationChannel(channel)) {
    return "A location channel reaches people over the internet, and photos, files and voice notes travel over Bluetooth, so they would never arrive.";
  }
  // Everything left is a private room: a `#name` channel or a `group:<id>`.
  return `An attachment is signed but not encrypted, so sending one into a private ${channel.startsWith("group:") ? "group" : "channel"} would broadcast it in the clear while the text here stays encrypted.`;
}
