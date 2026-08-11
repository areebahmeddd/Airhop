import type { strings } from "./en.ts";

export type TranslationKey = keyof typeof strings;

export type Strings = Record<TranslationKey, string>;

export interface Locale {
  strings: Strings;
}
