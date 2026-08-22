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

// How much longer a pseudo string is than its English source.
//
// A flat ratio was the first version and it is not good enough. Measured across
// the catalog, German averages 1.26x English while a flat 40% pad averages
// 1.61x, which sounds safe until you count the other end: 98 German strings are
// LONGER than their pseudo counterparts. A screen that survives the
// pseudolocale can still break in a real language, which makes the instrument
// worse than useless, because it reports safe.
//
// So the pad is a floor, not the answer. `pseudoLocale` takes the catalogs that
// have actually shipped and pads each string past the longest real translation
// of that same key, which makes the pseudolocale a genuine upper bound on
// everything known rather than a guess. It also gets sharper as catalogs land:
// with thirty of them, a screen that holds here holds everywhere.
const MIN_EXPANSION = 0.4;

// Clearance over the longest real translation seen. Enough that a screen has to
// be comfortable rather than exactly wide enough.
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

// Accents the prose, leaves the preserved tokens alone, then brackets the whole
// thing so truncation and concatenation are both visible.
//
// `longestReal` is the length of the longest shipped translation of this same
// key, so the result is wider than anything a user will actually see. Zero when
// nothing has been translated yet, which falls back to the flat floor.
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

// `others` is every catalog that has shipped, English included. Each string is
// padded past the longest of them for its key, so a screen that holds under the
// pseudolocale holds in every language the app actually carries.
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
    // `other` is the one category CLDR guarantees in every language, so it is
    // required on `PluralForms` and always present on the source. Seeding the
    // result with it keeps the shape provably complete rather than asserted.
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
