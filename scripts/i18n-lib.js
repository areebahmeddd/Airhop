// Reads the translation catalog from outside TypeScript.
//
// The catalog is TypeScript rather than JSON so that `en.ts` can carry the
// section comments and the do-not-translate notes that make a 1,000-key file
// readable, and so that any locale added later is type-checked against the
// source language by the `npm run typecheck` CI already runs. The cost is that
// a script cannot just `require()` it, so it is read through the TypeScript
// compiler API instead of a regex. `typescript` is already a devDependency, so
// this adds no dependency and, unlike a regex, it cannot be confused by an
// apostrophe, a brace inside a string, or a multi-line value.
//
// Used by `i18n-audit.js --unused`.

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

/** The text of a property name, whether it is quoted or a bare identifier. */
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
  // Prettier splits long string literals across lines with `+`.
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

/**
 * Reads a string-valued object literal into a plain object. Handles the
 * string concatenation Prettier produces when a value is longer than the print
 * width ("a" + "b"), which is the shape most long-form copy ends up in.
 */
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

/** Finds `export const <name> = { ... }` (optionally `as const`). */
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

/** Reads a locale file into `{ strings, plurals }`. */
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
