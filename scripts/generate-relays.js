#!/usr/bin/env node
// Regenerates src/data/relays.ts and landing/src/data/relays.ts from
// assets/data/relays.csv.
//
// The relay directory ships as a TypeScript module rather than being parsed
// from the CSV at runtime: Metro does not bundle .csv as an asset, so the file
// was simply unreachable from the app. That is why GeoRelayDirectory sat unused
// despite being fully implemented and tested.
//
// The CSV is vendored in this repo at assets/data/relays.csv and is the single
// source of truth at runtime. Airhop does NOT fetch a relay list at runtime from
// any third-party URL. Bundling it means no network dependency on first launch,
// no third party learning who is asking for relays, and no fetch to fail offline
// (which is exactly when this app matters most).
//
// Upstream: .github/workflows/relays.yaml polls daily and refreshes the
// vendored CSV from bitchat's REVIEWED relay list
// (https://raw.githubusercontent.com/permissionlesstech/bitchat/main/relays/online_relays_gps.csv),
// so our closest-relay picks stay aligned with bitchat's for geohash interop.
// That list itself only moves when a human merges bitchat's weekly review PR,
// which is why the poll is daily but the data changes at most weekly.
//
// Run after updating that CSV:
//   node scripts/generate-relays.js

const fs = require("fs");
const path = require("path");

const CSV = path.join(__dirname, "..", "assets", "data", "relays.csv");
const OUT = path.join(__dirname, "..", "src", "data", "relays.ts");
const LANDING_OUT = path.join(
  __dirname,
  "..",
  "landing",
  "src",
  "data",
  "relays.ts",
);

const lines = fs
  .readFileSync(CSV, "utf8")
  .split(/\r?\n/)
  .slice(1)
  .filter(Boolean);

const seen = new Set();
const relays = [];
for (const line of lines) {
  const [url, lat, lng] = line.split(",");
  if (!url || !lat || !lng) continue;
  const la = parseFloat(lat);
  const ln = parseFloat(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) continue;
  const u = url.trim();
  if (seen.has(u)) continue; // the CSV contains duplicate hosts
  seen.add(u);
  relays.push({ url: u, lat: la, lng: ln });
}

// JSON.stringify, not a bare "${...}". The URL comes from a CSV this repo syncs
// from upstream and auto-commits, so it is untrusted input that ends up inside a
// TypeScript source file that gets bundled into the app. validate-relays.js gates
// the sync and currently rejects anything with a quote in it, but escaping here
// means a regression in that validator cannot turn a relay hostname into code.
// The landing-page path below already does this; this is the same rule applied
// to the one place that was still interpolating raw.
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
// Generated from assets/data/relays.csv, vendored in this repo:
//   https://github.com/areebahmeddd/Airhop/blob/main/assets/data/relays.csv
// It lives here as a TypeScript module rather than being read from the CSV at
// runtime because Metro does not bundle .csv as an asset, so the file was
// unreachable from the app, which is why GeoRelayDirectory was never wired up.
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

console.log(`Wrote ${relays.length} relays to src/data/relays.ts`);

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

// The map names a couple of relays per location on hover. One site hosts 137
// of them, so listing every host would be noise as well as bulk. Two names
// plus the count is the readable form, and sorting before the cut keeps the
// choice deterministic when upstream reorders rows.
const HOSTS_PER_SITE = 2;

// Many relays appear twice, once bare and once with an explicit :443. Those are
// the same machine, so showing both would waste the readout on a near-duplicate
// instead of naming a second operator. The relay count still counts both.
function displayHosts(hosts) {
  const seen = new Set();
  const picked = [];
  for (const host of [...hosts].sort()) {
    const bare = host.replace(/:\d+$/, "");
    if (seen.has(bare)) continue;
    seen.add(bare);
    picked.push(host);
    if (picked.length === HOSTS_PER_SITE) break;
  }
  return picked;
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
