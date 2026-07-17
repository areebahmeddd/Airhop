// Geographic relay directory: picks the nearest Nostr relays from the bundled
// CSV and the optional cached remote copy.
//
// Relay list source: assets/data/relays.csv (bundled at build time, rows are:
//   Relay URL,Latitude,Longitude
//
// Nearest-relay selection uses the Haversine great-circle formula. The caller
// provides GPS coordinates; this module returns the N nearest relay URLs.

// ---- Types ------------------------------------------------------------------

export interface RelayEntry {
  url: string; // wss://… or ws://…
  lat: number; // decimal degrees
  lng: number; // decimal degrees
}

// ---- Geospatial math --------------------------------------------------------

// Haversine distance in kilometres between two (lat, lng) points.
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// ---- CSV parsing ------------------------------------------------------------

// Parse the relays.csv format: "Relay URL,Latitude,Longitude" with a header row.
// Invalid rows are silently skipped (attacker-controlled relay content).
export function parseRelaysCsv(csv: string): RelayEntry[] {
  const entries: RelayEntry[] = [];
  const lines = csv.split(/\r?\n/);
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(",");
    if (parts.length < 3) continue;

    const rawUrl = parts[0].trim();
    const lat = parseFloat(parts[1]);
    const lng = parseFloat(parts[2]);

    if (!isFinite(lat) || !isFinite(lng)) continue;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) continue;

    const url = normalizeRelayUrl(rawUrl);
    if (!url) continue;

    entries.push({ url, lat, lng });
  }
  return entries;
}

// ---- GeoRelayDirectory ------------------------------------------------------

// Fallback relay set used when CSV has no nearby entries or GPS is unavailable.
const FALLBACK_RELAYS: RelayEntry[] = [
  { url: "wss://relay.damus.io", lat: 37.7749, lng: -122.4194 },
  { url: "wss://nos.lol", lat: 40.7128, lng: -74.006 },
  { url: "wss://relay.primal.net", lat: 40.7128, lng: -74.006 },
  { url: "wss://offchain.pub", lat: 51.5074, lng: -0.1278 },
];

export class GeoRelayDirectory {
  private entries: RelayEntry[] = [];

  // Load from CSV string (typically from require('../../../assets/data/relays.csv')
  // which Metro bundles as a static asset). Call once at startup.
  load(csv: string): void {
    const parsed = parseRelaysCsv(csv);
    // De-duplicate by URL
    const seen = new Set<string>();
    this.entries = [];
    for (const e of parsed) {
      if (!seen.has(e.url)) {
        seen.add(e.url);
        this.entries.push(e);
      }
    }
  }

  // Return the N nearest relays to (lat, lng). Falls back to the global
  // fallback set if the directory is empty or has fewer than `count` entries.
  nearestRelays(lat: number, lng: number, count: number = 5): string[] {
    const pool = this.entries.length > 0 ? this.entries : FALLBACK_RELAYS;

    const sorted = pool
      .map((e) => ({ url: e.url, km: haversineKm(lat, lng, e.lat, e.lng) }))
      .sort((a, b) => a.km - b.km);

    return sorted.slice(0, count).map((e) => e.url);
  }

  // Return all relay entries (for diagnostics / UI relay browser).
  allRelays(): RelayEntry[] {
    return [...this.entries];
  }

  get size(): number {
    return this.entries.length;
  }
}

// ---- Helpers ----------------------------------------------------------------

function normalizeRelayUrl(raw: string): string | null {
  const url = raw.trim().replace(/\/$/, "");
  if (url.startsWith("wss://") || url.startsWith("ws://")) return url;
  // Bare hostname: assume wss
  if (!url.includes("://") && url.length > 0) return `wss://${url}`;
  return null;
}
