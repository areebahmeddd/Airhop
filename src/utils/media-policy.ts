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
