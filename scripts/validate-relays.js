#!/usr/bin/env node
// Validates a candidate relay directory CSV before it replaces the vendored
// copy at assets/data/nostr_relays.csv. The directory is compiled into the app
// bundle, so a bad row ships to every user. Fails closed.
//
// It also reports which hosts entered and left, because the counts alone cannot
// show a hostile row arriving in the pull request.
//
//   node scripts/validate-relays.js --input <candidate.csv>
//                                   [--baseline assets/data/nostr_relays.csv]
//                                   [--github-output $GITHUB_OUTPUT]

const crypto = require("crypto");
const fs = require("fs");
const { canonicalRelayUrl } = require("./relay-url.js");

const HEADER = "Relay URL,Latitude,Longitude";

const MIN_ROWS = 100;
const MAX_ROWS = 5000;
const MIN_BYTES = 1024;
const MAX_BYTES = 1024 * 1024;

// Upstream swings ~6% day to day, so a double-digit delta is normal.
const MAX_COUNT_DELTA = 0.2;
const MIN_RETAINED = 0.7;

// Hosts named per direction before the list is summarised instead.
const MAX_LISTED_HOSTS = 40;

// RFC 1123 host. Rejects schemes, paths, credentials, wildcards and non-ASCII,
// and requires at least one dot so a bare name like "localhost" cannot pass.
const HOST =
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;
const MAX_HOST_LENGTH = 253;
// A single DNS label is capped at 63 octets (RFC 1035). The host pattern above
// bounds the whole name but not the parts, so a 200-character label passes it.
const MAX_LABEL_LENGTH = 63;

// Dotted-quad IPv4, which the host pattern accepts because digits and dots are
// legal in a hostname. A relay directory must carry names, not addresses: an
// address cannot be TLS-verified by hostname, and the ones that would actually
// hurt (127.0.0.1, 10.x, 192.168.x, 0.0.0.0) all match the pattern exactly.
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;

// Anything in the C0/C1 ranges plus DEL. NUL is already refused when the file is
// read; these are the rest, which survive a UTF-8 decode and would be carried
// into the generated module and shipped. Written as a scan rather than a regex
// so the control characters stay out of the source file itself.
function hasControlChars(value) {
  for (const ch of value) {
    const code = ch.codePointAt(0);
    if (code <= 0x1f || (code >= 0x7f && code <= 0x9f)) return true;
  }
  return false;
}

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

    if (hasControlChars(line)) {
      reject(`${at}: contains control characters`);
      return;
    }
    // Fields are split on a bare comma, which is only correct while no field is
    // quoted. Refuse the quoted form rather than half-supporting it: a quoted
    // field containing a comma would silently shift every value one place left.
    if (line.includes('"')) {
      reject(`${at}: quoted CSV fields are not supported`);
      return;
    }

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
    if (host.split(".").some((label) => label.length > MAX_LABEL_LENGTH)) {
      reject(
        `${at}: DNS label longer than ${MAX_LABEL_LENGTH} in "${rawHost}"`,
      );
      return;
    }
    // A dotted quad passes the hostname pattern, so it has to be refused by
    // name. Loopback and private ranges are the ones that matter: a relay the
    // app dials on every launch must not be able to point at the device itself
    // or at something inside whoever's network compiled the directory.
    if (IPV4.test(host)) {
      reject(
        `${at}: relay host must be a domain name, not an IP ("${rawHost}")`,
      );
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

    // Canonical key, so "host" and "host:443" count as one relay. Counting raw
    // rows would measure the churn thresholds below against ~25% duplicates.
    const key = canonicalRelayUrl(rawHost) ?? rawHost.toLowerCase();
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
  let addedHosts = null;
  let removedHosts = null;
  if (args.baseline && fs.existsSync(args.baseline)) {
    const baselineRows = parseCsv(
      fs.readFileSync(args.baseline, "utf8"),
      "baseline",
    );
    if (baselineRows !== null && baselineRows.length > 0) {
      // Same key as the candidate, or the deltas compare different things.
      const before = new Set(
        baselineRows.map((line) => {
          const rawHost = line.split(",")[0].trim();
          return canonicalRelayUrl(rawHost) ?? rawHost.toLowerCase();
        }),
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

      // Sorted so the reported list is stable when upstream reorders rows.
      addedHosts = [...hosts].filter((h) => !before.has(h)).sort();
      removedHosts = [...before].filter((h) => !hosts.has(h)).sort();
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
  if (addedHosts !== null) {
    console.log(
      `Added/removed  : +${addedHosts.length} / -${removedHosts.length}`,
    );
  }
  console.log(`SHA-256        : ${sha256}`);

  if (args["github-output"]) {
    fs.appendFileSync(
      args["github-output"],
      [
        `rows=${rows.length}`,
        `unique_relays=${hosts.size}`,
        `added=${addedHosts?.length ?? 0}`,
        `removed=${removedHosts?.length ?? 0}`,
        `sha256=${sha256}`,
        hostList("added_hosts", addedHosts),
        hostList("removed_hosts", removedHosts),
        "",
      ].join("\n"),
    );
  }
}

// A multi-line GITHUB_OUTPUT value, one host per line. Every listed host has
// passed the RFC 1123 pattern above, so none can collide with the delimiter.
function hostList(name, hosts) {
  let lines;
  if (hosts === null) {
    lines = ["(no baseline to compare against)"];
  } else if (hosts.length === 0) {
    lines = ["(none)"];
  } else {
    lines = hosts.slice(0, MAX_LISTED_HOSTS);
    if (hosts.length > MAX_LISTED_HOSTS) {
      lines.push(`... and ${hosts.length - MAX_LISTED_HOSTS} more`);
    }
  }
  return [`${name}<<RELAY_HOST_LIST`, ...lines, "RELAY_HOST_LIST"].join("\n");
}

main();
