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
    this.loadEntries(parseRelaysCsv(csv));
  }

  // Load from an already-parsed list. This is the path the app actually uses:
  // the relay table ships as a generated TypeScript module (src/data/relays.ts)
  // because Metro does not bundle .csv, so there is no CSV string to parse at
  // runtime. The CSV path above remains for tests and for regeneration.
  loadEntries(entries: readonly RelayEntry[]): void {
    const seen = new Set<string>();
    this.entries = [];
    for (const e of entries) {
      const url = normalizeRelayUrl(e.url);
      if (url === null || seen.has(url)) continue;
      seen.add(url);
      this.entries.push({ url, lat: e.lat, lng: e.lng });
    }
  }

  // Return the N nearest relays to (lat, lng). Falls back to the global
  // fallback set if the directory is empty or has fewer than `count` entries.
  nearestRelays(lat: number, lng: number, count: number = 5): string[] {
    const pool = this.entries.length > 0 ? this.entries : FALLBACK_RELAYS;

    const sorted = pool
      .map((e) => ({ url: e.url, km: haversineKm(lat, lng, e.lat, e.lng) }))
      // Ties break on URL, not insertion order. This is load-bearing for
      // interop, not cosmetic: publisher and subscriber must independently
      // arrive at the SAME relay set, or messages get published to relays the
      // other side never subscribed to and the channel silently drops traffic.
      // Many relays in the directory share identical coordinates, so ties are
      // common rather than exotic.
      .sort((a, b) => (a.km !== b.km ? a.km - b.km : a.url < b.url ? -1 : 1));

    return sorted.slice(0, count).map((e) => e.url);
  }

  // Relays nearest the CENTRE of a geohash cell, not the user's own position.
  //
  // This distinction is essential: every participant in a cell must converge on
  // the same relay set. Selecting by personal position would give two people in
  // opposite corners of the same city cell different relays, and they would
  // never see each other's messages despite being "in" the same channel.
  closestRelaysToGeohash(
    geohash: string,
    decodeCenter: (hash: string) => { lat: number; lng: number },
    count: number = 5,
  ): string[] {
    const center = decodeCenter(geohash);
    return this.nearestRelays(center.lat, center.lng, count);
  }

  // Return the N nearest relays with their distance in kilometres.
  // Useful for the in-app relay map that labels each pin with a distance.
  nearestRelaysWithDistance(
    lat: number,
    lng: number,
    count: number = 5,
  ): { url: string; km: number }[] {
    const pool = this.entries.length > 0 ? this.entries : FALLBACK_RELAYS;
    return pool
      .map((e) => ({ url: e.url, km: haversineKm(lat, lng, e.lat, e.lng) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, count);
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
