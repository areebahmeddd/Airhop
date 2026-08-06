// Geo-relay directory access.
//
// Airhop ships the relay directory as a vendored, build-time list (src/data/
// relays.ts, generated from assets/data/nostr_relays.csv by
// scripts/generate-relays.js) and does NOT fetch it at runtime. That keeps
// first launch network-free, never tells a third party who is asking for relays
// (a deanonymisation vector, especially under Tor), and works offline, which is
// exactly when this app matters most.
//
// Freshness comes from a daily CI sync (.github/workflows/relays.yaml) that
// pulls permissionlesstech/georelays into the vendored CSV and regenerates this
// module.
//
// Interop with bitchat comes from canonicalizing rows the same way they do, in
// GeoRelayDirectory.loadEntries, not from tracking an identical file.

import { GEO_RELAYS } from "../../data/relays";
import type { RelayEntry } from "./geo-relay";

// The vendored geo-relay directory. Never empty.
export function loadGeoRelays(): RelayEntry[] {
  return GEO_RELAYS as RelayEntry[];
}
