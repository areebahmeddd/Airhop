// The translation runtime.
//
// Catalogs are TypeScript modules compiled into the bundle: a translation fetch
// would be a network call, a fingerprint, and a failure in exactly the
// conditions this app exists for.
//
// No i18n library. i18next and react-intl bring namespaces, lazy network
// backends and untyped runtime keys, none of which an offline-first app with a
// bundled catalog can use. Completeness comes from `tsc`; see
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
import { am } from "./locales/am";
import { ar } from "./locales/ar";
import { bn } from "./locales/bn";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fa } from "./locales/fa";
import { fil } from "./locales/fil";
import { fr } from "./locales/fr";
import { hi } from "./locales/hi";
import { id } from "./locales/id";
import { it } from "./locales/it";
import { ja } from "./locales/ja";
import { ka } from "./locales/ka";
import { ko } from "./locales/ko";
import { mg } from "./locales/mg";
import { ms } from "./locales/ms";
import { my } from "./locales/my";
import { ne } from "./locales/ne";
import { nl } from "./locales/nl";
import { pa } from "./locales/pa";
import { pl } from "./locales/pl";
import { ptBR } from "./locales/pt-BR";
import { ptPT } from "./locales/pt-PT";
import { ru } from "./locales/ru";
import { sv } from "./locales/sv";
import { sw } from "./locales/sw";
import { ta } from "./locales/ta";
import { th } from "./locales/th";
import { tr } from "./locales/tr";
import type { Locale, PluralKey, TranslationKey } from "./locales/types";
import { uk } from "./locales/uk";
import { ur } from "./locales/ur";
import { vi } from "./locales/vi";
import { zhHans } from "./locales/zh-Hans";
import { zhHant } from "./locales/zh-Hant";
import { selectPlural } from "./plurals";
import { PSEUDO_LANGUAGE, pseudoLocale } from "./pseudo";

export type { LanguageCode } from "./languages";
export type { TranslationKey } from "./locales/types";

// ---- The catalogs ----
//
// Adding a language is one line here plus its file. The value is a `Locale`,
// derived from `en.ts`, so a catalog missing a key does not compile: no coverage
// threshold, no partial state, no runtime fallback.
const REAL: Partial<Record<LanguageCode, Locale>> = {
  en,
  am,
  ar,
  bn,
  de,
  es,
  fa,
  fil,
  fr,
  hi,
  id,
  it,
  ja,
  ka,
  ko,
  mg,
  ms,
  my,
  ne,
  nl,
  pa,
  pl,
  "pt-BR": ptBR,
  "pt-PT": ptPT,
  ru,
  sv,
  sw,
  ta,
  th,
  tr,
  uk,
  ur,
  vi,
  "zh-Hans": zhHans,
  "zh-Hant": zhHant,
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
// `I18nManager` sets a native flag Yoga reads once at process start, so a
// direction change cannot land before the next launch, and Airhop will not force
// a relaunch: that destroys every Noise session, empties the peer table, drops
// transfers in flight and cuts live voice.
//
// So direction is pinned at launch and a language that disagrees with it waits
// as a preference. The UI keeps the boot language meanwhile, since switching the
// text now and the layout later puts right-to-left prose in a left-to-right
// frame.

let bootLanguage: LanguageCode = DEFAULT_LANGUAGE;
let bootDirection: "ltr" | "rtl" = "ltr";

// A stored preference, which is either a language or "follow the device".
export type LanguagePreference = LanguageCode | "system";

// Retired codes a device still reports: `tl` for Filipino on Android, `in` the
// legacy Java Indonesian. Chinese and Portuguese stay out of it, since
// both have two variants and resolve below rather than through one alias.
const LANGUAGE_ALIASES: Record<string, LanguageCode> = {
  tl: "fil",
  in: "id",
};

// Which language an OS tag means. Pure and exported so the branches are testable
// against real device tags, not the runner's locale. The answer is a
// language Airhop knows, not necessarily one it has translated:
// `resolvePreference` applies the shipping gate afterwards.
export function languageForTag(tag: string): LanguageCode {
  // A device can be set to the pseudolocale tag on a debug build; it is a
  // debugging instrument, so it is never inferred, only chosen.
  if (tag !== PSEUDO_LANGUAGE && isLanguageCode(tag)) return tag;

  // The Punjabi catalog is Gurmukhi. Pakistan writes Shahmukhi, an Arabic
  // script with no letters in common, so English is the better fallback there.
  // Android's resource layer already declines the match on script; this is the
  // same rule in JavaScript.
  if (/^pa[-_](PK|Arab)/i.test(tag)) return DEFAULT_LANGUAGE;

  const base = tag.split("-")[0];
  // Neither two-variant language may match on its base alone: guessing
  // Simplified for a Traditional reader, or Brazilian for a Lisbon one, is the
  // kind of wrong that reads as carelessness rather than as a missing language.
  if (base !== undefined && base !== "zh" && base !== "pt") {
    if (isLanguageCode(base)) return base;
  }
  if (tag.startsWith("zh")) {
    // Hant for the places that write it, Hans otherwise.
    return /Hant|TW|HK|MO/i.test(tag) ? "zh-Hant" : "zh-Hans";
  }
  if (tag.startsWith("pt")) {
    // Brazil is what a bare "pt" means to CLDR and to most speakers. Every
    // other region follows the European orthography, Angola and Mozambique
    // included.
    return /^pt(-BR)?$/i.test(tag) ? "pt-BR" : "pt-PT";
  }
  // Checked last, so an exact code always wins over an alias.
  if (base !== undefined && base in LANGUAGE_ALIASES) {
    return LANGUAGE_ALIASES[base] as LanguageCode;
  }
  return DEFAULT_LANGUAGE;
}

// The device's language, sampled once. `Intl.DateTimeFormat` is present on
// Hermes on both platforms and needs no dependency, which is the same way
// `place-names-store` reads it.
let deviceLanguage: LanguageCode | null = null;

function getDeviceLanguage(): LanguageCode {
  if (deviceLanguage === null) {
    try {
      deviceLanguage = languageForTag(
        Intl.DateTimeFormat().resolvedOptions().locale,
      );
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

// Named, never positional: reordering a sentence is what most languages
// require, and it cannot break a named placeholder. An unknown one is left
// verbatim instead of blanked, so the gap shows up in a screenshot.
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

// The one place numerals are NOT pinned to Latin. `utils/format.ts` pins machine
// data, which sits in the monospace face beside Latin units where Arabic-Indic
// digits next to "MiB" read worse than either alone. A count inside prose is
// prose, and Western digits there jar an Arabic reader as much as the reverse
// would here.
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
      // `other` is required by `PluralForms` and guaranteed by CLDR, so this
      // is a real fallback. It catches the Romance `many`, which selects only
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
// tree. Everything below the root reads through them, which is why every
// language after the first moved no screen.

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
// Services, stores and notification builders cannot use a hook, and read the
// same store so they are never out of step with the screen.
//
// Translate at display, never at storage. A notification body is translated when
// posted; anything persisted to MMKV stores the key and translates on render.
// See `systemKey` in `@store/chat-store` and `@utils/message-text`.

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

// Pinning direction to the app's language matters even for a left-to-right one:
// React Native otherwise mirrors the whole layout on a device set to Arabic or
// Hebrew, putting English text in a right-to-left frame. Pinned, the app looks
// the same everywhere, the guarantee the bundled catalog gives the text.
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
