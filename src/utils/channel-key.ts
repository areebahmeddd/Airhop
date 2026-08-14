// The channel-key format, as pure string handling.
//
// A channel is identified by a prefixed key: `dm:<peerID>`, `group:<id>`,
// `geohash:<gh>` for a teleported cell, or a bare `#name`. Recognising and
// building those keys needs no service, no store and no network, so it lives
// here where every layer can import it. Keeping the geohash predicates inside
// geohash-channel-service made utils/ depend on services/, which inverts the
// layering for two one-line functions.

// A teleported location cell: a cell opened by its geohash rather than by being
// there. Matches bitchat's key for the same cell, so the two interoperate.
export const MANUAL_GEO_PREFIX = "geohash:";

export function isManualGeoChannel(channel: string): boolean {
  return channel.startsWith(MANUAL_GEO_PREFIX);
}

// The cell a teleported channel points at, or null when the key is not one.
export function manualGeohashOf(channel: string): string | null {
  return isManualGeoChannel(channel)
    ? channel.slice(MANUAL_GEO_PREFIX.length)
    : null;
}

export function geohashChannel(geohash: string): string {
  return `${MANUAL_GEO_PREFIX}${geohash}`;
}
