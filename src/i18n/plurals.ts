// CLDR plural category selection.
//
// Hermes has no `Intl.PluralRules` on either platform. The usual answer is
// `@formatjs/intl-pluralrules`, and this is not that: the shipped
// languages reduce to nine distinct rule shapes, so nine functions replace a
// dependency, a locale-data module per language, a patched global `Intl`, and
// the Android startup cost FormatJS documents for its own detection path.
//
// Node ships full ICU, so `__tests__/plurals.test.ts` checks every rule below
// against `Intl.PluralRules` itself.
//
// Integers only. CLDR's fractional rules key off the number of visible decimal
// places, which is a property of the formatting rather than the value, and every
// count here is a countable thing. A fraction returns `other`, which CLDR
// guarantees in every language.

import type { LanguageCode } from "./languages";

export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

// A rule takes a non-negative integer and names its category.
type Rule = (i: number) => PluralCategory;

// ---- The nine shapes ----
//
// Which language takes which is the table at the bottom, not these comments, so
// adding a language never edits one.

// No inflection for number at all: one boat and five boats are the same word,
// and the count in front of it is the only thing that changes.
const otherOnly: Rule = () => "other";

// Singular is exactly one.
const oneIsOne: Rule = (i) => (i === 1 ? "one" : "other");

// Zero takes the singular too, the difference that makes "0 messages" wrong in
// Hindi and right in English.
const oneIsZeroOrOne: Rule = (i) => (i === 0 || i === 1 ? "one" : "other");

// Filipino: the last digit decides rather than the magnitude, so 4, 6 and 9
// take the plural and 24 and 25 differ.
const filipino: Rule = (i) => {
  if (i === 1 || i === 2 || i === 3) return "one";
  const last = i % 10;
  return last === 4 || last === 6 || last === 9 ? "other" : "one";
};

// Zero is singular, and `many` exists only for round millions, where the
// language says "million" rather than the digits.
const frenchLike: Rule = (i) => {
  if (i === 0 || i === 1) return "one";
  if (i !== 0 && i % 1_000_000 === 0) return "many";
  return "other";
};

// As above but zero is plural, the single point where pt-PT parts company with
// pt-BR.
const spanishLike: Rule = (i) => {
  if (i === 1) return "one";
  if (i !== 0 && i % 1_000_000 === 0) return "many";
  return "other";
};

// Polish: four categories chosen by the last digit, with a hole punched in it
// for the teens, which are `many` regardless of how they end.
const polish: Rule = (i) => {
  if (i === 1) return "one";
  const last = i % 10;
  const teens = i % 100;
  if (last >= 2 && last <= 4 && !(teens >= 12 && teens <= 14)) return "few";
  return "many";
};

// As Polish, except 21, 31 and 101 are singular: the last digit decides even
// for large numbers, so "21 message" is correct.
const russianLike: Rule = (i) => {
  const last = i % 10;
  const teens = i % 100;
  if (last === 1 && teens !== 11) return "one";
  if (last >= 2 && last <= 4 && !(teens >= 12 && teens <= 14)) return "few";
  return "many";
};

// All six categories, and the only shape that uses `zero` and `two` as grammar
// rather than as a hand-written special case.
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
// Every language Airhop plans to ship, catalog or not: the rule is a fact about
// the language, so a catalog landing never touches this file.
// `plurals.test.ts` asserts every code in LANGUAGES appears here.
const RULES = {
  am: oneIsZeroOrOne,
  ar: arabic,
  bn: oneIsZeroOrOne,
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
  ka: oneIsOne,
  ko: otherOnly,
  mg: oneIsZeroOrOne,
  ms: otherOnly,
  my: otherOnly,
  ne: oneIsOne,
  nl: oneIsOne,
  pl: polish,
  pa: oneIsZeroOrOne,
  "pt-BR": frenchLike,
  "pt-PT": spanishLike,
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

// The categories a language actually uses.
//
// Declared, not derived from the rules above: `plurals.test.ts` checks it
// against `Intl.PluralRules` under Node's ICU instead. Deriving it would make
// the two agree by construction, so a rule with a branch that never fires would
// shrink its own expected set rather than fail.
//
// `catalog.test.ts` then holds every locale to this list, which is what stops a
// Russian catalog shipping only `one` and `other`.
export const PLURAL_CATEGORIES: Record<string, PluralCategory[]> = {
  am: ["one", "other"],
  ar: ["zero", "one", "two", "few", "many", "other"],
  bn: ["one", "other"],
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
  ka: ["one", "other"],
  ko: ["other"],
  mg: ["one", "other"],
  ms: ["other"],
  my: ["other"],
  ne: ["one", "other"],
  nl: ["one", "other"],
  pl: ["one", "few", "many", "other"],
  pa: ["one", "other"],
  "pt-BR": ["one", "many", "other"],
  "pt-PT": ["one", "many", "other"],
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
  // Unreachable while the test above holds. `other` instead of a throw
  // because a wrong plural is a cosmetic bug and a crash in the middle of a
  // message list is not.
  if (rule === undefined) return "other";
  return rule(Math.abs(count));
}
