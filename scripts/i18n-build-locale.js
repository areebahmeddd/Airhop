#!/usr/bin/env node
// Builds a locale catalog from a flat translation map, and refuses to build a
// broken one.
//
//   node scripts/i18n-build-locale.js <code> <translations.json>
//
// Why this exists rather than hand-writing the file.
//
// A catalog is 1,528 strings and 27 plural keys. Hand-writing that thirty times
// puts every mechanical property of the file, key completeness, key ordering,
// escaping, section structure, at the mercy of care, and care over 45,000 lines
// is not a control. `tsc` catches a missing key, but only after the fact, and it
// says nothing about a placeholder that got dropped in translation or a protocol
// token a translator localized.
//
// So the mechanical parts are mechanical. The translator supplies a flat
// `{ key: text }` map and nothing else; this reads `en.ts` for the key order and
// the section comments, checks the translation against it, and emits a file that
// is complete and correctly ordered by construction. What it cannot check is
// whether the words are right, which is the only thing a person should be
// spending attention on.
//
// Checks, all fatal:
//
//   - every English key present, no extra keys
//   - no empty strings
//   - placeholders match English exactly (any order, since reordering is the
//     whole point of naming them)
//   - plural forms are exactly the CLDR categories the language uses
//   - protocol identifiers carried through verbatim
//
// The emitted file is then formatted by prettier and checked by
// `catalog.test.ts` like any other, so this is a first line rather than the
// only one.

const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { LOCALES_DIR, readLocale } = require("./i18n-lib");

const ROOT = path.join(__dirname, "..");

// ---- Section structure, lifted from en.ts ----
//
// The section markers are what make a 2,200-line file navigable, so every
// catalog carries the same ones in the same places. Read from the English
// source rather than duplicated here, so they cannot drift.
function readLayout() {
  const source = fs.readFileSync(path.join(LOCALES_DIR, "en.ts"), "utf8");
  const lines = source.split(/\r?\n/);
  const layout = { strings: [], plurals: [] };
  let which = null;
  let pending = null;
  for (const line of lines) {
    if (/^export const strings/.test(line)) {
      which = "strings";
      continue;
    }
    if (/^export const plurals/.test(line)) {
      which = "plurals";
      continue;
    }
    if (which === null) continue;
    const section = /^\s*\/\/ ---- (.+) ----\s*$/.exec(line);
    if (section) {
      pending = section[1];
      continue;
    }
    const key = /^\s{2}"([a-z0-9_.]+)":/.exec(line);
    if (key) {
      layout[which].push({ key: key[1], section: pending });
      pending = null;
    }
  }
  return layout;
}

// ---- Rules ----

function placeholders(value) {
  return [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
}

// Machine tokens. Wherever English uses one, the translation must carry the
// same token through the same number of times, or the sentence names a channel
// or a command that does not exist.
const VERBATIM = [
  "#bluetooth",
  "/hug",
  "/slap",
  "/who",
  "/msg",
  "airhop://",
  "npub1",
];

// Proper nouns. Presence rather than count, because a language may drop or
// repeat a noun for agreement. "Lightning" is the one that actually gets
// translated, being an ordinary word in every language on the list.
const SURVIVES = [
  "Airhop",
  "bitchat",
  "Nostr",
  "Cashu",
  "Lightning",
  "Tor",
  "GitHub",
  "Ed25519",
  "X25519",
];

// Read PLURAL_CATEGORIES out of plurals.ts rather than restating it, so this
// and the runtime cannot disagree about what a language needs.
function readPluralCategories() {
  const file = path.join(ROOT, "src", "i18n", "plurals.ts");
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const out = {};
  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "PLURAL_CATEGORIES" &&
      node.initializer &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      for (const prop of node.initializer.properties) {
        if (!ts.isPropertyAssignment(prop)) continue;
        const key =
          ts.isStringLiteral(prop.name) || ts.isIdentifier(prop.name)
            ? prop.name.text
            : null;
        if (key === null || !ts.isArrayLiteralExpression(prop.initializer))
          continue;
        out[key] = prop.initializer.elements
          .filter((e) => ts.isStringLiteral(e))
          .map((e) => e.text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return out;
}

// Characters from a script the language does not write in, which in practice
// means a glyph that strayed in from another translation. Invisible to every
// other check: not a placeholder, not a protocol token, not a spelling mistake
// in any dictionary, and it renders as an ordinary glyph beside the rest.
//
// Only the CJK and Ethiopic blocks are checked, and only for languages that do
// not use them. That keeps the rule free of false positives on the Latin,
// Cyrillic, Arabic and Indic catalogs, which legitimately carry Latin protocol
// names.
const FOREIGN_SCRIPT = /[぀-ヿ㐀-䶿一-鿿가-힯ሀ-፿]/u;

// The languages that legitimately contain those blocks.
const CJK_LANGUAGES = new Set(["ja", "ko", "zh-Hans", "zh-Hant", "am"]);

function validate(code, english, translated, categories) {
  const errors = [];
  const checkScript = !CJK_LANGUAGES.has(code);

  const enKeys = Object.keys(english.strings);
  const trKeys = Object.keys(translated.strings ?? {});
  for (const key of enKeys) {
    if (!(key in (translated.strings ?? {})))
      errors.push(`missing string: ${key}`);
  }
  for (const key of trKeys) {
    if (!(key in english.strings)) errors.push(`unknown string: ${key}`);
  }

  for (const [key, value] of Object.entries(translated.strings ?? {})) {
    if (!(key in english.strings)) continue;
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`empty string: ${key}`);
      continue;
    }
    const want = placeholders(english.strings[key]).join(",");
    const got = placeholders(value).join(",");
    if (want !== got) {
      errors.push(`placeholders ${key}: expected [${want}], got [${got}]`);
    }
    for (const token of VERBATIM) {
      const inEnglish = english.strings[key].split(token).length - 1;
      const inTranslated = value.split(token).length - 1;
      if (inEnglish !== inTranslated) {
        errors.push(
          `token ${key}: expected ${inEnglish}x "${token}", got ${inTranslated}`,
        );
      }
    }
    for (const noun of SURVIVES) {
      const boundary = new RegExp(`\\b${noun}\\b`);
      if (boundary.test(english.strings[key]) && !boundary.test(value)) {
        errors.push(`proper noun ${key}: "${noun}" did not survive`);
      }
    }
    if (checkScript) {
      const stray = FOREIGN_SCRIPT.exec(value);
      if (stray !== null) {
        errors.push(
          `stray script ${key}: "${stray[0]}" (U+${stray[0].codePointAt(0).toString(16).toUpperCase()}) is not a ${code} character`,
        );
      }
    }
  }

  const wanted = [...(categories[code] ?? ["other"])].sort();
  for (const key of Object.keys(english.plurals)) {
    const forms = (translated.plurals ?? {})[key];
    if (forms === undefined) {
      errors.push(`missing plural: ${key}`);
      continue;
    }
    const got = Object.keys(forms).sort();
    if (got.join(",") !== wanted.join(",")) {
      errors.push(
        `plural ${key}: expected [${wanted.join(", ")}], got [${got.join(", ")}]`,
      );
    }
    for (const [category, value] of Object.entries(forms)) {
      if (typeof value !== "string" || value.trim().length === 0) {
        errors.push(`empty plural: ${key}.${category}`);
      }
    }
  }
  for (const key of Object.keys(translated.plurals ?? {})) {
    if (!(key in english.plurals)) errors.push(`unknown plural: ${key}`);
  }

  return errors;
}

// ---- Emit ----

function quote(value) {
  return JSON.stringify(value);
}

function emit(code, layout, translated, categories) {
  const lines = [];
  lines.push(`// ${code}: translated from src/i18n/locales/en.ts.`);
  lines.push("//");
  lines.push(
    "// Generated by scripts/i18n-build-locale.js, which guarantees the mechanical",
  );
  lines.push(
    "// half: every key present, in English's order, under English's section markers,",
  );
  lines.push(
    "// with placeholders and protocol tokens carried through. Edit it by hand from",
  );
  lines.push(
    "// here on; `catalog.test.ts` enforces the same rules on every change.",
  );
  lines.push("//");
  lines.push(
    "// The English file carries the reasoning behind each section. This one carries",
  );
  lines.push("// the words, and is meant to be read beside it.");
  lines.push("");
  lines.push('import type { Plurals, Strings } from "./types";');
  lines.push("");
  lines.push("export const strings: Strings = {");
  for (const { key, section } of layout.strings) {
    if (section) {
      lines.push("");
      lines.push(`  // ---- ${section} ----`);
    }
    lines.push(`  ${quote(key)}: ${quote(translated.strings[key])},`);
  }
  lines.push("};");
  lines.push("");
  lines.push("export const plurals: Plurals = {");
  const order = categories[code] ?? ["other"];
  for (const { key, section } of layout.plurals) {
    if (section) {
      lines.push("");
      lines.push(`  // ---- ${section} ----`);
    }
    lines.push(`  ${quote(key)}: {`);
    for (const category of order) {
      lines.push(
        `    ${category}: ${quote(translated.plurals[key][category])},`,
      );
    }
    lines.push("  },");
  }
  lines.push("};");
  lines.push("");
  lines.push(`export const ${identifier(code)} = { strings, plurals };`);
  lines.push("");
  return lines.join("\n");
}

// "pt-BR" and "zh-Hans" are not identifiers.
function identifier(code) {
  return code.replace(/-/g, "");
}

// ---- Main ----

const [code, jsonPath] = process.argv.slice(2);
if (!code || !jsonPath) {
  console.error("usage: i18n-build-locale.js <code> <translations.json>");
  process.exit(2);
}

const english = readLocale("en");
const translated = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const categories = readPluralCategories();

const errors = validate(code, english, translated, categories);
if (errors.length > 0) {
  console.error(`\n${code}: ${errors.length} problem(s), nothing written.\n`);
  for (const error of errors.slice(0, 60)) console.error(`  ${error}`);
  if (errors.length > 60) {
    console.error(`  ... and ${errors.length - 60} more`);
  }
  process.exit(1);
}

const layout = readLayout();
const out = path.join(LOCALES_DIR, `${code}.ts`);
fs.writeFileSync(out, emit(code, layout, translated, categories));
console.log(
  `${path.relative(ROOT, out)}: ${Object.keys(translated.strings).length} strings, ${Object.keys(translated.plurals).length} plural keys`,
);
