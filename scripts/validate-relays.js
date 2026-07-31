#!/usr/bin/env node
// Validates a candidate relay directory CSV before it replaces the vendored copy at
// assets/data/relays.csv. The directory is compiled into the app bundle, so a bad row
// ships to every user. Fails closed.
//
//   node scripts/validate-relays.js --input <candidate.csv>
//                                   [--baseline assets/data/relays.csv]
//                                   [--github-output $GITHUB_OUTPUT]

const crypto = require("crypto");
const fs = require("fs");

const HEADER = "Relay URL,Latitude,Longitude";

const MIN_ROWS = 100;
const MAX_ROWS = 5000;
const MIN_BYTES = 1024;
const MAX_BYTES = 1024 * 1024;

// Upstream swings ~6% day to day, so a double-digit delta is normal.
const MAX_COUNT_DELTA = 0.2;
const MIN_RETAINED = 0.7;

// RFC 1123 host. Rejects schemes, paths, credentials, wildcards and non-ASCII.
const HOST =
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;
const MAX_HOST_LENGTH = 253;

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    if (!key.startsWith("--")) fail(`Unexpected argument: ${key}`);
    args[key.slice(2)] = argv[i + 1];
  }
  return args;
}

const problems = [];

function reject(message) {
  problems.push(message);
}

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(1);
}

// Returns null when the file is not shaped like a relay directory at all.
function parseCsv(text, label) {
  if (text.includes("\u0000") || text.includes("\uFFFD")) {
    reject(`${label}: contains NUL or invalid UTF-8`);
    return null;
  }

  const lines = text.split(/\r?\n/);
  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();

  if (lines.length === 0) {
    reject(`${label}: file is empty`);
    return null;
  }
  if (lines[0].replace(/^\uFEFF/, "") !== HEADER) {
    reject(`${label}: header must be "${HEADER}", found "${lines[0]}"`);
    return null;
  }

  return lines.slice(1);
}

function validateRows(rows) {
  const coords = new Map();
  let duplicates = 0;

  rows.forEach((line, i) => {
    // +2: lines are 1-based and the header is line 1.
    const at = `row ${i + 2}`;
    const fields = line.split(",");

    if (fields.length !== 3) {
      reject(`${at}: expected 3 fields, found ${fields.length}`);
      return;
    }

    const [rawHost, rawLat, rawLng] = fields.map((f) => f.trim());

    const [host, port] = splitPort(rawHost);
    if (rawHost.length > MAX_HOST_LENGTH || !HOST.test(host)) {
      reject(`${at}: invalid relay host "${rawHost}"`);
      return;
    }
    if (
      port !== null &&
      (!Number.isInteger(port) || port < 1 || port > 65535)
    ) {
      reject(`${at}: invalid port in "${rawHost}"`);
      return;
    }

    const lat = Number(rawLat);
    const lng = Number(rawLng);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      reject(`${at}: latitude out of range "${rawLat}"`);
      return;
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      reject(`${at}: longitude out of range "${rawLng}"`);
      return;
    }
    // 0,0 is what a failed geolocation writes, never a real relay.
    if (lat === 0 && lng === 0) {
      reject(`${at}: null-island coordinates for "${rawHost}"`);
      return;
    }

    const key = rawHost.toLowerCase();
    const seen = coords.get(key);
    if (seen === undefined) {
      coords.set(key, `${lat},${lng}`);
    } else if (seen !== `${lat},${lng}`) {
      reject(`${at}: "${rawHost}" repeats with conflicting coordinates`);
    } else {
      duplicates += 1;
    }
  });

  return { hosts: new Set(coords.keys()), duplicates };
}

function splitPort(value) {
  const colon = value.lastIndexOf(":");
  if (colon < 0) return [value, null];
  return [value.slice(0, colon), Number(value.slice(colon + 1))];
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) fail("Missing --input");

  let text;
  try {
    text = fs.readFileSync(args.input, "utf8");
  } catch (err) {
    fail(`Could not read ${args.input}: ${err.message}`);
  }

  const bytes = Buffer.byteLength(text);
  if (bytes < MIN_BYTES || bytes > MAX_BYTES) {
    reject(
      `candidate: size ${bytes} bytes is outside ${MIN_BYTES}..${MAX_BYTES}`,
    );
  }

  const rows = parseCsv(text, "candidate");
  if (rows === null) {
    problems.forEach((p) => console.error(`::error::${p}`));
    process.exit(1);
  }

  if (rows.length < MIN_ROWS || rows.length > MAX_ROWS) {
    reject(
      `candidate: ${rows.length} rows is outside ${MIN_ROWS}..${MAX_ROWS}`,
    );
  }

  const { hosts, duplicates } = validateRows(rows);

  // Skipped on a first run so the directory can still be seeded.
  let added = null;
  let removed = null;
  if (args.baseline && fs.existsSync(args.baseline)) {
    const baselineRows = parseCsv(
      fs.readFileSync(args.baseline, "utf8"),
      "baseline",
    );
    if (baselineRows !== null && baselineRows.length > 0) {
      const before = new Set(
        baselineRows.map((line) => line.split(",")[0].trim().toLowerCase()),
      );

      const delta = Math.abs(hosts.size - before.size) / before.size;
      if (delta > MAX_COUNT_DELTA) {
        reject(
          `candidate: relay count moved ${(delta * 100).toFixed(1)}% ` +
            `(${before.size} to ${hosts.size}), limit ${MAX_COUNT_DELTA * 100}%`,
        );
      }

      const retained = [...before].filter((h) => hosts.has(h)).length;
      const ratio = retained / before.size;
      if (ratio < MIN_RETAINED) {
        reject(
          `candidate: only ${(ratio * 100).toFixed(1)}% of the current ` +
            `directory survives, minimum ${MIN_RETAINED * 100}%`,
        );
      }

      added = [...hosts].filter((h) => !before.has(h)).length;
      removed = before.size - retained;
    }
  }

  if (problems.length > 0) {
    problems.forEach((p) => console.error(`::error::${p}`));
    fail(`Relay directory rejected: ${problems.length} problem(s)`);
  }

  const sha256 = crypto.createHash("sha256").update(text).digest("hex");

  console.log(`Rows           : ${rows.length}`);
  console.log(`Unique relays  : ${hosts.size}`);
  console.log(`Exact repeats  : ${duplicates}`);
  if (added !== null) console.log(`Added/removed  : +${added} / -${removed}`);
  console.log(`SHA-256        : ${sha256}`);

  if (args["github-output"]) {
    fs.appendFileSync(
      args["github-output"],
      [
        `rows=${rows.length}`,
        `unique_relays=${hosts.size}`,
        `added=${added ?? 0}`,
        `removed=${removed ?? 0}`,
        `sha256=${sha256}`,
        "",
      ].join("\n"),
    );
  }
}

main();
