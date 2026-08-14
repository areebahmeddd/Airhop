// The shape every locale file must have.
//
// `en.ts` is the source of truth: it declares the keys, and the types below
// are derived from it. Any locale added later is annotated `Strings` /
// `Plurals`, so a missing key, a stray key, or a typo is a compile error under
// the `npm run typecheck` that CI already runs. A partial locale is
// unrepresentable here, which is why Airhop needs neither a runtime fallback nor
// a localization coverage test: the .xcstrings format bitchat uses permits
// partial locales, this one does not.
//
// So a locale ships once it is complete, and adding an English key breaks every
// incomplete locale at compile time rather than degrading it at runtime in
// front of a user.

import type { plurals, strings } from "./en";

export type TranslationKey = keyof typeof strings;
export type PluralKey = keyof typeof plurals;

export type Strings = Record<TranslationKey, string>;

// Plural categories are per-language, not universal: English needs one/other,
// Russian needs one/few/many/other, Arabic needs all six. A flat `Strings` map
// cannot express that (every locale would be forced to English's exact key
// set), so plurals live in their own map where each locale supplies only the
// categories its language actually uses.
//
// `other` is required everywhere because it is the category `Intl.PluralRules`
// falls back to and the only one guaranteed to exist in every language.
export interface PluralForms {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

export type Plurals = Record<PluralKey, PluralForms>;

export interface Locale {
  strings: Strings;
  plurals: Plurals;
}
