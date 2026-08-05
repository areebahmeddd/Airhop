// Geographic relay directory: picks the nearest Nostr relays from the bundled
// CSV and the optional cached remote copy.
//
// Relay list source: assets/data/relays.csv (bundled at build time, rows are:
//   Relay URL,Latitude,Longitude
//
// Nearest-relay selection uses the Haversine great-circle formula. The caller
// provides GPS coordinates; this module returns the N nearest relay URLs.

// ---- Types ------------------------------------------------------------------

// Relays to publish/subscribe per geohash cell. Matches bitchat's
// TransportConfig.nostrGeoRelayCount so both clients converge on the same set.
// Canonical here rather than in each service, because NostrClient sizes its
// per-call relay ceiling from it: if the two drift apart the extra relays get
// trimmed away again.
export const GEO_RELAY_COUNT = 5;

// How many relays a user may add by hand. A ceiling rather than a preference:
// every custom relay is an extra socket held open alongside the cell's
// auto-discovered set, and NostrClient sizes its per-call relay ceiling around
// this number so a custom relay is never silently dropped.
export const MAX_CUSTOM_RELAYS = 5;

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

// The relays Airhop falls back on when it cannot pick something better.
//
// These serve two roles that want the same hosts for the same reason (widely
// reachable, and reliably carrying NIP-59 gift-wraps): the geo fallback below,
// and NostrClient's default DM pool. Declared once because they used to be two
// hand-maintained literals of the same four hosts in two files, with nothing to
// catch an edit landing on only one of them.
//
// Coordinates matter only to the geo role. The DM role reads the URLs.
//
// Ordered alphabetically by host, which is also the order the Message relays
// list shows them in. Deliberately NOT ordered by distance: in the geo role
// nearestRelays re-sorts by distance from the query point anyway, so the
// literal's order cannot matter there, and in the DM role every client opens
// all of these at once no matter where it is, so a distance order would dress a
// fixed global set up as a ranking it does not have. Alphabetical is stable,
// obviously not a preference, and keeps additions easy to place.
const WELL_KNOWN_RELAYS: RelayEntry[] = [
  { url: "wss://nos.lol", lat: 40.7128, lng: -74.006 },
  { url: "wss://offchain.pub", lat: 51.5074, lng: -0.1278 },
  { url: "wss://relay.damus.io", lat: 37.7749, lng: -122.4194 },
  { url: "wss://relay.primal.net", lat: 40.7128, lng: -74.006 },
];

// Geo role: used when the directory has no nearby entries or GPS is unavailable.
const FALLBACK_RELAYS: RelayEntry[] = WELL_KNOWN_RELAYS;

// DM role: NostrClient's default pool. Carries gift-wrapped DMs, private
// channels and wallet lookups, and is deliberately NOT affected by the user's
// custom relays, which scope to location channels and the mesh bridge.
export const DEFAULT_DM_RELAYS: readonly string[] = WELL_KNOWN_RELAYS.map(
  (r) => r.url,
);

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

  get size(): number {
    return this.entries.length;
  }
}

// Combine a cell's auto-discovered nearest relays with the user's custom relays,
// per the Geo-relay discovery toggle. Pure so it is trivially unit-testable.
//
//   discovery on  -> the `count` nearest relays (kept intact: converging on them
//                    is what makes location channels interoperate with bitchat)
//                    PLUS any custom relays, deduped and additive.
//   discovery off -> only the custom relays (the user's explicit choice, which
//                    trades interop for control), unless none are set, in which
//                    case fall back to the nearest so a channel is never
//                    left with zero relays.
export function mergeGeoRelays(
  nearest: readonly string[],
  custom: readonly string[],
  discovery: boolean,
  count: number,
): string[] {
  const near = nearest.slice(0, count);
  if (!discovery) {
    return custom.length > 0 ? [...custom] : near;
  }
  return [...new Set([...near, ...custom])];
}

// Validate + normalize a user-entered relay to a `wss://host[:port]` URL, or
// return null if it is not a well-formed public relay. Ported from bitchat
// GeoRelayDirectory.validatedDirectoryAddress so a custom relay a user pins is
// held to the same bar as the ones in bitchat's reviewed directory: ASCII only,
// wss/https scheme, no credentials/query/fragment/path, a real DNS hostname (at
// least two labels, each 1-63 chars of [a-z0-9-] with no leading/trailing dash),
// not a bare IP, and not a loopback/private name. A non-standard port is kept.
export function validateRelayUrl(raw: string): string | null {
  const value = raw.trim();
  // Printable ASCII only (no spaces, no control characters).
  if (value.length === 0 || !/^[!-~]+$/.test(value)) return null;

  let rest = value;
  const scheme = /^([a-z][a-z0-9+.-]*):\/\//i.exec(value);
  if (scheme !== null) {
    const s = scheme[1].toLowerCase();
    if (s !== "wss" && s !== "https") return null;
    rest = value.slice(scheme[0].length);
  }
  // No userinfo, query, or fragment.
  if (rest.includes("@") || rest.includes("?") || rest.includes("#")) {
    return null;
  }
  // Only an empty path or "/" is allowed.
  const slash = rest.indexOf("/");
  let authority = rest;
  if (slash !== -1) {
    if (rest.slice(slash) !== "/") return null;
    authority = rest.slice(0, slash);
  }

  let host = authority;
  let port: number | undefined;
  const colon = authority.lastIndexOf(":");
  if (colon !== -1) {
    const portStr = authority.slice(colon + 1);
    if (!/^[0-9]+$/.test(portStr)) return null;
    port = parseInt(portStr, 10);
    if (port < 1 || port > 65535) return null;
    host = authority.slice(0, colon);
  }

  host = host.toLowerCase();
  if (
    host.length === 0 ||
    host.length > 253 ||
    host.endsWith(".") ||
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return null;
  }

  const labels = host.split(".");
  // At least two labels, and not a bare IPv4 (all-numeric labels).
  if (labels.length < 2 || labels.every((l) => /^[0-9]+$/.test(l))) return null;
  const labelOk = (l: string): boolean =>
    l.length >= 1 &&
    l.length <= 63 &&
    !l.startsWith("-") &&
    !l.endsWith("-") &&
    /^[a-z0-9-]+$/.test(l);
  if (!labels.every(labelOk)) return null;

  const hostPort =
    port !== undefined && port !== 443 ? `${host}:${port}` : host;
  return `wss://${hostPort}`;
}

// The host to show a user for a relay URL. Every relay reaching the UI is
// wss:// (validateRelayUrl normalizes to it, and the directory is wss-only), so
// the scheme is the same noise on every row. Shared by both screens that list
// relays so they never diverge on how a relay looks. Display only: the full URL
// stays the identity everywhere else, including as the key for removal.
export function relayDisplayHost(url: string): string {
  return url.replace(/^wss:\/\//, "");
}

// ---- Helpers ----------------------------------------------------------------

function normalizeRelayUrl(raw: string): string | null {
  const url = raw.trim().replace(/\/$/, "");
  if (url.startsWith("wss://") || url.startsWith("ws://")) return url;
  // Bare hostname: assume wss
  if (!url.includes("://") && url.length > 0) return `wss://${url}`;
  return null;
}
