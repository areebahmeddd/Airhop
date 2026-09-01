#!/usr/bin/env node
// Verifies that every vendored third-party binary in the tree still matches the
// hash recorded in vendor.lock.json.
//
//   node scripts/verify-vendored.js            check the tree against the lock
//   node scripts/verify-vendored.js --write     record the current tree as the lock
//
// Why this exists. The embedded Tor client ships as compiled binaries committed
// straight into the repository: a static library inside the iOS app, and one
// shared object per ABI inside the Android app. Nobody reviews a binary diff,
// and git alone will not tell you the bytes changed for a reason. A swapped blob
// looks exactly like a legitimate update in a pull request summary.
//
// These are no longer third-party artifacts. `native/arti/` builds them from
// pinned Arti source under a pinned toolchain, so what this guards has changed
// shape: not "did somebody swap a blob we cannot reproduce" but "does the
// committed binary still correspond to the source and toolchain that claim to
// produce it". A binary that moves without `native/arti/` moving is either a
// rebuild nobody recorded or a substitution, and both should stop a pull
// request.
//
// This still does not prove a binary is trustworthy. Reproducing it does, and
// that is what native/arti/build-in-container.sh is for. This is the cheap
// check that runs on every pull request.

const { createHash } = require("crypto");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const LOCK_FILE = "vendor.lock.json";

// Directories whose entire tracked contents are third-party artifacts. Every
// tracked file underneath is hashed, so a new file appearing is caught too:
// adding a file is as effective an attack as modifying one, and a manifest that
// only lists what it already knows about would miss it.
const VENDORED_PATHS = ["ios/Frameworks", "android/app/src/main/jniLibs"];

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
  const missing = [];
  for (const prefix of VENDORED_PATHS) {
    for (const file of trackedFiles(prefix)) {
      // Git still lists a file that has been deleted from the working tree but
      // whose deletion has not been staged, which is the ordinary state after
      // removing a binary by hand. Reading it throws a bare ENOENT and a stack
      // trace that says nothing about what to do, so collect these and say it
      // properly below.
      if (!fs.existsSync(file)) {
        missing.push(file);
        continue;
      }
      // Posix separators so the lock file is identical on every platform.
      entries[file.split(path.sep).join("/")] = sha256(file);
    }
  }
  if (missing.length > 0) {
    console.error("Tracked binaries are missing from the working tree.\n");
    for (const file of missing) console.error(`  ${file}`);
    fail(
      "Stage the deletions (git add -A) if this is deliberate, or restore the files.",
    );
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
