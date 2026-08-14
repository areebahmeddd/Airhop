#!/usr/bin/env node
// Writes a SHA-256 manifest of every git-tracked file, for publishing with a
// release so anyone can prove the source they hold is the source that shipped.
//
//   node scripts/source-manifest.js --output airhop-v1.0.0-sources.sha256
//                                   [--tag v1.0.0]
//
// Output is plain `sha256sum` format, so verification needs no tooling from here:
//
//   sha256sum -c airhop-v1.0.0-sources.sha256
//
// Comment lines are ignored by sha256sum, which is what lets the file carry its
// own instructions.
//
// The completeness rule, which is the part that is easy to get wrong.
// `sha256sum -c` only checks the files the manifest LISTS. A build compiles
// every file PRESENT. So a hostile copy passes a hash check by ADDING a file
// rather than modifying one, and the added file is compiled in. Verifying the
// hashes is therefore only half the check; the other half is proving no extra
// files exist. The manifest header spells that out, because a verification step
// that misses it is worse than none: it produces confidence without coverage.

const { createHash } = require("crypto");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    if (!key.startsWith("--")) {
      console.error(`::error::Unexpected argument: ${key}`);
      process.exit(1);
    }
    args[key.slice(2)] = argv[i + 1];
  }
  return args;
}

function git(...args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.output) {
    console.error("::error::Missing --output");
    process.exit(1);
  }

  const tag = args.tag ?? git("describe", "--tags", "--always");
  const commit = git("rev-parse", "HEAD");

  const files = git("ls-files", "-z")
    .split("\0")
    .filter((f) => f.length > 0)
    .map((f) => f.split(path.sep).join("/"))
    .sort();

  const lines = [
    `# Airhop source manifest`,
    `# tag:    ${tag}`,
    `# commit: ${commit}`,
    `# files:  ${files.length}`,
    `#`,
    `# Verify the contents of the files listed here:`,
    `#   sha256sum -c ${path.basename(args.output)}`,
    `#`,
    `# Then verify that nothing EXTRA is present, which the line above cannot`,
    `# tell you. The build compiles every file in the tree, not only the ones`,
    `# listed here, so an added file passes a hash check and still changes the`,
    `# build. From a git clone:`,
    `#   git fetch --tags && git checkout ${tag} && git status --porcelain`,
    `# That must print nothing. From a tarball, compare the file list instead:`,
    `#   diff <(find . -type f | sed 's|^\\./||' | sort) \\`,
    `#        <(grep -v '^#' ${path.basename(args.output)} | awk '{print $2}' | sort)`,
    `#`,
  ];

  for (const file of files) {
    const hash = createHash("sha256")
      .update(fs.readFileSync(file))
      .digest("hex");
    // Two spaces is the binary-mode separator sha256sum expects.
    lines.push(`${hash}  ${file}`);
  }

  fs.writeFileSync(args.output, lines.join("\n") + "\n");
  console.log(`Wrote ${files.length} file hashes to ${args.output}.`);
}

main();
