import { DEFAULT_LANGUAGE, type LanguageCode } from "./languages.ts";
import { en } from "./locales/en.ts";
import type { Locale, TranslationKey } from "./locales/types.ts";

export { LANGUAGES, PLANNED_LANGUAGES, type LanguageSpec } from "./languages.ts";
export type { LanguageCode } from "./languages.ts";
export type { TranslationKey } from "./locales/types.ts";

const locale: Locale = en;
const language: LanguageCode = DEFAULT_LANGUAGE;

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

export const t: Translator = Object.assign(
  (key: TranslationKey, vars?: TranslationVars): string => interpolate(locale.strings[key], vars),
  { language },
);

export function useT(): Translator {
  return t;
}
