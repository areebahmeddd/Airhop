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
// See `.github/skills/i18n.md` for the full checklist.

import type { TranslationKey } from "./locales/types";

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

// The twenty-nine that follow English, matching the set the landing page already
// serves so the two surfaces name the same languages. Kept out of LANGUAGES on
// purpose: that table is the gate a code passes only once its catalog compiles,
// and nothing here has a catalog yet.
// This list exists so the Appearance sheet can name what is coming instead of
// showing a picker with one entry.
//
// The endonym is the language's own name in its own script, so it needs no
// translation and reads the same whichever language the app is in. The short
// code is what the sheet prints in the leading column.
export interface PlannedLanguageSpec {
  code: string;
  shortCode: string;
  endonym: string;
  nameKey: TranslationKey;
}

export const PLANNED_LANGUAGES: PlannedLanguageSpec[] = [
  {
    code: "am",
    shortCode: "AM",
    endonym: "አማርኛ",
    nameKey: "settings.language.am",
  },
  {
    code: "ar",
    shortCode: "AR",
    endonym: "العربية",
    nameKey: "settings.language.ar",
  },
  {
    code: "my",
    shortCode: "MY",
    endonym: "မြန်မာ",
    nameKey: "settings.language.my",
  },
  {
    code: "zh-Hans",
    shortCode: "ZHS",
    endonym: "简体中文",
    nameKey: "settings.language.zh_hans",
  },
  {
    code: "zh-Hant",
    shortCode: "ZHT",
    endonym: "繁體中文",
    nameKey: "settings.language.zh_hant",
  },
  {
    code: "nl",
    shortCode: "NL",
    endonym: "nederlands",
    nameKey: "settings.language.nl",
  },
  {
    code: "fil",
    shortCode: "FIL",
    endonym: "filipino",
    nameKey: "settings.language.fil",
  },
  {
    code: "fr",
    shortCode: "FR",
    endonym: "français",
    nameKey: "settings.language.fr",
  },
  {
    code: "de",
    shortCode: "DE",
    endonym: "deutsch",
    nameKey: "settings.language.de",
  },
  {
    code: "hi",
    shortCode: "HI",
    endonym: "हिन्दी",
    nameKey: "settings.language.hi",
  },
  {
    code: "id",
    shortCode: "ID",
    endonym: "bahasa indonesia",
    nameKey: "settings.language.id",
  },
  {
    code: "it",
    shortCode: "IT",
    endonym: "italiano",
    nameKey: "settings.language.it",
  },
  {
    code: "ja",
    shortCode: "JA",
    endonym: "日本語",
    nameKey: "settings.language.ja",
  },
  {
    code: "ko",
    shortCode: "KO",
    endonym: "한국어",
    nameKey: "settings.language.ko",
  },
  {
    code: "ms",
    shortCode: "MS",
    endonym: "bahasa melayu",
    nameKey: "settings.language.ms",
  },
  {
    code: "ne",
    shortCode: "NE",
    endonym: "नेपाली",
    nameKey: "settings.language.ne",
  },
  {
    code: "fa",
    shortCode: "FA",
    endonym: "فارسی",
    nameKey: "settings.language.fa",
  },
  {
    code: "pl",
    shortCode: "PL",
    endonym: "polski",
    nameKey: "settings.language.pl",
  },
  {
    code: "pt-BR",
    shortCode: "PT",
    endonym: "português",
    nameKey: "settings.language.pt_br",
  },
  {
    code: "ru",
    shortCode: "RU",
    endonym: "русский",
    nameKey: "settings.language.ru",
  },
  {
    code: "es",
    shortCode: "ES",
    endonym: "español",
    nameKey: "settings.language.es",
  },
  {
    code: "sw",
    shortCode: "SW",
    endonym: "kiswahili",
    nameKey: "settings.language.sw",
  },
  {
    code: "sv",
    shortCode: "SV",
    endonym: "svenska",
    nameKey: "settings.language.sv",
  },
  {
    code: "ta",
    shortCode: "TA",
    endonym: "தமிழ்",
    nameKey: "settings.language.ta",
  },
  {
    code: "th",
    shortCode: "TH",
    endonym: "ไทย",
    nameKey: "settings.language.th",
  },
  {
    code: "tr",
    shortCode: "TR",
    endonym: "türkçe",
    nameKey: "settings.language.tr",
  },
  {
    code: "uk",
    shortCode: "UK",
    endonym: "українська",
    nameKey: "settings.language.uk",
  },
  {
    code: "ur",
    shortCode: "UR",
    endonym: "اردو",
    nameKey: "settings.language.ur",
  },
  {
    code: "vi",
    shortCode: "VI",
    endonym: "tiếng việt",
    nameKey: "settings.language.vi",
  },
];

// The language every unresolved preference lands on. Also the source language:
// `locales/en.ts` is the catalog every other locale would be checked against.
export const DEFAULT_LANGUAGE: LanguageCode = "en";

export function isRTL(code: LanguageCode): boolean {
  return LANGUAGES[code].direction === "rtl";
}
