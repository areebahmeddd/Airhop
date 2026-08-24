export type LanguageCode =
  | "en"
  | "am"
  | "ar"
  | "bn"
  | "my"
  | "zh-Hans"
  | "zh-Hant"
  | "nl"
  | "fil"
  | "fr"
  | "ka"
  | "de"
  | "hi"
  | "id"
  | "it"
  | "ja"
  | "ko"
  | "mg"
  | "ms"
  | "ne"
  | "fa"
  | "pl"
  | "pt-BR"
  | "pt-PT"
  | "pa"
  | "ru"
  | "es"
  | "sw"
  | "sv"
  | "ta"
  | "th"
  | "tr"
  | "uk"
  | "ur"
  | "vi";

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
  | "tamil"
  | "bengali"
  | "gurmukhi"
  | "georgian";

export interface LanguageSpec {
  code: LanguageCode;
  shortCode: string;
  endonym: string;
  direction: "ltr" | "rtl";
  script: ScriptClass;
  ogLocale: string;
  intlLocale: string;
  segment: string;
}

export const DEFAULT_LANGUAGE = "en" as const satisfies LanguageCode;

export const LANGUAGES: Record<LanguageCode, LanguageSpec> = {
  en: {
    code: "en",
    shortCode: "EN",
    endonym: "english",
    direction: "ltr",
    script: "latin",
    ogLocale: "en_US",
    intlLocale: "en",
    segment: "",
  },
  ar: {
    code: "ar",
    shortCode: "AR",
    endonym: "العربية",
    direction: "rtl",
    script: "arabic",
    ogLocale: "ar_AR",
    intlLocale: "ar-u-nu-latn",
    segment: "ar",
  },
  "zh-Hans": {
    code: "zh-Hans",
    shortCode: "ZHS",
    endonym: "简体中文",
    direction: "ltr",
    script: "han",
    ogLocale: "zh_CN",
    intlLocale: "zh-Hans",
    segment: "zh-hans",
  },
  fr: {
    code: "fr",
    shortCode: "FR",
    endonym: "français",
    direction: "ltr",
    script: "latin",
    ogLocale: "fr_FR",
    intlLocale: "fr",
    segment: "fr",
  },
  de: {
    code: "de",
    shortCode: "DE",
    endonym: "deutsch",
    direction: "ltr",
    script: "latin",
    ogLocale: "de_DE",
    intlLocale: "de",
    segment: "de",
  },
  hi: {
    code: "hi",
    shortCode: "HI",
    endonym: "हिन्दी",
    direction: "ltr",
    script: "devanagari",
    ogLocale: "hi_IN",
    intlLocale: "hi",
    segment: "hi",
  },
  id: {
    code: "id",
    shortCode: "ID",
    endonym: "bahasa indonesia",
    direction: "ltr",
    script: "latin",
    ogLocale: "id_ID",
    intlLocale: "id",
    segment: "id",
  },
  fa: {
    code: "fa",
    shortCode: "FA",
    endonym: "فارسی",
    direction: "rtl",
    script: "arabic",
    ogLocale: "fa_IR",
    intlLocale: "fa-u-nu-latn",
    segment: "fa",
  },
  "pt-BR": {
    code: "pt-BR",
    shortCode: "PTB",
    endonym: "português (brasil)",
    direction: "ltr",
    script: "latin",
    ogLocale: "pt_BR",
    intlLocale: "pt-BR",
    segment: "pt-br",
  },
  "pt-PT": {
    code: "pt-PT",
    shortCode: "PTP",
    endonym: "português (portugal)",
    direction: "ltr",
    script: "latin",
    ogLocale: "pt_PT",
    intlLocale: "pt-PT",
    segment: "pt-pt",
  },
  pa: {
    code: "pa",
    shortCode: "PA",
    endonym: "ਪੰਜਾਬੀ",
    direction: "ltr",
    script: "gurmukhi",
    ogLocale: "pa_IN",
    intlLocale: "pa-u-nu-latn",
    segment: "pa",
  },
  ru: {
    code: "ru",
    shortCode: "RU",
    endonym: "русский",
    direction: "ltr",
    script: "cyrillic",
    ogLocale: "ru_RU",
    intlLocale: "ru",
    segment: "ru",
  },
  es: {
    code: "es",
    shortCode: "ES",
    endonym: "español",
    direction: "ltr",
    script: "latin",
    ogLocale: "es_ES",
    intlLocale: "es",
    segment: "es",
  },
  nl: {
    code: "nl",
    shortCode: "NL",
    endonym: "nederlands",
    direction: "ltr",
    script: "latin",
    ogLocale: "nl_NL",
    intlLocale: "nl",
    segment: "nl",
  },
  it: {
    code: "it",
    shortCode: "IT",
    endonym: "italiano",
    direction: "ltr",
    script: "latin",
    ogLocale: "it_IT",
    intlLocale: "it",
    segment: "it",
  },
  sv: {
    code: "sv",
    shortCode: "SV",
    endonym: "svenska",
    direction: "ltr",
    script: "latin",
    ogLocale: "sv_SE",
    intlLocale: "sv",
    segment: "sv",
  },
  pl: {
    code: "pl",
    shortCode: "PL",
    endonym: "polski",
    direction: "ltr",
    script: "latin",
    ogLocale: "pl_PL",
    intlLocale: "pl",
    segment: "pl",
  },
  tr: {
    code: "tr",
    shortCode: "TR",
    endonym: "türkçe",
    direction: "ltr",
    script: "latin",
    ogLocale: "tr_TR",
    intlLocale: "tr",
    segment: "tr",
  },
  uk: {
    code: "uk",
    shortCode: "UK",
    endonym: "українська",
    direction: "ltr",
    script: "cyrillic",
    ogLocale: "uk_UA",
    intlLocale: "uk",
    segment: "uk",
  },
  fil: {
    code: "fil",
    shortCode: "FIL",
    endonym: "filipino",
    direction: "ltr",
    script: "latin",
    ogLocale: "fil_PH",
    intlLocale: "fil",
    segment: "fil",
  },
  ms: {
    code: "ms",
    shortCode: "MS",
    endonym: "bahasa melayu",
    direction: "ltr",
    script: "latin",
    ogLocale: "ms_MY",
    intlLocale: "ms",
    segment: "ms",
  },
  sw: {
    code: "sw",
    shortCode: "SW",
    endonym: "kiswahili",
    direction: "ltr",
    script: "latin",
    ogLocale: "sw_KE",
    intlLocale: "sw",
    segment: "sw",
  },
  vi: {
    code: "vi",
    shortCode: "VI",
    endonym: "tiếng việt",
    direction: "ltr",
    script: "latin",
    ogLocale: "vi_VN",
    intlLocale: "vi",
    segment: "vi",
  },
  "zh-Hant": {
    code: "zh-Hant",
    shortCode: "ZHT",
    endonym: "繁體中文",
    direction: "ltr",
    script: "han",
    ogLocale: "zh_TW",
    intlLocale: "zh-Hant",
    segment: "zh-hant",
  },
  ja: {
    code: "ja",
    shortCode: "JA",
    endonym: "日本語",
    direction: "ltr",
    script: "japanese",
    ogLocale: "ja_JP",
    intlLocale: "ja",
    segment: "ja",
  },
  ko: {
    code: "ko",
    shortCode: "KO",
    endonym: "한국어",
    direction: "ltr",
    script: "hangul",
    ogLocale: "ko_KR",
    intlLocale: "ko",
    segment: "ko",
  },
  th: {
    code: "th",
    shortCode: "TH",
    endonym: "ไทย",
    direction: "ltr",
    script: "thai",
    ogLocale: "th_TH",
    intlLocale: "th",
    segment: "th",
  },
  ur: {
    code: "ur",
    shortCode: "UR",
    endonym: "اردو",
    direction: "rtl",
    script: "arabic",
    ogLocale: "ur_PK",
    intlLocale: "ur-u-nu-latn",
    segment: "ur",
  },
  am: {
    code: "am",
    shortCode: "AM",
    endonym: "አማርኛ",
    direction: "ltr",
    script: "ethiopic",
    ogLocale: "am_ET",
    intlLocale: "am",
    segment: "am",
  },
  my: {
    code: "my",
    shortCode: "MY",
    endonym: "မြန်မာ",
    direction: "ltr",
    script: "myanmar",
    ogLocale: "my_MM",
    intlLocale: "my-u-nu-latn",
    segment: "my",
  },
  ne: {
    code: "ne",
    shortCode: "NE",
    endonym: "नेपाली",
    direction: "ltr",
    script: "devanagari",
    ogLocale: "ne_NP",
    intlLocale: "ne-u-nu-latn",
    segment: "ne",
  },
  ta: {
    code: "ta",
    shortCode: "TA",
    endonym: "தமிழ்",
    direction: "ltr",
    script: "tamil",
    ogLocale: "ta_IN",
    intlLocale: "ta",
    segment: "ta",
  },
  bn: {
    code: "bn",
    shortCode: "BN",
    endonym: "বাংলা",
    direction: "ltr",
    script: "bengali",
    ogLocale: "bn_BD",
    intlLocale: "bn-u-nu-latn",
    segment: "bn",
  },
  ka: {
    code: "ka",
    shortCode: "KA",
    endonym: "ქართული",
    direction: "ltr",
    script: "georgian",
    ogLocale: "ka_GE",
    intlLocale: "ka",
    segment: "ka",
  },
  mg: {
    code: "mg",
    shortCode: "MG",
    endonym: "malagasy",
    direction: "ltr",
    script: "latin",
    ogLocale: "mg_MG",
    intlLocale: "mg",
    segment: "mg",
  },
};

export const LANGUAGE_ORDER: LanguageCode[] = [
  "en",
  "am",
  "ar",
  "bn",
  "my",
  "zh-Hans",
  "zh-Hant",
  "nl",
  "fil",
  "fr",
  "ka",
  "de",
  "hi",
  "id",
  "it",
  "ja",
  "ko",
  "mg",
  "ms",
  "ne",
  "fa",
  "pl",
  "pt-BR",
  "pt-PT",
  "pa",
  "ru",
  "es",
  "sw",
  "sv",
  "ta",
  "th",
  "tr",
  "uk",
  "ur",
  "vi",
];

const BY_SEGMENT = new Map(
  LANGUAGE_ORDER.filter((code) => LANGUAGES[code].segment !== "").map((code) => [
    LANGUAGES[code].segment,
    code,
  ]),
);

export function basenameFor(code: LanguageCode): string {
  const { segment } = LANGUAGES[code];
  return segment === "" ? "/" : `/${segment}`;
}

export function resolveLanguage(pathname: string): LanguageCode {
  const segment = pathname.split("/")[1]?.toLowerCase() ?? "";
  return BY_SEGMENT.get(segment) ?? DEFAULT_LANGUAGE;
}

export function localizedPath(code: LanguageCode, route: string): string {
  const base = basenameFor(code);
  if (base === "/") return route;
  return route === "/" ? base : `${base}${route}`;
}

const TAG_ALIASES: [string, LanguageCode][] = [
  ["zh", "zh-Hans"],
  ["zh-cn", "zh-Hans"],
  ["zh-sg", "zh-Hans"],
  ["zh-tw", "zh-Hant"],
  ["zh-hk", "zh-Hant"],
  ["zh-mo", "zh-Hant"],
  ["pt", "pt-BR"],
  ["pt-ao", "pt-PT"],
  ["pt-mz", "pt-PT"],
  ["in", "id"],
  ["tl", "fil"],
];

const BY_TAG = new Map<string, LanguageCode>([
  ...LANGUAGE_ORDER.map((code): [string, LanguageCode] => [code.toLowerCase(), code]),
  ...TAG_ALIASES,
]);

export function matchLanguage(preferred: readonly string[]): LanguageCode | null {
  for (const tag of preferred) {
    const subtags = tag.toLowerCase().split("-");
    while (subtags.length > 0) {
      const match = BY_TAG.get(subtags.join("-"));
      if (match) return match;
      subtags.pop();
    }
  }
  return null;
}
