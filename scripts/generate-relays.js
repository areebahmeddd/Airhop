#!/usr/bin/env node
// Regenerates src/data/relays.ts from assets/data/relays.csv.
//
// The relay directory ships as a TypeScript module rather than being parsed
// from the CSV at runtime: Metro does not bundle .csv as an asset, so the file
// was simply unreachable from the app. That is why GeoRelayDirectory sat unused
// despite being fully implemented and tested.
//
// The CSV is vendored in this repo at assets/data/relays.csv and is the single
// source of truth. Airhop does NOT fetch a relay list at runtime from any
// third-party URL. Bundling it means no network dependency on first launch, no
// third party learning who is asking for relays, and no fetch to fail offline
// (which is exactly when this app matters most).
//
// Canonical copy: https://github.com/areebahmeddd/Airhop/blob/main/assets/data/relays.csv
//
// Run after updating that CSV:
//   node scripts/generate-relays.js

const fs = require("fs");
const path = require("path");

const CSV = path.join(__dirname, "..", "assets", "data", "relays.csv");
const OUT = path.join(__dirname, "..", "src", "data", "relays.ts");

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

const body = relays
  .map((r) => `  { url: "${r.url}", lat: ${r.lat}, lng: ${r.lng} },`)
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
