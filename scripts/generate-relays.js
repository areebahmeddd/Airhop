#!/usr/bin/env node
// Regenerates src/data/relays.ts and landing/src/data/relays.ts from
// assets/data/nostr_relays.csv.
//
// The relay directory ships as a TypeScript module rather than being parsed
// from the CSV at runtime, because Metro does not bundle .csv as an asset and
// the file would be unreachable from the app.
//
// The CSV is vendored in this repo at assets/data/nostr_relays.csv and is the
// single source of truth at runtime. Airhop does NOT fetch a relay list at
// runtime from any third-party URL. Bundling it means no network dependency on
// first launch, no third party learning who is asking for relays, and no fetch
// to fail offline (which is exactly when this app matters most).
//
// Upstream: .github/workflows/sync-relays.yml proposes a daily refresh of the
// vendored CSV from permissionlesstech/georelays, as a pull request for review.
//
// Rows are canonicalized, not copied: the feed lists many hosts twice, bare and
// with an explicit :443, and those are one relay. The CSV stays byte-identical
// to upstream so it can be diffed against the source; this module is the form
// the app loads.
//
// Run after updating that CSV:
//   node scripts/generate-relays.js

const fs = require("fs");
const path = require("path");
const { canonicalRelayUrl } = require("./relay-url.js");

const CSV = path.join(__dirname, "..", "assets", "data", "nostr_relays.csv");
const OUT = path.join(__dirname, "..", "src", "data", "relays.ts");
const LANDING_OUT = path.join(
  __dirname,
  "..",
  "landing",
  "src",
  "data",
  "relays.ts",
);

// The map names a couple of relays per location on hover. One site hosts 137 of
// them, so listing every host would be noise as well as bulk. Two names plus the
// count is the readable form.
const HOSTS_PER_SITE = 2;

const lines = fs
  .readFileSync(CSV, "utf8")
  .split(/\r?\n/)
  .slice(1)
  .filter(Boolean);

const seen = new Set();
const relays = [];
let dropped = 0;
let collapsed = 0;
for (const line of lines) {
  const [url, lat, lng] = line.split(",");
  if (!url || !lat || !lng) continue;
  const la = parseFloat(lat);
  const ln = parseFloat(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) continue;
  // Canonical form, so "host" and "host:443" collapse to one entry.
  const u = canonicalRelayUrl(url);
  if (u === null) {
    dropped += 1;
    continue;
  }
  if (seen.has(u)) {
    collapsed += 1;
    continue;
  }
  seen.add(u);
  relays.push({ url: u, lat: la, lng: ln });
}

// JSON.stringify, not a bare "${...}". The URL comes from a CSV this repo syncs
// from upstream, so it is untrusted input that ends up inside a TypeScript
// source file that gets bundled into the app. validate-relays.js gates the sync
// and currently rejects anything with a quote in it, but escaping here means a
// regression in that validator cannot turn a relay hostname into code.
// The landing-page path below does the same.
const body = relays
  .map(
    (r) =>
      `  { url: ${JSON.stringify(r.url)}, lat: ${Number(r.lat)}, lng: ${Number(r.lng)} },`,
  )
  .join("\n");

fs.writeFileSync(
  OUT,
  `// Geo-located Nostr relay directory.
//
// Generated from assets/data/nostr_relays.csv, vendored in this repo:
//   https://github.com/areebahmeddd/airhop/blob/main/assets/data/nostr_relays.csv
// It lives here as a TypeScript module rather than being read from the CSV at
// runtime because Metro does not bundle .csv as an asset, which would leave the
// file unreachable from the app.
//
// Regenerate with: node scripts/generate-relays.js
//
// ${relays.length} relays.

export interface GeoRelay {
  url: string;
  lat: number;
  lng: number;
}

export const GEO_RELAYS: readonly GeoRelay[] = [
${body}
];
`,
);

console.log(
  `Wrote ${relays.length} relays to src/data/relays.ts ` +
    `(from ${lines.length} rows: ${collapsed} collapsed as duplicates, ${dropped} rejected)`,
);

// The landing page plots the same directory on a world map. It only needs one
// entry per physical location, so relays sharing a site are collapsed into a
// single point carrying its relay count. Generating it here keeps the map in
// step with the sync and means the site never calls GitHub at runtime.
const sites = new Map();
for (const r of relays) {
  const lat = Math.round(r.lat * 1000) / 1000;
  const lng = Math.round(r.lng * 1000) / 1000;
  const key = `${lat},${lng}`;
  const site = sites.get(key);
  if (site) {
    site.relays += 1;
    site.hosts.push(r.url);
  } else {
    sites.set(key, { lat, lng, relays: 1, hosts: [r.url] });
  }
}

// Sorted before the cut so the choice stays deterministic when upstream reorders
// rows. Every entry is wss://, and the scheme is noise on the map readout, so it
// is dropped for display as relayDisplayHost does in the app.
function displayHosts(hosts) {
  return [...hosts]
    .sort()
    .slice(0, HOSTS_PER_SITE)
    .map((host) => host.replace(/^wss:\/\//, ""));
}

// Stable order so the generated file only changes when the data does.
const siteList = [...sites.values()].sort(
  (a, b) => a.lat - b.lat || a.lng - b.lng,
);
const siteBody = siteList
  .map((s) => {
    const hosts = displayHosts(s.hosts)
      .map((h) => JSON.stringify(h))
      .join(", ");
    return `  { lat: ${s.lat}, lng: ${s.lng}, relays: ${s.relays}, hosts: [${hosts}] },`;
  })
  .join("\n");

fs.mkdirSync(path.dirname(LANDING_OUT), { recursive: true });
fs.writeFileSync(
  LANDING_OUT,
  `export interface RelaySite {
  lat: number;
  lng: number;
  relays: number;
  hosts: readonly string[];
}

export const RELAY_COUNT = ${relays.length};

export const RELAY_SITES: readonly RelaySite[] = [
${siteBody}
];
`,
);

console.log(`Wrote ${siteList.length} sites to landing/src/data/relays.ts`);
