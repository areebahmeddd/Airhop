#!/usr/bin/env node
// Rejects invisible characters in tracked text files.
//
//   node scripts/check-invisibles.js
//
// Why this exists. `src/core/payments/cashu.ts` once carried literal control
// bytes where escape sequences were meant: a character class intended as
// `[\x00-\x1f]` held the raw bytes themselves, and a word boundary held a
// backspace. The expressions silently matched nothing, so a mint-safety check
// accepted every mint it was asked about. The same bytes made git treat the
// file as binary, so no diff of it was ever readable in review. A money-handling
// file became unreviewable and unenforced at once, and nothing in the toolchain
// objected.
//
// The wider case is Trojan Source (CVE-2021-42574): bidirectional overrides and
// zero-width characters let source read one way to a human and compile another.
// Both failures share a root, which is why one check covers them. A character
// that cannot be seen cannot be reviewed.
//
// Escape sequences are unaffected. Written in source, an escape is a backslash
// followed by printable characters. Only the literal byte is refused.

const { execFileSync } = require("child_process");
const fs = require("fs");

// Text formats where an invisible character is never intentional. Binary and
// generated formats are excluded rather than trusted: they legitimately hold
// arbitrary bytes, and flagging them would train people to ignore this check.
const TEXT_FILE =
  /\.(ts|tsx|js|jsx|mjs|cjs|json|md|ya?ml|kt|swift|java|h|m|mm|rb|sh|gradle|pro|xml|plist|css|html)$/i;

// Paths holding third-party or generated content this repository does not
// author and must not rewrite.
const SKIPPED = [/^ios\/Frameworks\//, /^assets\/data\//];

// Ranges are numeric because this file is subject to its own rule: written
// literally the characters would be invisible here, leaving the check itself
// unreadable. Tab, newline and carriage return are the only invisibles a text
// file needs, and are deliberately absent below.
const FORBIDDEN = [
  {
    name: "control character",
    ranges: [[0x00, 0x08], [0x0b, 0x0c], [0x0e, 0x1f], [0x7f]],
  },
  {
    name: "bidirectional override",
    ranges: [
      [0x202a, 0x202e],
      [0x2066, 0x2069],
    ],
  },
  {
    name: "zero-width character",
    ranges: [[0x200b, 0x200f], [0x2060], [0xfeff]],
  },
];

function forbiddenName(codePoint) {
  for (const { name, ranges } of FORBIDDEN) {
    for (const [low, high = low] of ranges) {
      if (codePoint >= low && codePoint <= high) return name;
    }
  }
  return null;
}

function trackedFiles() {
  const out = execFileSync("git", ["ls-files"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return out
    .trim()
    .split("\n")
    .filter((file) => TEXT_FILE.test(file))
    .filter((file) => !SKIPPED.some((skip) => skip.test(file)));
}

// Reported as file:line:column with the code point named, so the fix is
// locatable in an editor that renders the character as nothing at all.
function findingsIn(file) {
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    return [];
  }

  const findings = [];
  text.split(/\r?\n/).forEach((line, index) => {
    for (let column = 0; column < line.length; column++) {
      const name = forbiddenName(line.charCodeAt(column));
      if (!name) continue;
      const hex = line.charCodeAt(column).toString(16).toUpperCase();
      findings.push({
        file,
        line: index + 1,
        column: column + 1,
        detail: `${name} U+${hex.padStart(4, "0")}`,
      });
    }
  });
  return findings;
}

function main() {
  const files = trackedFiles();
  const findings = files.flatMap(findingsIn);

  if (findings.length === 0) {
    console.log(`No invisible characters in ${files.length} tracked files.`);
    return;
  }

  for (const { file, line, column, detail } of findings) {
    console.error(
      `::error file=${file},line=${line},col=${column}::${detail}. ` +
        `Write the escape sequence instead of the literal byte.`,
    );
  }
  console.error(
    `\n${findings.length} invisible character(s) found. See the header of ` +
      `scripts/check-invisibles.js for why these are refused.`,
  );
  process.exit(1);
}

main();
