#!/usr/bin/env node
// Verifies that every vendored third-party binary in the tree still matches the
// hash recorded in vendor.lock.json.
//
//   node scripts/verify-vendored.js            check the tree against the lock
//   node scripts/verify-vendored.js --write     record the current tree as the lock
//
// Why this exists. `ios/Frameworks/arti.xcframework` is roughly 35 MB of
// prebuilt static library that we did not compile, committed straight into the
// repository and shipped inside the iOS app. Nobody reviews a binary diff, and
// git alone will not tell you that the bytes changed for a reason: a swapped
// blob looks exactly like a legitimate update in a pull request summary.
//
// This does NOT prove the binary is trustworthy. It proves it has not changed
// without someone deliberately re-recording it, which is the failure mode that
// can otherwise pass unnoticed. Building Arti from pinned upstream source is
// the real fix and is tracked in docs/dev/PROGRESS.md; this is the cheap half
// that closes the silent-swap gap today.

const { createHash } = require("crypto");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const LOCK_FILE = "vendor.lock.json";

// Directories whose entire tracked contents are third-party artifacts. Every
// tracked file underneath is hashed, so a new file appearing is caught too:
// adding a file is as effective an attack as modifying one, and a manifest that
// only lists what it already knows about would miss it.
const VENDORED_PATHS = ["ios/Frameworks"];

function trackedFiles(prefix) {
  const out = execFileSync("git", ["ls-files", "-z", "--", prefix], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  return out.split("\0").filter((f) => f.length > 0);
}

function sha256(file) {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function currentTree() {
  const entries = {};
  for (const prefix of VENDORED_PATHS) {
    for (const file of trackedFiles(prefix)) {
      // Posix separators so the lock file is identical on every platform.
      entries[file.split(path.sep).join("/")] = sha256(file);
    }
  }
  return entries;
}

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(1);
}

function main() {
  const write = process.argv.includes("--write");
  const tree = currentTree();
  const names = Object.keys(tree).sort();

  if (names.length === 0) {
    fail(`No tracked files under ${VENDORED_PATHS.join(", ")}`);
  }

  if (write) {
    const lock = { files: {} };
    for (const name of names) lock.files[name] = tree[name];
    fs.writeFileSync(LOCK_FILE, JSON.stringify(lock, null, 2) + "\n");
    console.log(`Recorded ${names.length} vendored file(s) in ${LOCK_FILE}.`);
    return;
  }

  if (!fs.existsSync(LOCK_FILE)) {
    fail(
      `${LOCK_FILE} is missing. Run: node scripts/verify-vendored.js --write`,
    );
  }

  let lock;
  try {
    lock = JSON.parse(fs.readFileSync(LOCK_FILE, "utf8"));
  } catch (err) {
    fail(`${LOCK_FILE} is not valid JSON: ${err.message}`);
  }
  const recorded = lock.files ?? {};

  const problems = [];
  for (const name of names) {
    if (recorded[name] === undefined) {
      problems.push(`${name}: present in the tree but not in ${LOCK_FILE}`);
    } else if (recorded[name] !== tree[name]) {
      problems.push(
        `${name}: hash changed\n    expected ${recorded[name]}\n    found    ${tree[name]}`,
      );
    }
  }
  for (const name of Object.keys(recorded)) {
    if (tree[name] === undefined) {
      problems.push(
        `${name}: recorded in ${LOCK_FILE} but missing from the tree`,
      );
    }
  }

  if (problems.length > 0) {
    console.error("Vendored binaries do not match the recorded hashes.\n");
    for (const p of problems) console.error(`  ${p}`);
    console.error(
      `\nIf this change is intentional, re-record it in the same commit that` +
        ` updates the binary:\n  node scripts/verify-vendored.js --write\n`,
    );
    fail(`${problems.length} vendored file(s) failed verification`);
  }

  console.log(
    `Verified ${names.length} vendored file(s) against ${LOCK_FILE}.`,
  );
}

main();
