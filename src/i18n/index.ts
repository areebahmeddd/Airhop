// The translation runtime.
//
// Catalogs are TypeScript modules compiled into the bundle, so the text a user
// reads is byte-identical on every device running a given build. A translation
// fetch would be a network call and a fingerprint, and it would fail in exactly
// the conditions this app exists for.
//
// There is no i18n library. i18next and react-intl bring namespaces, lazy
// network backends and untyped runtime keys, none of which an offline-first app
// with a bundled catalog can use. Completeness comes from `tsc` instead; see
// `locales/types.ts`.

import { useSettingsStore } from "@store/settings-store";
import { I18nManager } from "react-native";
import {
  DEFAULT_LANGUAGE,
  isLanguageCode,
  isRTL,
  LANGUAGE_ORDER,
  LANGUAGES,
  type LanguageCode,
} from "./languages";
import { ar } from "./locales/ar";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { ja } from "./locales/ja";
import { ru } from "./locales/ru";
import type { Locale, PluralKey, TranslationKey } from "./locales/types";
import { selectPlural } from "./plurals";
import { PSEUDO_LANGUAGE, pseudoLocale } from "./pseudo";

export type { LanguageCode } from "./languages";
export type { TranslationKey } from "./locales/types";

// ---- The catalogs ----
//
// Adding a language is one line here plus its file. The value must be a
// `Locale`, which is `Record<TranslationKey, string>` derived from `en.ts`, so
// a catalog missing a key does not compile. That is the whole completeness
// story: no coverage threshold, no partial state, no runtime fallback.
const REAL: Partial<Record<LanguageCode, Locale>> = {
  en,
  ar,
  de,
  ja,
  ru,
};

export const CATALOGS: Partial<Record<LanguageCode, Locale>> = {
  ...REAL,
  ...(__DEV__
    ? { [PSEUDO_LANGUAGE]: pseudoLocale(en, Object.values(REAL)) }
    : {}),
};

// The languages a user can choose, in display order.
export const SHIPPED_LANGUAGES: LanguageCode[] = (
  Object.keys(CATALOGS) as LanguageCode[]
).sort((a, b) =>
  a === DEFAULT_LANGUAGE
    ? -1
    : b === DEFAULT_LANGUAGE
      ? 1
      : LANGUAGES[a].englishName.localeCompare(LANGUAGES[b].englishName, "en"),
);

export const PICKER_LANGUAGES: LanguageCode[] = __DEV__
  ? [...LANGUAGE_ORDER, PSEUDO_LANGUAGE]
  : LANGUAGE_ORDER;

export function isShipped(code: LanguageCode): boolean {
  return CATALOGS[code] !== undefined;
}

function catalogFor(code: LanguageCode): Locale {
  return CATALOGS[code] ?? en;
}

// ---- Layout direction ----
//
// `I18nManager` sets a native flag Yoga reads once, at process start, so a
// direction change cannot take effect until the next launch. Airhop does not
// restart itself to force it: a relaunch destroys every Noise session, empties
// the peer table, drops any transfer in flight and cuts live voice.
//
// So direction is pinned at launch, and a language whose direction differs from
// the pinned one is stored as a preference and applied next launch. The UI keeps
// the boot language until then; switching the text now and the layout later
// would put right-to-left prose in a left-to-right frame.

let bootLanguage: LanguageCode = DEFAULT_LANGUAGE;
let bootDirection: "ltr" | "rtl" = "ltr";

// A stored preference, which is either a language or "follow the device".
export type LanguagePreference = LanguageCode | "system";

// The device's language, sampled once. `Intl.DateTimeFormat` is present on
// Hermes on both platforms and needs no dependency, which is the same way
// `place-names-store` reads it.
let deviceLanguage: LanguageCode | null = null;

function getDeviceLanguage(): LanguageCode {
  if (deviceLanguage === null) {
    deviceLanguage = DEFAULT_LANGUAGE;
    try {
      const tag = Intl.DateTimeFormat().resolvedOptions().locale;
      // "pt-BR" matches before "pt", and a bare "zh" is not matched at all: the
      // script matters more than the language there, and guessing Simplified
      // for a Traditional reader is worse than English.
      // A device can be set to the pseudolocale tag on a debug build; it is
      // a debugging instrument, so it is never inferred, only chosen.
      if (tag !== PSEUDO_LANGUAGE && isLanguageCode(tag)) deviceLanguage = tag;
      else {
        const base = tag.split("-")[0];
        if (base !== undefined && base !== "zh" && isLanguageCode(base)) {
          deviceLanguage = base;
        } else if (tag.startsWith("zh")) {
          // Hant for the places that write it, Hans otherwise.
          deviceLanguage = /Hant|TW|HK|MO/i.test(tag) ? "zh-Hant" : "zh-Hans";
        }
      }
    } catch {
      deviceLanguage = DEFAULT_LANGUAGE;
    }
  }
  return deviceLanguage;
}

// What a preference means right now, before the direction rule is applied.
export function resolvePreference(pref: LanguagePreference): LanguageCode {
  const code = pref === "system" ? getDeviceLanguage() : pref;
  // A device language, or a preference written by a build that shipped more
  // languages than this one, may name a code with no catalog.
  return isShipped(code) ? code : DEFAULT_LANGUAGE;
}

// The language actually being rendered. Differs from the preference only while
// a direction change is waiting for the next launch.
export function activeLanguage(pref: LanguagePreference): LanguageCode {
  const wanted = resolvePreference(pref);
  return LANGUAGES[wanted].direction === bootDirection ? wanted : bootLanguage;
}

// Whether the chosen language is waiting for a relaunch to take effect, so the
// picker can say so instead of looking broken.
export function needsRelaunch(pref: LanguagePreference): boolean {
  return activeLanguage(pref) !== resolvePreference(pref);
}

export type TranslationVars = Record<string, string | number>;

// Named placeholders (`{count}`, `{name}`), never positional. A translator who
// reorders a sentence, which most languages require, cannot break a named
// placeholder; they can and do break a positional one. An unknown placeholder
// is left in the output verbatim rather than blanked, so the gap is visible in
// a screenshot instead of silently reading as a missing word.
const PLACEHOLDER = /\{(\w+)\}/g;

function interpolate(template: string, vars?: TranslationVars): string {
  if (vars === undefined) return template;
  return template.replace(PLACEHOLDER, (match, name: string) => {
    const value = vars[name];
    return value === undefined ? match : String(value);
  });
}

export interface Translator {
  // The language this translator is bound to, for callers that need to format
  // a date or a number in the same locale as the surrounding text.
  readonly language: LanguageCode;
  (key: TranslationKey, vars?: TranslationVars): string;
}

export interface PluralTranslator {
  (key: PluralKey, count: number, vars?: TranslationVars): string;
}

// A count inside a translated sentence, formatted in that language.
//
// This is the one place numerals are NOT pinned to Latin, and the split is
// deliberate: `utils/format.ts` pins machine data (byte counts, clock times,
// wallet balances) because those sit in the monospace face beside Latin units,
// where a run of Arabic-Indic digits next to "MB" reads worse than either
// alone. A count inside prose is prose, and Arabic written with Western digits
// is as jarring to an Arabic reader as the reverse would be here.
const COUNT_FORMATS = new Map<LanguageCode, Intl.NumberFormat>();

function formatCount(language: LanguageCode, count: number): string {
  let format = COUNT_FORMATS.get(language);
  if (format === undefined) {
    try {
      format = new Intl.NumberFormat(language);
    } catch {
      // Hermes carries a partial Intl and an OEM may carry less. A plain
      // decimal is a worse number than a grouped one, and far better than a
      // screen that throws while rendering a list.
      format = { format: (n: number) => String(n) } as Intl.NumberFormat;
    }
    COUNT_FORMATS.set(language, format);
  }
  return format.format(count);
}

// Translators are cached per language so their identity is stable. Components
// pass `T` in dependency arrays and memo comparators; a fresh function each
// render would defeat every one of them.
const TRANSLATORS = new Map<LanguageCode, Translator>();

function getT(language: LanguageCode): Translator {
  let translator = TRANSLATORS.get(language);
  if (translator === undefined) {
    translator = Object.assign(
      (key: TranslationKey, vars?: TranslationVars): string =>
        interpolate(catalogFor(language).strings[key], vars),
      { language },
    );
    TRANSLATORS.set(language, translator);
  }
  return translator;
}

const PLURAL_TRANSLATORS = new Map<LanguageCode, PluralTranslator>();

function getTPlural(language: LanguageCode): PluralTranslator {
  let translator = PLURAL_TRANSLATORS.get(language);
  if (translator === undefined) {
    translator = (key, count, vars) => {
      const forms = catalogFor(language).plurals[key];
      // `other` is required by `PluralForms` and is the category CLDR
      // guarantees exists in every language, so this is a real fallback rather
      // than a hopeful one. It catches the Romance `many`, which selects only
      // for round millions and which several catalogs legitimately omit.
      const template = forms[selectPlural(language, count)] ?? forms.other;
      return interpolate(template, {
        count: formatCount(language, count),
        ...vars,
      });
    };
    PLURAL_TRANSLATORS.set(language, translator);
  }
  return translator;
}

// ---- Hooks ----
//
// These subscribe to the language preference, so changing it re-renders the
// tree. Everything below the root reads through them, which is why adding
// twenty-nine languages moved no screen.

export function useLanguage(): LanguageCode {
  return activeLanguage(useSettingsStore((s) => s.language));
}

export function useT(): Translator {
  return getT(useLanguage());
}

export function useTPlural(): PluralTranslator {
  return getTPlural(useLanguage());
}

// ---- Outside the component tree ----
//
// Services, stores and notification builders cannot use a hook. They read the
// same store, so they are never out of step with what is on screen.
//
// Rule for callers: translate at the moment of display, never at the moment of
// storage. A notification body is translated when it is posted. Anything
// persisted to MMKV stores the key instead and is translated on render; see
// `systemKey` in `@store/chat-store` and `@utils/message-text`.

export function getLanguage(): LanguageCode {
  return activeLanguage(useSettingsStore.getState().language);
}

export const t: Translator = Object.assign(
  (key: TranslationKey, vars?: TranslationVars): string =>
    getT(getLanguage())(key, vars),
  {
    get language(): LanguageCode {
      return getLanguage();
    },
  },
) as Translator;

export const tPlural: PluralTranslator = (key, count, vars) =>
  getTPlural(getLanguage())(key, count, vars);

// `I18nManager.forceRTL` sets a native flag that is only read when the app
// starts, so a direction change cannot take effect until the next launch.
//
// Pinning it to the app's language matters even while every shipped language is
// left-to-right: React Native otherwise mirrors the entire layout on a device
// set to Arabic or Hebrew, which puts English text in a right-to-left frame.
// Pinned, the app looks the same on every device, which is the same guarantee
// the bundled catalog gives the text.
export function applyLayoutDirection(code: LanguageCode): void {
  const shouldBeRTL = isRTL(code);
  I18nManager.allowRTL(shouldBeRTL);
  if (I18nManager.isRTL !== shouldBeRTL) I18nManager.forceRTL(shouldBeRTL);
}

// Called once from the root before the first render, so the first frame is
// already laid out correctly and the direction is fixed for the process.
export function initI18n(): void {
  const wanted = resolvePreference(useSettingsStore.getState().language);
  bootLanguage = wanted;
  bootDirection = LANGUAGES[wanted].direction;
  applyLayoutDirection(wanted);
}

// The picker's data, re-exported so a screen imports it alongside `useT`.
export { LANGUAGE_ORDER, LANGUAGES } from "./languages";
