import { matchLanguage, type LanguageCode } from "@/i18n";

const STORAGE_KEY = "airhop-language";

export function rememberLanguage(code: LanguageCode): void {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    return;
  }
}

function hasPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return true;
  }
}

export function suggestLanguage(current: LanguageCode): LanguageCode | null {
  if (hasPreference()) return null;

  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  const match = matchLanguage(preferred);
  return match !== null && match !== current ? match : null;
}
