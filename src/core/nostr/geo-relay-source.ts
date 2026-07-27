// Geo-relay directory access.
//
// Airhop ships the relay directory as a vendored, build-time list (src/data/
// relays.ts, generated from assets/data/relays.csv by scripts/generate-relays.js)
// and does NOT fetch it at runtime. That keeps first launch network-free, never
// tells a third party who is asking for relays (a deanonymisation vector,
// especially under Tor), and works offline, which is exactly when this app
// matters most.
//
// Freshness comes from a weekly CI sync (.github/workflows/relays.yaml) that
// pulls bitchat's REVIEWED relay list (permissionlesstech/bitchat's
// relays/online_relays_gps.csv, not the raw georelays feed) into the vendored
// CSV and regenerates this module. Tracking the exact list bitchat uses keeps
// our closest-relay picks aligned with theirs, so Airhop and bitchat clients in
// the same geohash cell converge on the same relays and actually see each other.

import { GEO_RELAYS } from "../../data/relays";
import type { RelayEntry } from "./geo-relay";

// The vendored geo-relay directory. Never empty.
export function loadGeoRelays(): RelayEntry[] {
  return GEO_RELAYS as RelayEntry[];
}
