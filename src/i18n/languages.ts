// The languages Airhop knows about.
//
// This table is facts about languages: what a language calls itself, which way
// it reads, what script it is written in. None of that depends on whether a
// translation exists yet, so none of it waits for one. The table lists all
// thirty from the start.
//
// What a language DOES wait for is its catalog, and that gate lives in
// `index.ts`, where `CATALOGS` maps a code to a compiled `Locale`. A language is
// selectable when, and only when, it has an entry there, because a `Locale` is
// `Record<TranslationKey, string>` and cannot be constructed incomplete. So
// "shipped" is derived from the catalog registry rather than declared here, and
// landing a translation is one file plus one line, with nothing to keep in sync.
//
// The set matches the thirty the landing site serves, and the metadata is lifted
// from `landing/src/i18n/languages.ts` so the two surfaces name, order and spell
// the same languages.
//
// See `.github/skills/i18n.md` for the full checklist.

import type { TranslationKey } from "./locales/types";

export type LanguageCode =
  | "en"
  | "am"
  | "ar"
  | "my"
  | "zh-Hans"
  | "zh-Hant"
  | "nl"
  | "fil"
  | "fr"
  | "de"
  | "hi"
  | "id"
  | "it"
  | "ja"
  | "ko"
  | "ms"
  | "ne"
  | "fa"
  | "pl"
  | "pt-BR"
  | "ru"
  | "es"
  | "sw"
  | "sv"
  | "ta"
  | "th"
  | "tr"
  | "uk"
  | "ur"
  | "vi"
  // The pseudolocale. Not a language, and never listed beside them: see
  // `PSEUDO_LANGUAGE` in ./pseudo.ts, and PICKER_LANGUAGES in ./index.ts, which
  // appends it in debug builds only.
  | "qps-ploc";

// What a language is written in, which is the axis that predicts rendering
// trouble far better than the language itself. Latin scripts differ in how long
// the words get; the others differ in whether the glyphs exist on the device at
// all, how tall a line has to be, and whether a line can break at a space.
//
// Carried so the review pass can be organized by the thing that actually breaks,
// and so a font note has somewhere to hang.
export type ScriptClass =
  | "latin"
  | "cyrillic"
  | "arabic"
  | "devanagari"
  | "han"
  | "japanese"
  | "hangul"
  | "thai"
  | "myanmar"
  | "ethiopic"
  | "tamil";

export interface LanguageSpec {
  code: LanguageCode;
  // Printed in the picker's leading column, where a flag would otherwise go.
  // Deliberately not a flag: a language is not a country, and picking one flag
  // per language gets somebody's identity wrong every time.
  shortCode: string;
  // The language's name in its own script, lowercased to match Airhop's terse
  // copy. Needs no translation and reads the same whichever language the app is
  // in, which is the point: somebody who cannot read the current UI language can
  // still find their own.
  endonym: string;
  // For stable ordering, which must not shuffle when the UI language changes.
  englishName: string;
  // The translated name, for the picker's second line.
  nameKey: TranslationKey;
  direction: "ltr" | "rtl";
  script: ScriptClass;
}

export const LANGUAGES: Record<LanguageCode, LanguageSpec> = {
  en: {
    code: "en",
    shortCode: "EN",
    endonym: "english",
    englishName: "English",
    nameKey: "settings.language.en",
    direction: "ltr",
    script: "latin",
  },
  am: {
    code: "am",
    shortCode: "AM",
    endonym: "አማርኛ",
    englishName: "Amharic",
    nameKey: "settings.language.am",
    direction: "ltr",
    script: "ethiopic",
  },
  ar: {
    code: "ar",
    shortCode: "AR",
    endonym: "العربية",
    englishName: "Arabic",
    nameKey: "settings.language.ar",
    direction: "rtl",
    script: "arabic",
  },
  my: {
    code: "my",
    shortCode: "MY",
    endonym: "မြန်မာ",
    englishName: "Burmese",
    nameKey: "settings.language.my",
    direction: "ltr",
    script: "myanmar",
  },
  "zh-Hans": {
    code: "zh-Hans",
    shortCode: "ZHS",
    endonym: "简体中文",
    englishName: "Chinese (Simplified)",
    nameKey: "settings.language.zh_hans",
    direction: "ltr",
    script: "han",
  },
  "zh-Hant": {
    code: "zh-Hant",
    shortCode: "ZHT",
    endonym: "繁體中文",
    englishName: "Chinese (Traditional)",
    nameKey: "settings.language.zh_hant",
    direction: "ltr",
    script: "han",
  },
  nl: {
    code: "nl",
    shortCode: "NL",
    endonym: "nederlands",
    englishName: "Dutch",
    nameKey: "settings.language.nl",
    direction: "ltr",
    script: "latin",
  },
  fil: {
    code: "fil",
    shortCode: "FIL",
    endonym: "filipino",
    englishName: "Filipino",
    nameKey: "settings.language.fil",
    direction: "ltr",
    script: "latin",
  },
  fr: {
    code: "fr",
    shortCode: "FR",
    endonym: "français",
    englishName: "French",
    nameKey: "settings.language.fr",
    direction: "ltr",
    script: "latin",
  },
  de: {
    code: "de",
    shortCode: "DE",
    endonym: "deutsch",
    englishName: "German",
    nameKey: "settings.language.de",
    direction: "ltr",
    script: "latin",
  },
  hi: {
    code: "hi",
    shortCode: "HI",
    endonym: "हिन्दी",
    englishName: "Hindi",
    nameKey: "settings.language.hi",
    direction: "ltr",
    script: "devanagari",
  },
  id: {
    code: "id",
    shortCode: "ID",
    endonym: "bahasa indonesia",
    englishName: "Indonesian",
    nameKey: "settings.language.id",
    direction: "ltr",
    script: "latin",
  },
  it: {
    code: "it",
    shortCode: "IT",
    endonym: "italiano",
    englishName: "Italian",
    nameKey: "settings.language.it",
    direction: "ltr",
    script: "latin",
  },
  ja: {
    code: "ja",
    shortCode: "JA",
    endonym: "日本語",
    englishName: "Japanese",
    nameKey: "settings.language.ja",
    direction: "ltr",
    script: "japanese",
  },
  ko: {
    code: "ko",
    shortCode: "KO",
    endonym: "한국어",
    englishName: "Korean",
    nameKey: "settings.language.ko",
    direction: "ltr",
    script: "hangul",
  },
  ms: {
    code: "ms",
    shortCode: "MS",
    endonym: "bahasa melayu",
    englishName: "Malay",
    nameKey: "settings.language.ms",
    direction: "ltr",
    script: "latin",
  },
  ne: {
    code: "ne",
    shortCode: "NE",
    endonym: "नेपाली",
    englishName: "Nepali",
    nameKey: "settings.language.ne",
    direction: "ltr",
    script: "devanagari",
  },
  fa: {
    code: "fa",
    shortCode: "FA",
    endonym: "فارسی",
    englishName: "Persian",
    nameKey: "settings.language.fa",
    direction: "rtl",
    script: "arabic",
  },
  pl: {
    code: "pl",
    shortCode: "PL",
    endonym: "polski",
    englishName: "Polish",
    nameKey: "settings.language.pl",
    direction: "ltr",
    script: "latin",
  },
  "pt-BR": {
    code: "pt-BR",
    shortCode: "PT",
    endonym: "português",
    englishName: "Portuguese (Brazil)",
    nameKey: "settings.language.pt_br",
    direction: "ltr",
    script: "latin",
  },
  ru: {
    code: "ru",
    shortCode: "RU",
    endonym: "русский",
    englishName: "Russian",
    nameKey: "settings.language.ru",
    direction: "ltr",
    script: "cyrillic",
  },
  es: {
    code: "es",
    shortCode: "ES",
    endonym: "español",
    englishName: "Spanish",
    nameKey: "settings.language.es",
    direction: "ltr",
    script: "latin",
  },
  sw: {
    code: "sw",
    shortCode: "SW",
    endonym: "kiswahili",
    englishName: "Swahili",
    nameKey: "settings.language.sw",
    direction: "ltr",
    script: "latin",
  },
  sv: {
    code: "sv",
    shortCode: "SV",
    endonym: "svenska",
    englishName: "Swedish",
    nameKey: "settings.language.sv",
    direction: "ltr",
    script: "latin",
  },
  ta: {
    code: "ta",
    shortCode: "TA",
    endonym: "தமிழ்",
    englishName: "Tamil",
    nameKey: "settings.language.ta",
    direction: "ltr",
    script: "tamil",
  },
  th: {
    code: "th",
    shortCode: "TH",
    endonym: "ไทย",
    englishName: "Thai",
    nameKey: "settings.language.th",
    direction: "ltr",
    script: "thai",
  },
  tr: {
    code: "tr",
    shortCode: "TR",
    endonym: "türkçe",
    englishName: "Turkish",
    nameKey: "settings.language.tr",
    direction: "ltr",
    script: "latin",
  },
  uk: {
    code: "uk",
    shortCode: "UK",
    endonym: "українська",
    englishName: "Ukrainian",
    nameKey: "settings.language.uk",
    direction: "ltr",
    script: "cyrillic",
  },
  ur: {
    code: "ur",
    shortCode: "UR",
    endonym: "اردو",
    englishName: "Urdu",
    nameKey: "settings.language.ur",
    direction: "rtl",
    script: "arabic",
  },
  vi: {
    code: "vi",
    shortCode: "VI",
    endonym: "tiếng việt",
    englishName: "Vietnamese",
    nameKey: "settings.language.vi",
    direction: "ltr",
    script: "latin",
  },
  // Deliberately last, and deliberately not in LANGUAGE_ORDER below. It is a
  // debugging instrument rather than a language, so it never appears in a
  // release build and never sorts in among real ones.
  "qps-ploc": {
    code: "qps-ploc",
    shortCode: "QPS",
    endonym: "pseudo",
    englishName: "Pseudolocale",
    nameKey: "settings.language.pseudo",
    direction: "ltr",
    script: "latin",
  },
};

// English first as the source language, then the rest alphabetically by English
// name, so the ordering is stable regardless of the active UI language. A list
// that re-sorted itself when you changed language would move the row you just
// tapped out from under your finger.
export const LANGUAGE_ORDER: LanguageCode[] = [
  "en",
  ...(Object.keys(LANGUAGES) as LanguageCode[])
    .filter((code) => code !== "en" && code !== "qps-ploc")
    .sort((a, b) =>
      LANGUAGES[a].englishName.localeCompare(LANGUAGES[b].englishName, "en"),
    ),
];

// The language every unresolved preference lands on. Also the source language:
// `locales/en.ts` is the catalog every other locale is checked against.
export const DEFAULT_LANGUAGE: LanguageCode = "en";

export function isRTL(code: LanguageCode): boolean {
  return LANGUAGES[code].direction === "rtl";
}

// Whether a code is one Airhop knows, for narrowing a value that came off disk
// or out of the device's locale.
export function isLanguageCode(value: string): value is LanguageCode {
  return Object.prototype.hasOwnProperty.call(LANGUAGES, value);
}
