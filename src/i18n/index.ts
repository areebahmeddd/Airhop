// The translation runtime.
//
// Design, in one line: translations are plain TypeScript modules compiled into
// the bundle, so the text a user reads is byte-identical on every device
// running a given build. Nothing is fetched, nothing is negotiated, nothing
// depends on the device. A translation fetch would be a network call and a
// fingerprint, in an app whose whole point is making neither.
//
// There is no i18n library on purpose. i18next and react-intl bring namespaces,
// lazy network backends and runtime string keys with no type safety, none of
// which an offline-first app with a bundled catalog can use. Completeness comes
// from `tsc` instead; see `locales/types.ts`.
//
// English ships today, with ten languages scheduled for v1.3.0. One catalog
// means nothing to resolve and nothing to negotiate, so there is no locale store
// and no `Intl` polyfill yet; each arrives with the language that needs it.
//
// This file is the seam that keeps that a small change. Screens call
// `useT("some.key")` rather than writing a literal, `layout.ts` uses logical
// properties rather than physical ones, and `utils/format.ts` formats through
// the active language rather than the device locale. A second language is a
// store behind these hooks and a second catalog, not an edit to sixty screens.

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

// The hook every screen uses. It reads a constant, so it subscribes to nothing
// and its identity is stable, which is what components memoized on `T` want. A
// hook rather than a plain import so that when language becomes state, the
// subscription lands here and no screen changes.
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

// Services, stores and notification builders run outside the component tree
// and cannot use a hook. They read the same catalog, so they are never out of
// step with what is on screen.
//
// Rule for callers: translate at the moment of display, never at the moment of
// storage. A notification body is translated when it is posted; a message, a
// contact name, or anything persisted to MMKV is stored untranslated, or the
// user's history freezes in whichever language it was written in.
export const t: Translator = translator;

export const tPlural: PluralTranslator = pluralTranslator;

export function getLanguage(): LanguageCode {
  return language;
}

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
