import type { plurals, strings } from "./en.ts";

export type TranslationKey = keyof typeof strings;

export type PluralKey = keyof typeof plurals;

export type Strings = Record<TranslationKey, string>;

export type PluralCategory = Intl.LDMLPluralRule;

export type PluralForms = { other: string } & Partial<Record<PluralCategory, string>>;

export type Plurals = Record<PluralKey, PluralForms>;

export interface Locale {
  strings: Strings;
  plurals: Plurals;
}
