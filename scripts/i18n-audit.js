// Reports user-facing strings that are still hardcoded in English.
//
//   npm run i18n:audit              summary per file, worst first
//   npm run i18n:audit -- --list    every remaining string, with line numbers
//   npm run i18n:audit -- --max 40  fail if more than N remain (CI ratchet)
//   npm run i18n:audit -- --unused  keys in the catalog nothing references
//
// The two directions of the same question. `--max` counts copy that has not
// reached the catalog; `--unused` counts catalog entries no longer reached by
// any code. Both drift silently otherwise: the first leaves a screen unable to
// be translated at all, the second leaves a translator working on a string
// nobody will ever read.
//
// Extraction across ~90 files is not one commit, and "how much is left" should
// be a number in CI rather than a guess in a standup. `--max` is a ratchet:
// set it to today's count, and any commit that adds a hardcoded string fails
// until it is either extracted or the ceiling is deliberately raised.
//
// This is a heuristic, not a compiler. It looks for string literals and JSX
// text that read like display copy: a capitalised word or a run of words. It
// deliberately ignores the things that must NOT be translated, listed in
// SKIP_FILES below, and anything that looks like an identifier, a URL, a style
// value or a protocol constant. False positives are cheap (add to IGNORE);
// false negatives are the reason this is a floor, not a guarantee.

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const ROOT = path.join(__dirname, "..");

// Translations evaluated at module load, which freeze in whichever language the
// app started in.
//
// This is the one i18n bug the type system cannot see and a screenshot will not
// show you: `const SCOPES = { tag: t("chat.scope.mesh") }` type-checks, renders
// correctly, and is simply wrong the moment somebody changes language, because
// the module was evaluated once at import. It has to be a key table the
// component translates on render instead.
//
// Found 25 of these the first time it ran, across four files, all written by
// hand and all invisible in review.
// /
function frozenTranslations(files) {
  const found = [];
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    if (!/[^\w.][tT]\(/.test(src)) continue;
    const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
    (function visit(node) {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        /^[tT]$/.test(node.expression.text)
      ) {
        let parent = node.parent;
        let insideFunction = false;
        while (parent) {
          if (
            ts.isFunctionDeclaration(parent) ||
            ts.isArrowFunction(parent) ||
            ts.isFunctionExpression(parent) ||
            ts.isMethodDeclaration(parent)
          ) {
            insideFunction = true;
            break;
          }
          parent = parent.parent;
        }
        if (!insideFunction) {
          const { line } = sf.getLineAndCharacterOfPosition(node.getStart());
          found.push(
            `${path.relative(ROOT, file)}:${String(line + 1)}  ${node.getText().slice(0, 60)}`,
          );
        }
      }
      ts.forEachChild(node, visit);
    })(sf);
  }
  return found;
}

// Files whose strings are deliberately not translated. Each needs a reason.
const SKIP_FILES = [
  // Identity derivation. The word lists are wire-visible: the same peer must
  // resolve to the same name on every device and in bitchat.
  "src/utils/username.ts",
  // Licence texts, quoted verbatim in the original.
  "src/data/licenses.ts",
  // Legal copy. English is the authoritative version; the reader chrome around
  // it is translated, the clauses are not. See docs/spec/ARCHITECTURE.md.
  "src/features/settings/sections/terms-screen.tsx",
  "src/features/settings/sections/privacy-screen.tsx",
  // Vendored relay directory and release metadata: data, not copy.
  "src/data/relays.ts",
  "src/data/releases.ts",
  // The catalog itself.
  "src/i18n/",
  // Protocol internals. Every string in these is a `throw new Error()` aimed at
  // whoever is reading a stack trace ("Noise: replay detected",
  // "contact-exchange: buffer truncated"), never at a user. Nothing renders
  // them: the two places that do show a raw error string (wallet-screen,
  // ecash-transfer) are showing a message authored by a remote mint, which is
  // pass-through by policy. Translating exception text would make debugging a
  // field report harder, not easier.
  "src/core/",
  "src/bridge/",
];

const SKIP_DIRS = ["__tests__", "__mocks__", "node_modules"];

// Literals that look like copy but are not.
const IGNORE = new Set([
  // Byte-size unit symbols. Not words: they are the same in every locale the
  // app ships, and format.ts already localises the digits and the decimal
  // separator around them, which is the part that actually varies.
  "KiB",
  "MiB",
  "Ed25519 + X25519",
  "AES-256",
  "GitHub",
  "App Store",
  "Play Store",
  "GitHub Sponsors",
  "Areeb Ahmed",
  // The license's formal name, substituted into `released_under` as a link.
  // Same rule as the store names above: SPDX identifiers are not localised, and
  // a translated "MIT License" names a license that does not exist.
  "MIT License",
  // Error class names, assigned to `this.name` so a stack trace reads well.
  "WalletError",
  "AttachmentTooLargeError",
  // The transmitted /slap payload. This one must NEVER be extracted: bitchat
  // recognises an incoming emote by matching these exact English words, so a
  // translated variant stops the two apps understanding each other. See the
  // do-not-translate table in .github/skills/i18n.md.
  "around a bit with a large trout",
  // An invariant breach in the offline coin selector, thrown at a stack trace
  // and never rendered. Same rule as the `src/core/` skip above: translating
  // exception text makes a field report harder to read, not easier.
  "offline selection did not map back to stored proofs (matched",
  ", covering",
  // The same invariant on the melt side, thrown where a short selection would
  // otherwise under-fund a Lightning payment.
  "melt selection did not map back to stored proofs",
]);

// JSX text, anchored on a closing tag. Without requiring the `</`, a generic
// type annotation (`Record<string, Promise<void>>`) reads as text between angle
// brackets. Filtering those out afterwards with a "looks like a type name" rule
// is what silently swallowed every single-word label in the app: "Codename",
// "Version", "Appearance", "Close". Anchoring here is exact instead of clever.
const JSX_TEXT = />\s*([A-Z][^<>{}\n]{2,200}?)\s*<\//g;

// The string and template literals on a line, plus the line with any trailing
// `//` comment removed.
//
// A regex cannot do this. `<Feather name="x" size={22} color="#FFF" />` makes
// /"([^"]{2,})"/ match the gap *between* two literals (` size={22} color=`),
// because the engine is free to start at the closing quote of the first one.
// Every such false positive looked like real copy and had to be explained away
// by hand. Scanning left to right, tracking whether the scanner is inside a literal,
// is both correct and simpler to reason about.
// /
function scanLiterals(line) {
  const literals = [];
  let code = "";
  let i = 0;
  while (i < line.length) {
    const ch = line[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let value = "";
      i += 1;
      while (i < line.length && line[i] !== quote) {
        if (line[i] === "\\") {
          value += line[i + 1] ?? "";
          i += 2;
          continue;
        }
        value += line[i];
        i += 1;
      }
      // An unterminated literal means a multi-line template; nothing on this
      // line is a complete literal, so give up rather than guess.
      if (i >= line.length) return { literals, code };
      i += 1;
      literals.push(value);
      continue;
    }
    if (ch === "/" && line[i + 1] === "/") break; // trailing comment
    code += ch;
    i += 1;
  }
  return { literals, code };
}

function shouldSkip(rel) {
  const unix = rel.split(path.sep).join("/");
  return SKIP_FILES.some((s) => unix === s || unix.startsWith(s));
}

function looksLikeCopy(value) {
  if (IGNORE.has(value)) return false;
  if (!/[A-Za-z]{2}/.test(value)) return false;
  // Identifiers, keys, paths, css-ish values, protocol constants.
  if (/^[a-z0-9_\-./#@:%+*]+$/.test(value)) return false;
  if (/^[A-Z0-9_]+$/.test(value)) return false;
  // Native event names crossing the bridge: "AirhopBLE.linkConnected".
  if (/^[A-Z]\w*\.\w+$/.test(value)) return false;
  // A bundled font family: "JetBrainsMono_400Regular".
  if (/^[A-Za-z]+_\d+\w*$/.test(value)) return false;
  if (/^(https?|wss?|mailto|data|file):/.test(value)) return false;
  if (/^[0-9a-f]{8,}$/i.test(value)) return false;
  // Already extracted: a translation key.
  if (/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/.test(value)) return false;
  // Needs a space or a capitalised opening, i.e. it reads like a phrase.
  return value.includes(" ") || /^[A-Z]/.test(value);
}

function collect(file) {
  const rel = path.relative(ROOT, file);
  if (shouldSkip(rel)) return [];
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const hits = [];
  // Block-comment state, so the body of a `/* ... */` or a JSX `{/* ... */}` is
  // skipped too. Only the opening line of those carries a marker, and the prose
  // inside is exactly the kind of text that reads like display copy.
  let inBlock = false;
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const opens = /\{?\/\*/.test(line);
    const closes = /\*\//.test(line);
    const wasInBlock = inBlock;
    if (opens && !closes) inBlock = true;
    else if (closes) inBlock = false;
    if (wasInBlock || opens) return;
    if (/^(\/\/|\*|\/\*)/.test(trimmed)) return;
    if (/^import\b/.test(trimmed)) return;
    // A fragment of a multi-line template literal or expression, which the
    // line-based patterns below would otherwise read as prose.
    if (/\$\{/.test(line) || /^[)}\]+.]/.test(trimmed)) return;
    const seen = new Set();
    const { literals, code } = scanLiterals(line);
    const candidates = [...literals];
    JSX_TEXT.lastIndex = 0;
    let match;
    while ((match = JSX_TEXT.exec(code)) !== null) candidates.push(match[1]);

    for (const raw of candidates) {
      const value = raw.trim();
      if (seen.has(value)) continue;
      seen.add(value);
      if (!looksLikeCopy(value)) continue;
      hits.push({ line: index + 1, value });
    }
  });
  return hits.map((h) => ({ ...h, file: rel }));
}

// The two shapes the line scanner above cannot see, found on the AST instead.
//
//   1. JSX text that wraps. JSX_TEXT is applied per line and forbids a newline
//      inside the match, and prettier wraps at 80 columns, so any sentence long
//      enough to be worth translating is exactly the one that escapes it.
//   2. Template literals. The line scanner bails on any line containing `${`,
//      which is right for a continuation line and wrong for the literal itself.
//
// A node knows its own extent, so neither problem exists here. Additive:
// everything still passes looksLikeCopy and SKIP_FILES, and results are deduped
// against the line scanner.
// /
function collectAst(file) {
  const rel = path.relative(ROOT, file);
  if (shouldSkip(rel)) return [];
  const src = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
  const hits = [];
  const push = (node, text, { spaced = false } = {}) => {
    // JSX text carries its own indentation and line breaks; a translator gets
    // one sentence, so compare and report the collapsed form.
    const value = text.replace(/\s+/g, " ").trim();
    // The exemption list wins over every rule below, including `spaced`.
    if (IGNORE.has(value)) return;
    // `spaced` means the raw chunk had whitespace against a word, which inside a
    // template literal only happens when prose is being concatenated with an
    // interpolated value. Without it a one-word chunk like " unconfirmed" is
    // discarded by looksLikeCopy's identifier rule, which is what let
    // `${n} unconfirmed`, `${n} added` and `${n} transfers` ship untranslated.
    if (!(spaced && /[A-Za-z]{2}/.test(value)) && !looksLikeCopy(value)) return;
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    hits.push({ line: line + 1, value, file: rel });
  };
  (function visit(node) {
    if (ts.isJsxText(node)) {
      push(node, node.text);
    } else if (ts.isTemplateExpression(node)) {
      // A message built for a stack trace is not copy. `t()` is for users,
      // `Error` is for whoever reads the crash, and an invariant breach has no
      // translation worth writing. Only checked here because the template case
      // is the shape these take; a one-line Error string is caught by the line
      // scanner and belongs in IGNORE if it is ever deliberate.
      if (isDeveloperMessage(node)) {
        ts.forEachChild(node, visit);
        return;
      }
      // The literal chunks either side of each ${...}. The expressions between
      // them are code and are visited normally.
      push(node, node.head.text, { spaced: isSpacedChunk(node.head.text) });
      for (const span of node.templateSpans) {
        push(node, span.literal.text, {
          spaced: isSpacedChunk(span.literal.text),
        });
      }
    }
    ts.forEachChild(node, visit);
  })(sf);
  return hits;
}

// Whether this node sits inside `new Error(...)`, i.e. it is aimed at a
// developer reading a stack trace rather than at a user reading a screen.
function isDeveloperMessage(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isNewExpression(p) && ts.isIdentifier(p.expression)) {
      if (/Error$/.test(p.expression.text)) return true;
    }
    // Stop at the enclosing statement: anything further up is unrelated.
    if (ts.isStatement(p)) return false;
  }
  return false;
}

// Whether a template chunk is prose glued to an interpolated value rather than
// part of an identifier, a path or a key. A word with whitespace on either side
// of it is the tell: `"dm:"` in `dm:${id}` has none, `" unconfirmed"` in
// `${n} unconfirmed` does.
function isSpacedChunk(text) {
  return /(^|\s)[A-Za-z]{2,}(\s|$)/.test(text) && /^\s|\s$/.test(text);
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.includes(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (/\.tsx?$/.test(entry.name)) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

const args = process.argv.slice(2);
const list = args.includes("--list");
const unusedOnly = args.includes("--unused");
const maxIndex = args.indexOf("--max");
const max = maxIndex === -1 ? null : Number(args[maxIndex + 1]);

const files = [path.join(ROOT, "App.tsx"), ...walk(path.join(ROOT, "src"))];

if (unusedOnly) {
  const { readLocale } = require("./i18n-lib");
  const en = readLocale("en");
  const keys = [...Object.keys(en.strings), ...Object.keys(en.plurals)];
  // The catalog files themselves obviously mention every key, so they are not
  // evidence of use.
  // A key is used when it appears as a string literal, not when a comment
  // mentions it, so this walks the AST rather than scanning raw text.
  //
  // Not by stripping comments with a regex: one `/*` inside a line comment
  // makes the block pattern run to the next `*/` anywhere later in the file,
  // taking live code with it.
  const used = new Set();
  // Keys assembled at runtime (`theme.${mode}`) are matched by prefix, so a
  // dynamic family is not reported as 30 dead keys.
  const prefixes = [];
  for (const file of files) {
    if (file.includes(path.join("i18n", "locales"))) continue;
    const sf = ts.createSourceFile(
      file,
      fs.readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    (function visit(node) {
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
        used.add(node.text);
      else if (ts.isTemplateExpression(node) && node.head.text.includes("."))
        prefixes.push(node.head.text);
      ts.forEachChild(node, visit);
    })(sf);
  }

  const orphans = keys.filter(
    (key) => !used.has(key) && !prefixes.some((p) => key.startsWith(p)),
  );

  console.log(`Catalog: ${String(keys.length)} keys.\n`);
  console.log(`Unreferenced (${String(orphans.length)}):`);
  for (const key of orphans) console.log(`  ${key}`);
  if (orphans.length > 0) {
    console.log(
      "\nEach is either shared vocabulary waiting for the screen that will use it,\n" +
        "or dead weight a translator should not be asked to work on. Decide which.",
    );
  }
  process.exit(0);
}

// Deduped: a single-line JSX label or template is reachable by both passes.
const seenHits = new Set();
const all = [...files.flatMap(collect), ...files.flatMap(collectAst)].filter(
  (hit) => {
    const id = `${hit.file}:${String(hit.line)}:${hit.value}`;
    if (seenHits.has(id)) return false;
    seenHits.add(id);
    return true;
  },
);

const byFile = new Map();
for (const hit of all) {
  if (!byFile.has(hit.file)) byFile.set(hit.file, []);
  byFile.get(hit.file).push(hit);
}

const ranked = [...byFile.entries()].sort((a, b) => b[1].length - a[1].length);

if (list) {
  for (const [file, hits] of ranked) {
    console.log(`\n${file}`);
    for (const hit of hits)
      console.log(`  ${String(hit.line).padStart(5)}  ${hit.value}`);
  }
} else {
  for (const [file, hits] of ranked) {
    console.log(`${String(hits.length).padStart(5)}  ${file}`);
  }
}

console.log(
  `\n${String(all.length)} hardcoded string(s) across ${String(byFile.size)} file(s).`,
);

// Always checked, and always a hard failure: unlike the count above, this is
// not a backlog to work through, it is a bug.
const frozen = frozenTranslations(files);
if (frozen.length > 0) {
  console.error(
    `\n${String(frozen.length)} translation(s) evaluated at module load, which freeze in\n` +
      "the language the app started in. Move them to a key table the component\n" +
      "translates on render (see CHANNEL_SCOPE in features/chat/channel-list.tsx):\n",
  );
  for (const f of frozen) console.error(`  ${f}`);
  process.exit(1);
}

if (max !== null && all.length > max) {
  console.error(
    `\nCeiling is ${String(max)}. Extract the new strings, or raise the ceiling deliberately.`,
  );
  process.exit(1);
}
