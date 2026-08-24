// Reads the translation catalog from outside TypeScript, for
// `i18n-audit.js --unused` and `i18n-build-locale.js`.
//
// The catalog is TypeScript, not JSON, so `en.ts` can carry section
// markers and so every locale is type-checked against it. The cost is that a
// script cannot `require()` it, so it goes through the compiler API, which
// unlike a regex cannot be confused by an apostrophe, a brace inside a string,
// or a multi-line value.

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const ROOT = path.join(__dirname, "..");
const LOCALES_DIR = path.join(ROOT, "src", "i18n", "locales");

function parseFile(file) {
  return ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
}

// A property name, whether it is quoted or a bare identifier.
function propertyName(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isIdentifier(node)) return node.text;
  return null;
}

function readStringValue(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  // Prettier splits a literal longer than the print width across lines with `+`,
  // which is the shape most long-form copy ends up in.
  if (
    ts.isBinaryExpression(node) &&
    node.operatorToken.kind === ts.SyntaxKind.PlusToken
  ) {
    const left = readStringValue(node.left);
    const right = readStringValue(node.right);
    if (left === null || right === null) return null;
    return left + right;
  }
  if (ts.isParenthesizedExpression(node))
    return readStringValue(node.expression);
  // `{ ... } as const`
  if (ts.isAsExpression(node)) return readStringValue(node.expression);
  return null;
}

function readStringObject(node) {
  const out = {};
  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = propertyName(prop.name);
    if (key === null) continue;
    const value = readStringValue(prop.initializer);
    if (value !== null) out[key] = value;
  }
  return out;
}

function readPluralObject(node) {
  const out = {};
  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = propertyName(prop.name);
    if (key === null) continue;
    let init = prop.initializer;
    if (ts.isAsExpression(init)) init = init.expression;
    if (!ts.isObjectLiteralExpression(init)) continue;
    out[key] = readStringObject(init);
  }
  return out;
}

// Finds `export const <name> = { ... }`, with or without `as const`.
function findExportedObject(source, name) {
  let found = null;
  source.forEachChild((node) => {
    if (found !== null) return;
    if (!ts.isVariableStatement(node)) return;
    for (const decl of node.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== name) continue;
      let init = decl.initializer;
      if (init !== undefined && ts.isAsExpression(init)) init = init.expression;
      if (init !== undefined && ts.isObjectLiteralExpression(init))
        found = init;
    }
  });
  return found;
}

// A missing locale reads as empty instead of throwing, so `--unused` still
// reports against the languages that do exist.
function readLocale(code) {
  const file = path.join(LOCALES_DIR, `${code}.ts`);
  if (!fs.existsSync(file)) return { strings: {}, plurals: {} };
  const source = parseFile(file);
  const stringsNode = findExportedObject(source, "strings");
  const pluralsNode = findExportedObject(source, "plurals");
  return {
    strings: stringsNode === null ? {} : readStringObject(stringsNode),
    plurals: pluralsNode === null ? {} : readPluralObject(pluralsNode),
  };
}

module.exports = { LOCALES_DIR, readLocale };
