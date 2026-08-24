// Guards the strings the OS renders, which never reach `t()` and so are invisible
// to `catalog.test.ts`: the iOS permission prompts in `<code>.lproj/`, the
// Android foreground-service notice in `values-*/`, and the locale list Android
// 13's per-app picker reads.
//
//   npm run i18n:native
//
// Without it a language ships a complete catalog and still shows an English
// system dialog, silently. Swift needs no equivalent: its `reject()` messages are
// error codes JS branches on, not copy.
//
// Android picks `values-*` by system locale rather than by the in-app picker, so
// a phone set to English shows an English notice under a Thai UI. The per-app
// picker is the way out of that; aligning the two on their own would mean passing
// the strings through the service start intent.

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const ROOT = path.join(__dirname, "..");
const IOS = path.join(ROOT, "ios", "Airhop");
const PLIST = path.join(IOS, "Info.plist");
const PBX = path.join(ROOT, "ios", "Airhop.xcodeproj", "project.pbxproj");
const RES = path.join(ROOT, "android", "app", "src", "main", "res");

// Read from the type union so this and the app cannot disagree about what
// ships. The pseudolocale is never inferred, so it never reaches a dialog.
function registryCodes() {
  const file = path.join(ROOT, "src", "i18n", "languages.ts");
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  let codes = null;
  const visit = (node) => {
    if (
      ts.isTypeAliasDeclaration(node) &&
      node.name.text === "LanguageCode" &&
      ts.isUnionTypeNode(node.type)
    ) {
      codes = node.type.types
        .filter((t) => ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal))
        .map((t) => t.literal.text)
        .filter((c) => c !== "qps-ploc");
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  if (codes === null) throw new Error("LanguageCode union not found");
  return codes;
}

const errors = [];
const codes = registryCodes();

// MARK: - iOS

// Read, not listed, so a permission added to the plist fails here until
// it is translated.
const plistKeys = [
  ...fs
    .readFileSync(PLIST, "utf8")
    .matchAll(/<key>(NS\w*UsageDescription)<\/key>/g),
].map((m) => m[1]);

if (plistKeys.length === 0) {
  errors.push("ios: Info.plist declares no usage descriptions");
}

// A .strings file is a sequence of `"key" = "value";`.
function readStrings(file) {
  const out = {};
  const source = fs.readFileSync(file, "utf8");
  for (const m of source.matchAll(/"([^"]+)"\s*=\s*"((?:[^"\\]|\\.)*)"\s*;/g)) {
    out[m[1]] = m[2];
  }
  return out;
}

const lprojs = fs
  .readdirSync(IOS)
  .filter((n) => n.endsWith(".lproj"))
  .map((n) => n.slice(0, -".lproj".length));

for (const code of codes) {
  if (!lprojs.includes(code)) errors.push(`ios: missing ${code}.lproj`);
}
for (const code of lprojs) {
  if (!codes.includes(code)) {
    errors.push(`ios: ${code}.lproj is not a language the app ships`);
  }
}

const pbx = fs.readFileSync(PBX, "utf8");
for (const code of lprojs) {
  const file = path.join(IOS, `${code}.lproj`, "InfoPlist.strings");
  if (!fs.existsSync(file)) {
    errors.push(`ios: ${code}.lproj has no InfoPlist.strings`);
    continue;
  }

  const strings = readStrings(file);
  for (const key of plistKeys) {
    const value = strings[key];
    if (value === undefined) errors.push(`ios ${code}: missing ${key}`);
    else if (value.trim().length === 0)
      errors.push(`ios ${code}: empty ${key}`);
    else if (!/\bAirhop\b/.test(value)) {
      errors.push(`ios ${code}: ${key} does not name Airhop`);
    }
  }
  for (const key of Object.keys(strings)) {
    if (!plistKeys.includes(key))
      errors.push(`ios ${code}: unknown key ${key}`);
  }

  if (!pbx.includes(`Airhop/${code}.lproj/InfoPlist.strings`)) {
    errors.push(`ios ${code}: not referenced by project.pbxproj`);
  }
  if (!new RegExp(`^\\t+"?${code}"?,$`, "m").test(pbx)) {
    errors.push(`ios ${code}: not in knownRegions`);
  }
}

// MARK: - Android

// European Portuguese sits at the bare `pt`, not at `pt-rPT`.
//
// Android tries the exact tag, then the parent language, then the parent's
// children. Without a `pt`, an Angolan or Mozambican phone reaches that third
// step and gets whichever child wins. Holding European at the parent settles
// every `pt-*` outside Brazil, which is what those countries write and how
// bitchat-android lays it out.
const PARENT_QUALIFIER = { "pt-PT": "values-pt" };

// Otherwise the legacy qualifier takes a two-letter language and a `-r` region;
// a script, or a three-letter language, needs the `b+` form. A subtag's length
// separates the two: `Hans` is a script, `BR` a region.
function qualifier(code) {
  const parent = PARENT_QUALIFIER[code];
  if (parent !== undefined) return parent;
  const [lang, sub] = code.split("-");
  if (sub !== undefined) {
    return sub.length === 2
      ? `values-${lang}-r${sub.toUpperCase()}`
      : `values-b+${lang}+${sub}`;
  }
  return lang.length > 2 ? `values-b+${lang}` : `values-${lang}`;
}

function readResources(file) {
  const out = {};
  const source = fs.readFileSync(file, "utf8");
  for (const m of source.matchAll(
    /<string name="([^"]+)"(?:\s+translatable="false")?\s*>([\s\S]*?)<\/string>/g,
  )) {
    out[m[1]] = m[2];
  }
  return out;
}

// aapt2 reads these before the XML parser does, so they fail the build rather
// than the review.
const BARE_APOSTROPHE = /(^|[^\\])'/;
const UNESCAPED_XML = /&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)|<|>/;

const base = readResources(path.join(RES, "values", "strings.xml"));
// Only what the app posts: `app_name` is a proper noun and the Expo flag is
// marked untranslatable.
const androidKeys = Object.keys(base).filter((k) => k.startsWith("mesh_"));

if (androidKeys.length === 0) {
  errors.push("android: values/strings.xml declares no mesh_* strings");
}

const overlays = fs
  .readdirSync(RES)
  .filter((n) => n.startsWith("values-") && n !== "values-night");
// English is the default `values/`, which every unmatched locale falls back to.
const wanted = new Map(
  codes.filter((c) => c !== "en").map((c) => [qualifier(c), c]),
);

for (const [dir, code] of wanted) {
  if (!overlays.includes(dir))
    errors.push(`android: missing res/${dir} (${code})`);
}
for (const dir of overlays) {
  if (!wanted.has(dir))
    errors.push(`android: res/${dir} is not a language the app ships`);
}

for (const [dir, code] of wanted) {
  const file = path.join(RES, dir, "strings.xml");
  if (!fs.existsSync(file)) {
    errors.push(`android ${code}: res/${dir} has no strings.xml`);
    continue;
  }
  const strings = readResources(file);
  for (const key of androidKeys) {
    const value = strings[key];
    if (value === undefined) errors.push(`android ${code}: missing ${key}`);
    else if (value.trim().length === 0)
      errors.push(`android ${code}: empty ${key}`);
    // aapt2 rejects a bare apostrophe inside <string>, so an orthography that
    // writes them (Malagasy's haraton'ny) breaks the build rather than degrading
    // it. The XML metacharacters below are the parser's problem, not aapt's.
    else if (BARE_APOSTROPHE.test(value))
      errors.push(
        `android ${code}: unescaped apostrophe in ${key}, write \\' instead`,
      );
    else if (UNESCAPED_XML.test(value))
      errors.push(`android ${code}: unescaped & < or > in ${key}`);
  }
  for (const key of Object.keys(strings)) {
    if (!androidKeys.includes(key)) {
      errors.push(`android ${code}: unknown key ${key}`);
    }
  }
}

// The per-app language picker on Android 13. A language missing from this file
// is one the picker cannot offer, however complete its catalog.
const LOCALE_CONFIG = path.join(RES, "xml", "locales_config.xml");
if (!fs.existsSync(LOCALE_CONFIG)) {
  errors.push("android: res/xml/locales_config.xml is missing");
} else {
  const declared = [
    ...fs
      .readFileSync(LOCALE_CONFIG, "utf8")
      .matchAll(/android:name="([^"]+)"/g),
  ].map((m) => m[1]);
  if (declared.join(" ") !== codes.join(" ")) {
    for (const code of codes) {
      if (!declared.includes(code))
        errors.push(`android: locales_config.xml is missing ${code}`);
    }
    for (const code of declared) {
      if (!codes.includes(code))
        errors.push(
          `android: locales_config.xml lists ${code}, which is not shipped`,
        );
    }
    if (
      declared.length === codes.length &&
      declared.every((c) => codes.includes(c))
    ) {
      errors.push("android: locales_config.xml is not in LANGUAGE_ORDER");
    }
  }
  const manifest = fs.readFileSync(
    path.join(ROOT, "android/app/src/main/AndroidManifest.xml"),
    "utf8",
  );
  if (!manifest.includes('android:localeConfig="@xml/locales_config"')) {
    errors.push(
      "android: AndroidManifest.xml does not point at locales_config",
    );
  }
}

// A literal left in the Kotlin is a string no overlay can reach.
const SERVICE = path.join(
  ROOT,
  "android/app/src/main/java/org/onemindlabs/airhop/service/AirhopForegroundService.kt",
);
const service = fs.readFileSync(SERVICE, "utf8");
for (const call of ["setContentTitle", "setContentText", "addAction"]) {
  const m = service.match(new RegExp(`\\.${call}\\(([^\\n]*)`));
  if (m !== null && /"[^"]/.test(m[1])) {
    errors.push(`android: ${call} still passes a literal: ${m[1].trim()}`);
  }
}

// MARK: - Report

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} problem(s).`);
  process.exit(1);
}

console.log(
  `${codes.length} languages. iOS: ${plistKeys.length} permission strings each. ` +
    `Android: ${androidKeys.length} service strings each.`,
);
