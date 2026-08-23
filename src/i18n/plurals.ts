// CLDR plural category selection.
//
// Hermes has no `Intl.PluralRules` on either platform. The usual answer is
// `@formatjs/intl-pluralrules`, and this is deliberately not that: across the
// thirty languages there are exactly nine distinct rule shapes, so nine
// functions replace a dependency, thirty locale-data modules, a patched global
// `Intl`, and the Android startup cost FormatJS documents for its own detection
// path.
//
// Node ships full ICU, so `__tests__/plurals.test.ts` checks every rule below
// against `Intl.PluralRules` itself.
//
// Integers only. Every count in this app is a countable thing, and CLDR's
// fractional rules depend on the number of visible decimal places, which is a
// property of the formatting rather than of the value. A fraction returns
// `other`, the category CLDR guarantees in every language.

import type { LanguageCode } from "./languages";

export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

// A rule takes a non-negative integer and names its category.
type Rule = (i: number) => PluralCategory;

// ---- The nine shapes ----

// Chinese, Japanese, Korean, Thai, Vietnamese, Indonesian, Malay, Burmese.
// These languages do not inflect for number at all: one boat and five boats are
// the same word, and the count in front of it is the only thing that changes.
const otherOnly: Rule = () => "other";

// English, Dutch, German, Nepali, Swahili, Swedish, Tamil, Turkish, Urdu.
// Singular is exactly one.
const oneIsOne: Rule = (i) => (i === 1 ? "one" : "other");

// Amharic, Hindi, Persian. Zero takes the singular too, which is the difference
// that makes "0 messages" wrong in Hindi and right in English.
const oneIsZeroOrOne: Rule = (i) => (i === 0 || i === 1 ? "one" : "other");

// Filipino. The rule is about the last digit rather than the magnitude: 4, 6
// and 9 take the plural and everything else does not, so 24 and 25 differ.
const filipino: Rule = (i) => {
  if (i === 1 || i === 2 || i === 3) return "one";
  const last = i % 10;
  return last === 4 || last === 6 || last === 9 ? "other" : "one";
};

// French, Brazilian Portuguese. Zero is singular, and `many` exists only for
// round millions, where the language says "million" rather than the digits.
const frenchLike: Rule = (i) => {
  if (i === 0 || i === 1) return "one";
  if (i !== 0 && i % 1_000_000 === 0) return "many";
  return "other";
};

// Italian, Spanish. As above but zero is plural.
const spanishLike: Rule = (i) => {
  if (i === 1) return "one";
  if (i !== 0 && i % 1_000_000 === 0) return "many";
  return "other";
};

// Polish. Four categories, chosen by the last digit with a hole punched in it
// for the teens, which behave as `many` regardless of how they end.
const polish: Rule = (i) => {
  if (i === 1) return "one";
  const last = i % 10;
  const teens = i % 100;
  if (last >= 2 && last <= 4 && !(teens >= 12 && teens <= 14)) return "few";
  return "many";
};

// Russian, Ukrainian. Same shape as Polish, except 21, 31, 101 are singular:
// the last digit decides even for large numbers, so "21 message" is correct.
const russianLike: Rule = (i) => {
  const last = i % 10;
  const teens = i % 100;
  if (last === 1 && teens !== 11) return "one";
  if (last >= 2 && last <= 4 && !(teens >= 12 && teens <= 14)) return "few";
  return "many";
};

// Arabic. All six categories, and the only language here that uses `zero` and
// `two` as grammar rather than as a special case someone wrote by hand.
const arabic: Rule = (i) => {
  if (i === 0) return "zero";
  if (i === 1) return "one";
  if (i === 2) return "two";
  const hundred = i % 100;
  if (hundred >= 3 && hundred <= 10) return "few";
  if (hundred >= 11 && hundred <= 99) return "many";
  return "other";
};

// ---- The table ----
//
// Every language Airhop plans to ship, whether or not its catalog exists yet.
// This is a fact about the language rather than about the translation, so it
// does not wait for one, and a catalog landing never has to touch this file.
//
// `__tests__/plurals.test.ts` asserts that every code in LANGUAGES appears here,
// so a language cannot reach a user without its rule.
const RULES = {
  am: oneIsZeroOrOne,
  ar: arabic,
  de: oneIsOne,
  en: oneIsOne,
  es: spanishLike,
  fa: oneIsZeroOrOne,
  fil: filipino,
  fr: frenchLike,
  hi: oneIsZeroOrOne,
  id: otherOnly,
  it: spanishLike,
  ja: otherOnly,
  ko: otherOnly,
  ms: otherOnly,
  my: otherOnly,
  ne: oneIsOne,
  nl: oneIsOne,
  pl: polish,
  "pt-BR": frenchLike,
  ru: russianLike,
  sv: oneIsOne,
  sw: oneIsOne,
  ta: oneIsOne,
  th: otherOnly,
  tr: oneIsOne,
  uk: russianLike,
  ur: oneIsOne,
  vi: otherOnly,
  "zh-Hans": otherOnly,
  "zh-Hant": otherOnly,
  // The pseudolocale derives from English, so it plurals like English.
  "qps-ploc": oneIsOne,
} satisfies Record<string, Rule>;

// The categories a language actually uses, derived rather than declared so the
// two can never disagree. `catalog.test.ts` checks each locale's plural forms
// against this.
export const PLURAL_CATEGORIES: Record<string, PluralCategory[]> = {
  am: ["one", "other"],
  ar: ["zero", "one", "two", "few", "many", "other"],
  de: ["one", "other"],
  en: ["one", "other"],
  es: ["one", "many", "other"],
  fa: ["one", "other"],
  fil: ["one", "other"],
  fr: ["one", "many", "other"],
  hi: ["one", "other"],
  id: ["other"],
  it: ["one", "many", "other"],
  ja: ["other"],
  ko: ["other"],
  ms: ["other"],
  my: ["other"],
  ne: ["one", "other"],
  nl: ["one", "other"],
  pl: ["one", "few", "many", "other"],
  "pt-BR": ["one", "many", "other"],
  ru: ["one", "few", "many", "other"],
  sv: ["one", "other"],
  sw: ["one", "other"],
  ta: ["one", "other"],
  th: ["other"],
  tr: ["one", "other"],
  uk: ["one", "few", "many", "other"],
  ur: ["one", "other"],
  vi: ["other"],
  "zh-Hans": ["other"],
  "zh-Hant": ["other"],
  "qps-ploc": ["one", "other"],
};

// Which plural form a count selects, in a given language.
//
// Negative counts take their magnitude: CLDR treats -1 as `one` in English, and
// nothing in this app counts downward past zero anyway.
export function selectPlural(
  language: LanguageCode,
  count: number,
): PluralCategory {
  if (!Number.isInteger(count)) return "other";
  const rule: Rule | undefined = RULES[language];
  // Unreachable while the test above holds. `other` rather than a throw
  // because a wrong plural is a cosmetic bug and a crash in the middle of a
  // message list is not.
  if (rule === undefined) return "other";
  return rule(Math.abs(count));
}
