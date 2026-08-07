// The translation runtime.
//
// Design, in one line: translations are plain TypeScript modules compiled into
// the bundle, so the text a user reads is byte-identical on every device
// running a given build. Nothing is fetched, nothing is negotiated, nothing
// depends on the device. A translation fetch would be a network call and a
// fingerprint, in an app whose whole point is making neither.
//
// There is no i18n library here on purpose. Airhop hand-rolls its bottom sheet,
// alert, toast and theme layers rather than pulling dependencies, and the
// libraries in this space (i18next, react-intl) bring namespaces, lazy network
// backends, and runtime string keys with no type safety, none of which an
// offline-first app with a bundled catalog can use. What we get instead is
// completeness enforced by `tsc` (see `locales/types.ts`).
//
// Scope: English, with ten languages scheduled for v1.3.0. One catalog means
// nothing to resolve and nothing to negotiate, so there is no locale store and
// no `Intl` polyfill here yet; each arrives with the language that needs it.
//
// What this file is for is the seam. Every screen calls `useT("some.key")`
// instead of writing a literal, `layout.ts` uses logical properties instead of
// physical ones, and `utils/format.ts` formats through the active language
// rather than the default locale. A second language is a store behind these
// hooks and a second catalog, not an edit to sixty screens.

import { I18nManager } from "react-native";
import { DEFAULT_LANGUAGE, isRTL, type LanguageCode } from "./languages";
import { en } from "./locales/en";
import type { Locale, PluralKey, TranslationKey } from "./locales/types";

export type { LanguageCode } from "./languages";
export type { TranslationKey } from "./locales/types";

// The active catalog and language. Constants rather than store state while
// there is one of each; the accessors below exist so that call sites already
// read them the way they would read a store.
const locale: Locale = en;
const language: LanguageCode = DEFAULT_LANGUAGE;

// ---- Interpolation --------------------------------------------------------

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

// ---- Lookup ---------------------------------------------------------------

export interface Translator {
  // The language this translator is bound to, for callers that need to format
  // a date or a number in the same locale as the surrounding text.
  readonly language: LanguageCode;
  (key: TranslationKey, vars?: TranslationVars): string;
}

export interface PluralTranslator {
  (key: PluralKey, count: number, vars?: TranslationVars): string;
}

const translator: Translator = Object.assign(
  (key: TranslationKey, vars?: TranslationVars): string =>
    interpolate(locale.strings[key], vars),
  { language },
);

// The only sanctioned `count === 1` in the codebase, and the one piece of this
// runtime that does not generalise.
//
// English has exactly two plural categories and this is their rule. Other
// languages do not work this way: Russian needs one/few/many/other and Arabic
// needs all six, so a second language means real CLDR selection, which means
// `Intl.PluralRules`. Hermes implements `DateTimeFormat`, `NumberFormat` and
// `Collator` but not `PluralRules`, on either platform, so that day also means
// `@formatjs/intl-pluralrules`. Both land in v1.3.0 with the catalogs.
//
// Callers still go through `tPlural`. The rule lives here, once, where the next
// language replaces it. Writing `n === 1 ? "" : "s"` at a call site is a
// different thing and stays a build failure: `npm run i18n:audit` reports it.
const pluralTranslator: PluralTranslator = (key, count, vars) => {
  const forms = locale.plurals[key];
  // `other` is required by `PluralForms` and is the category CLDR guarantees
  // exists in every language, so this is a real fallback rather than a hopeful
  // one.
  const template = (count === 1 ? forms.one : forms.other) ?? forms.other;
  return interpolate(template, { count, ...vars });
};

// ---- React ----------------------------------------------------------------

// The hook every screen uses. It reads a constant today, so it does not
// subscribe to anything and its identity is stable, which is what components
// memoized on `T` want. It is a hook rather than a plain import so that the day
// language becomes state, the subscription lands here and no screen changes.
export function useT(): Translator {
  return translator;
}

export function useTPlural(): PluralTranslator {
  return pluralTranslator;
}

// The active language, for components that need the code itself (formatting,
// `Intl`) rather than a translated string.
export function useLanguage(): LanguageCode {
  return language;
}

// ---- Outside React --------------------------------------------------------

// Services, stores and notification builders run outside the component tree
// and cannot use a hook. They read the same catalog, so they are never out of
// step with what is on screen.
//
// Rule for callers: translate at the moment of display, never at the moment of
// storage. A notification body is translated when it is posted; a message, a
// contact name, or anything persisted to MMKV is stored untranslated, or the
// user's history freezes in whichever language they used to be in.
export const t: Translator = translator;

export const tPlural: PluralTranslator = pluralTranslator;

export function getLanguage(): LanguageCode {
  return language;
}

// ---- Layout direction -----------------------------------------------------

// `I18nManager.forceRTL` sets a native flag that is only read when the app
// starts, so a direction change cannot take effect until the next launch.
//
// Pinning it to the active language matters even while that language is always
// English: React Native otherwise mirrors the entire layout on a device set to
// Arabic or Hebrew, which puts English text in a right-to-left frame. Pinned,
// the app looks the same on every device, which is the same guarantee the
// bundled catalog gives the text.
export function applyLayoutDirection(code: LanguageCode): void {
  const shouldBeRTL = isRTL(code);
  I18nManager.allowRTL(shouldBeRTL);
  if (I18nManager.isRTL !== shouldBeRTL) I18nManager.forceRTL(shouldBeRTL);
}

// Called once from App.tsx before the first render, so the first frame is
// already laid out correctly.
export function initI18n(): void {
  applyLayoutDirection(language);
}

// The language picker's data, re-exported so a screen imports it alongside
// `useT`. DEFAULT_LANGUAGE, isRTL and LANGUAGE_ORDER are not: they are model
// details, and their callers import them from ./languages directly.
export { LANGUAGES, PLANNED_LANGUAGES } from "./languages";
