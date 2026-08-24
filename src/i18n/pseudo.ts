// A generated locale that exaggerates what a translation does to a layout, so
// a screen can be checked before any real one exists. Debug builds only.
//
//   Length      Padded past the longest shipped translation of the same key, so
//               a screen that holds here holds in every language the app
//               carries.
//   Glyphs      Latin letters replaced by accented ones outside ASCII, which
//               catches a font never asked for a diacritic and a line height
//               computed from the ascender of a bare "a".
//   Boundaries  Every string wrapped in brackets. A missing bracket on screen
//               means the string was truncated; two opening brackets in one
//               sentence mean two translations were concatenated.
//
// Placeholders, protocol tokens and proper nouns pass through untouched. One
// that got accented would be a bug this file invented rather than one it found,
// and `catalog.test.ts` holds it to the same rules as a real catalog.

import type { Locale, PluralForms, Strings } from "./locales/types";

// The private-use tag Windows and ICU use for exactly this. Never a real
// language, so a device set to it resolves to English like any unknown tag.
export const PSEUDO_LANGUAGE = "qps-ploc";

// Diacritics both platforms ship a glyph for. Legible on purpose: swapping "e"
// for "€" finds the same layout bugs and makes the screenshot unreadable.
const ACCENTS: Record<string, string> = {
  a: "á",
  b: "ƀ",
  c: "ć",
  d: "đ",
  e: "é",
  f: "ƒ",
  g: "ǵ",
  h: "ĥ",
  i: "í",
  j: "ĵ",
  k: "ķ",
  l: "ł",
  m: "ḿ",
  n: "ń",
  o: "ó",
  p: "ṕ",
  q: "ɋ",
  r: "ŕ",
  s: "ś",
  t: "ŧ",
  u: "ú",
  v: "ṽ",
  w: "ŵ",
  x: "ẋ",
  y: "ý",
  z: "ź",
  A: "Á",
  B: "Ɓ",
  C: "Ć",
  D: "Đ",
  E: "É",
  F: "Ƒ",
  G: "Ǵ",
  H: "Ĥ",
  I: "Í",
  J: "Ĵ",
  K: "Ķ",
  L: "Ł",
  M: "Ḿ",
  N: "Ń",
  O: "Ó",
  P: "Ṕ",
  Q: "Ɋ",
  R: "Ŕ",
  S: "Ś",
  T: "Ŧ",
  U: "Ú",
  V: "Ṽ",
  W: "Ŵ",
  X: "Ẋ",
  Y: "Ý",
  Z: "Ź",
};

// Everything that has to survive byte-for-byte, in one pattern so the string
// can be split on it and only the gaps transformed.
//
// Order matters: `airhop://` before `Airhop`, so the scheme is matched whole
// rather than leaving "://" behind. Longest alternative first throughout.
const PRESERVED =
  /(\{\w+\}|airhop:\/\/|#bluetooth|npub1|\/hug|\/slap|\/who|\/msg|Ed25519|X25519|Lightning|bitchat|Airhop|Cashu|Nostr|GitHub|Tor)/g;

// A floor, not the answer: a flat ratio can still come out shorter than a real
// translation, and an instrument that reports safe when it is not is worse than
// none. `pseudoLocale` pads past the longest shipped translation instead.
const MIN_EXPANSION = 0.4;

// Clearance over the longest real translation, so a screen has to be
// comfortable rather than exactly wide enough.
const HEADROOM = 1.15;

function accent(text: string): string {
  let out = "";
  for (const character of text) out += ACCENTS[character] ?? character;
  return out;
}

// The width to pad to: never less than the flat floor, and always past the
// longest real translation of the same string that has shipped.
function targetWidth(source: number, longestReal: number): number {
  return Math.max(
    Math.round(source * (1 + MIN_EXPANSION)),
    Math.round(longestReal * HEADROOM),
  );
}

function pad(source: number, longestReal: number): string {
  const extra = targetWidth(source, longestReal) - source;
  if (extra <= 0) return "";
  return ` ${"·".repeat(extra)}`;
}

// Accents the prose, leaves preserved tokens alone, then brackets the whole
// thing so truncation and concatenation are both visible. `longestReal` is zero
// when nothing has been translated yet, which falls back to the flat floor.
export function pseudo(source: string, longestReal = 0): string {
  const parts = source.split(PRESERVED);
  let out = "";
  for (let i = 0; i < parts.length; i++) {
    // `String.split` with a capturing group alternates: gap, token, gap, token.
    out += i % 2 === 0 ? accent(parts[i]) : parts[i];
  }
  // Newlines are load-bearing in a few strings (the identity screen splits two
  // sentences across lines), so the padding goes at the end rather than inside.
  return `⟦${out}${pad(source.length, longestReal)}⟧`;
}

// `others` is every shipped catalog, English included. Padding past the longest
// of them per key is what makes a screen that holds here hold everywhere.
export function pseudoLocale(source: Locale, others: Locale[] = []): Locale {
  const longestString = (key: string): number =>
    others.reduce(
      (max, locale) =>
        Math.max(max, (locale.strings as Record<string, string>)[key].length),
      0,
    );

  const strings = {} as Record<string, string>;
  for (const [key, value] of Object.entries(source.strings)) {
    strings[key] = pseudo(value, longestString(key));
  }
  // Plural forms are compared across every category, not just the matching one:
  // Arabic's `many` can be far longer than English's `other`, and the widest
  // form is what a row has to hold.
  const longestPlural = (key: string): number =>
    others.reduce((max, locale) => {
      const forms = (locale.plurals as Record<string, PluralForms>)[key];
      return Object.values(forms).reduce(
        (inner, value) => Math.max(inner, value?.length ?? 0),
        max,
      );
    }, 0);

  const plurals = {} as Record<string, PluralForms>;
  for (const [key, forms] of Object.entries(source.plurals)) {
    const widest = longestPlural(key);
    // `other` is the one category CLDR guarantees everywhere, so it is required
    // on `PluralForms`. Seeding with it keeps the shape provably complete.
    const out: PluralForms = { other: pseudo(forms.other, widest) };
    for (const [category, value] of Object.entries(forms)) {
      if (category !== "other" && value !== undefined) {
        out[category as keyof PluralForms] = pseudo(value, widest);
      }
    }
    plurals[key] = out;
  }
  return {
    strings: strings as Strings,
    plurals: plurals as Locale["plurals"],
  };
}
