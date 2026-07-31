// The languages Airhop ships.
//
// English today, ten in v1.3.0. A language is listed here once its catalog
// compiles, which requires every key, so this table is the gate: there is no
// coverage threshold and no partial state to manage.
//
// This file is the seam a second language goes through. It stays a table rather
// than collapsing into a constant because the direction flag and the language
// code are what the rest of the runtime is written against. `layout.ts` already
// uses logical properties and every screen already calls `useT()`, so adding a
// language touches this file, `index.ts`, and a new catalog. No screen moves.
//
// See `.github/skills/localization.md` for the full checklist.

export type LanguageCode = "en";

export interface LanguageSpec {
  code: LanguageCode;
  // The language's name in its own script, lowercased to match Airhop's terse
  // copy style. What a picker would list, the day there is a picker.
  endonym: string;
  englishName: string;
  // Drives `I18nManager` at startup. See `applyLayoutDirection` in `index.ts`.
  direction: "ltr" | "rtl";
}

export const LANGUAGES: Record<LanguageCode, LanguageSpec> = {
  en: {
    code: "en",
    endonym: "english",
    englishName: "English",
    direction: "ltr",
  },
};

// English first as the source language, then the rest alphabetically by English
// name, so the ordering is stable regardless of the active UI language.
export const LANGUAGE_ORDER: LanguageCode[] = ["en"];

// The language every unresolved preference lands on. Also the source language:
// `locales/en.ts` is the catalog every other locale would be checked against.
export const DEFAULT_LANGUAGE: LanguageCode = "en";

export function isRTL(code: LanguageCode): boolean {
  return LANGUAGES[code].direction === "rtl";
}
