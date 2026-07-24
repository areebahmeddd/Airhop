// Live geo-relay directory source.
//
// bitchat fetches the geohash relay directory at runtime from the shared
// permissionlesstech/georelays CSV and refreshes it periodically, so every
// client converges on the same, current relay set for a cell. Airhop shipped a
// vendored snapshot of that CSV (src/data/relays.ts) but never refreshed it, so
// over time our "closest 5" could drift from bitchat's and weaken interop.
//
// This module closes that gap: it fetches the SAME CSV bitchat uses, caches it,
// and hands the freshest available list to the directory. Order of preference:
//   1. cached CSV from a previous successful fetch (survives restarts)
//   2. the vendored snapshot (always present, so the feature works offline)
// A background refresh then updates the cache for next time.

import { createMMKV } from "react-native-mmkv";
import { GEO_RELAYS } from "../../data/relays";
import { parseRelaysCsv, type RelayEntry } from "./geo-relay";

// The canonical, auto-updating directory bitchat also reads. Fetching the same
// URL is what keeps the two apps' relay selection aligned without manual syncs.
const GEO_RELAYS_URL =
  "https://raw.githubusercontent.com/permissionlesstech/georelays/refs/heads/main/nostr_relays.csv";

// Refresh at most once a day: the directory changes slowly and every client
// only needs to be roughly in sync, so a tighter cadence would just burn data.
const REFRESH_MS = 24 * 60 * 60 * 1000;

const storage = createMMKV({ id: "geo-relays-cache" });
const CACHE_KEY = "csv";
const CACHE_AT_KEY = "csv_at";

// The best relay list available synchronously right now: the cached CSV if a
// previous fetch succeeded, else the vendored snapshot. Never empty.
export function loadGeoRelays(): RelayEntry[] {
  const cached = storage.getString(CACHE_KEY);
  if (cached !== undefined) {
    const parsed = parseRelaysCsv(cached);
    if (parsed.length > 0) return parsed;
  }
  return GEO_RELAYS as RelayEntry[];
}

// Fetch the live CSV and cache it. Returns the fresh entries on success, or null
// if the cache is still fresh or the fetch failed (caller keeps its current
// list). Never throws.
export async function refreshGeoRelays(
  force = false,
): Promise<RelayEntry[] | null> {
  const at = storage.getNumber(CACHE_AT_KEY) ?? 0;
  const haveCache = storage.getString(CACHE_KEY) !== undefined;
  if (!force && haveCache && Date.now() - at < REFRESH_MS) return null;

  try {
    const res = await fetch(GEO_RELAYS_URL);
    if (!res.ok) return null;
    const csv = await res.text();
    const parsed = parseRelaysCsv(csv);
    // Guard against a truncated or garbage response replacing a good list.
    if (parsed.length < 50) return null;
    storage.set(CACHE_KEY, csv);
    storage.set(CACHE_AT_KEY, Date.now());
    return parsed;
  } catch {
    return null;
  }
}
