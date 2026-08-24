import { createContext, useContext } from "react";
import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from "./languages.ts";
import { en } from "./locales/en.ts";
import type { Locale, PluralKey, TranslationKey } from "./locales/types.ts";

export {
  basenameFor,
  LANGUAGE_ORDER,
  LANGUAGES,
  localizedPath,
  matchLanguage,
  resolveLanguage,
  type LanguageCode,
  type LanguageSpec,
} from "./languages.ts";
export type { PluralKey, TranslationKey } from "./locales/types.ts";

const LOADERS: Record<Exclude<LanguageCode, "en">, () => Promise<{ locale: Locale }>> = {
  ar: () => import("./locales/ar.ts"),
  am: () => import("./locales/am.ts"),
  my: () => import("./locales/my.ts"),
  ne: () => import("./locales/ne.ts"),
  ta: () => import("./locales/ta.ts"),
  th: () => import("./locales/th.ts"),
  ur: () => import("./locales/ur.ts"),
  "zh-Hant": () => import("./locales/zh-Hant.ts"),
  ja: () => import("./locales/ja.ts"),
  ko: () => import("./locales/ko.ts"),
  fil: () => import("./locales/fil.ts"),
  ms: () => import("./locales/ms.ts"),
  sw: () => import("./locales/sw.ts"),
  vi: () => import("./locales/vi.ts"),
  pl: () => import("./locales/pl.ts"),
  tr: () => import("./locales/tr.ts"),
  uk: () => import("./locales/uk.ts"),
  nl: () => import("./locales/nl.ts"),
  it: () => import("./locales/it.ts"),
  sv: () => import("./locales/sv.ts"),
  "zh-Hans": () => import("./locales/zh-Hans.ts"),
  fr: () => import("./locales/fr.ts"),
  de: () => import("./locales/de.ts"),
  hi: () => import("./locales/hi.ts"),
  id: () => import("./locales/id.ts"),
  fa: () => import("./locales/fa.ts"),
  "pt-BR": () => import("./locales/pt-BR.ts"),
  "pt-PT": () => import("./locales/pt-PT.ts"),
  bn: () => import("./locales/bn.ts"),
  ka: () => import("./locales/ka.ts"),
  mg: () => import("./locales/mg.ts"),
  pa: () => import("./locales/pa.ts"),
  ru: () => import("./locales/ru.ts"),
  es: () => import("./locales/es.ts"),
};

const CATALOGS = new Map<LanguageCode, Locale>([[DEFAULT_LANGUAGE, en]]);

export async function loadCatalog(language: LanguageCode): Promise<void> {
  if (language === DEFAULT_LANGUAGE || CATALOGS.has(language)) return;
  CATALOGS.set(language, (await LOADERS[language]()).locale);
}

function catalog(language: LanguageCode): Locale {
  return CATALOGS.get(language) ?? en;
}

export type TranslationVars = Record<string, string | number>;

const PLACEHOLDER = /\{(\w+)\}/g;

function interpolate(template: string, vars?: TranslationVars): string {
  if (vars === undefined) return template;
  return template.replace(PLACEHOLDER, (match, name: string) => {
    const value = vars[name];
    return value === undefined ? match : String(value);
  });
}

export interface Translator {
  readonly language: LanguageCode;
  (key: TranslationKey, vars?: TranslationVars): string;
}

export interface PluralTranslator {
  (key: PluralKey, count: number, vars?: TranslationVars): string;
}

const PLURAL_RULES = new Map<LanguageCode, Intl.PluralRules>();

function pluralRules(language: LanguageCode): Intl.PluralRules {
  let rules = PLURAL_RULES.get(language);
  if (!rules) {
    rules = new Intl.PluralRules(language);
    PLURAL_RULES.set(language, rules);
  }
  return rules;
}

const NUMBER_FORMATS = new Map<LanguageCode, Intl.NumberFormat>();

export function formatNumber(language: LanguageCode, value: number): string {
  let format = NUMBER_FORMATS.get(language);
  if (!format) {
    format = new Intl.NumberFormat(LANGUAGES[language].intlLocale);
    NUMBER_FORMATS.set(language, format);
  }
  return format.format(value);
}

const DATE_FORMATS = new Map<LanguageCode, Intl.DateTimeFormat>();

export function formatDate(language: LanguageCode, iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  let format = DATE_FORMATS.get(language);
  if (!format) {
    format = new Intl.DateTimeFormat(LANGUAGES[language].intlLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
    DATE_FORMATS.set(language, format);
  }
  return format.format(date);
}

const SHORT_DATE_FORMATS = new Map<LanguageCode, Intl.DateTimeFormat>();

export function formatShortDate(language: LanguageCode, date: Date): string {
  let format = SHORT_DATE_FORMATS.get(language);
  if (!format) {
    format = new Intl.DateTimeFormat(LANGUAGES[language].intlLocale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    SHORT_DATE_FORMATS.set(language, format);
  }
  return format.format(date);
}

const TRANSLATORS = new Map<LanguageCode, Translator>();

export function getT(language: LanguageCode): Translator {
  let translator = TRANSLATORS.get(language);
  if (!translator) {
    translator = Object.assign(
      (key: TranslationKey, vars?: TranslationVars): string =>
        interpolate(catalog(language).strings[key], vars),
      { language },
    );
    TRANSLATORS.set(language, translator);
  }
  return translator;
}

const PLURAL_TRANSLATORS = new Map<LanguageCode, PluralTranslator>();

export function getTPlural(language: LanguageCode): PluralTranslator {
  let translator = PLURAL_TRANSLATORS.get(language);
  if (!translator) {
    translator = (key, count, vars) => {
      const forms = catalog(language).plurals[key];
      const template = forms[pluralRules(language).select(count)] ?? forms.other;
      return interpolate(template, { count: formatNumber(language, count), ...vars });
    };
    PLURAL_TRANSLATORS.set(language, translator);
  }
  return translator;
}

export const LanguageContext = createContext<LanguageCode>(DEFAULT_LANGUAGE);

export function useLanguage(): LanguageCode {
  return useContext(LanguageContext);
}

export function useT(): Translator {
  return getT(useContext(LanguageContext));
}

export function useTPlural(): PluralTranslator {
  return getTPlural(useContext(LanguageContext));
}

export function useDirection(): "ltr" | "rtl" {
  return LANGUAGES[useContext(LanguageContext)].direction;
}

const DISPLAY_NAMES = new Map<LanguageCode, Intl.DisplayNames>();

export function languageName(inLanguage: LanguageCode, of: LanguageCode): string {
  let names = DISPLAY_NAMES.get(inLanguage);
  if (!names) {
    names = new Intl.DisplayNames([LANGUAGES[inLanguage].code], { type: "language" });
    DISPLAY_NAMES.set(inLanguage, names);
  }
  return names.of(of) ?? LANGUAGES[of].endonym;
}
