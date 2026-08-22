// The pseudolocale: English, made to look like a translation before there is one.
//
// Twenty-nine catalogs are about to be written against 49 screens. Every screen
// that cannot hold a longer string will break in all twenty-nine of them, and
// the honest way to find that out is not to translate first and discover it
// twenty-nine times.
//
// So this generates a fake language from `en` at startup, in debug builds only,
// and it exaggerates the three things a real translation actually does to a
// layout:
//
//   Length      Every string grows by roughly 40%. That is the usual
//               English-to-German figure, and it is close to what Tamil and
//               Burmese cost in rendered width too. Anything with a fixed
//               width, a `numberOfLines`, or a row that assumes two labels fit
//               side by side gives way here.
//   Glyphs      Latin letters are replaced by accented ones outside ASCII.
//               This catches a font that was never asked for a diacritic, and a
//               line height computed from the ascender of a bare "a".
//   Boundaries  Every string is wrapped in ⟦ ⟧. If a bracket is missing on
//               screen, the string was truncated. If two open brackets appear
//               in one sentence, somebody concatenated two translations and the
//               sentence will not survive a language that reorders it.
//
// It is deliberately still readable, so a screenshot can be reviewed by
// somebody who does not speak anything but English.
//
// What it must not touch, and why the exclusion list is the important part of
// this file: a placeholder, a protocol token or a proper noun that got accented
// would be a bug this file invented rather than one it found. `{count}` must
// still interpolate, `#bluetooth` must still name the channel that exists, and
// `catalog.test.ts` holds the pseudolocale to exactly the same rules as a real
// one so that stays true.

import type { Locale, PluralForms, Strings } from "./locales/types";

// A private-use tag, following the convention Windows and ICU use for exactly
// this. It is never a real language, so it can never collide with one, and a
// device set to it resolves to English like any other unknown tag.
export const PSEUDO_LANGUAGE = "qps-ploc";

// Latin letters that carry an obvious diacritic and exist in the fonts both
// platforms ship. Deliberately legible: swapping "e" for "€" would find the
// same layout bugs and make the screenshot unreadable.
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

// Roughly the width a European translation adds. Applied as a run of middle
// dots rather than repeated words: it is unmistakably padding, so nobody reads
// a screenshot and wonders whether the copy really says that.
const EXPANSION = 0.4;

function accent(text: string): string {
  let out = "";
  for (const character of text) out += ACCENTS[character] ?? character;
  return out;
}

function pad(length: number): string {
  const extra = Math.round(length * EXPANSION);
  if (extra <= 0) return "";
  return ` ${"·".repeat(extra)}`;
}

// Accents the prose, leaves the preserved tokens alone, then brackets the whole
// thing so truncation and concatenation are both visible.
export function pseudo(source: string): string {
  const parts = source.split(PRESERVED);
  let out = "";
  for (let i = 0; i < parts.length; i++) {
    // `String.split` with a capturing group alternates: gap, token, gap, token.
    out += i % 2 === 0 ? accent(parts[i]) : parts[i];
  }
  // Newlines are load-bearing in a few strings (the identity screen splits two
  // sentences across lines), so the padding goes at the end rather than inside.
  return `⟦${out}${pad(source.length)}⟧`;
}

export function pseudoLocale(source: Locale): Locale {
  const strings = {} as Record<string, string>;
  for (const [key, value] of Object.entries(source.strings)) {
    strings[key] = pseudo(value);
  }
  const plurals = {} as Record<string, PluralForms>;
  for (const [key, forms] of Object.entries(source.plurals)) {
    // `other` is the one category CLDR guarantees in every language, so it is
    // required on `PluralForms` and always present on the source. Seeding the
    // result with it keeps the shape provably complete rather than asserted.
    const out: PluralForms = { other: pseudo(forms.other) };
    for (const [category, value] of Object.entries(forms)) {
      if (category !== "other" && value !== undefined) {
        out[category as keyof PluralForms] = pseudo(value);
      }
    }
    plurals[key] = out;
  }
  return {
    strings: strings as Strings,
    plurals: plurals as Locale["plurals"],
  };
}
