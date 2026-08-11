import type { TranslationKey } from "./locales/types.ts";

export type LanguageCode = "en";

export interface LanguageSpec {
  code: string;
  shortCode: string;
  endonym: string;
  nameKey: TranslationKey;
  direction: "ltr" | "rtl";
}

export const LANGUAGES: Record<LanguageCode, LanguageSpec> = {
  en: {
    code: "en",
    shortCode: "EN",
    endonym: "english",
    nameKey: "settings.language.en",
    direction: "ltr",
  },
};

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export const PLANNED_LANGUAGES: LanguageSpec[] = [
  {
    code: "ar",
    shortCode: "AR",
    endonym: "العربية",
    nameKey: "settings.language.ar",
    direction: "rtl",
  },
  {
    code: "zh-Hans",
    shortCode: "ZH",
    endonym: "简体中文",
    nameKey: "settings.language.zh_hans",
    direction: "ltr",
  },
  {
    code: "de",
    shortCode: "DE",
    endonym: "deutsch",
    nameKey: "settings.language.de",
    direction: "ltr",
  },
  {
    code: "hi",
    shortCode: "HI",
    endonym: "हिन्दी",
    nameKey: "settings.language.hi",
    direction: "ltr",
  },
  {
    code: "id",
    shortCode: "ID",
    endonym: "bahasa indonesia",
    nameKey: "settings.language.id",
    direction: "ltr",
  },
  {
    code: "fa",
    shortCode: "FA",
    endonym: "فارسی",
    nameKey: "settings.language.fa",
    direction: "rtl",
  },
  {
    code: "pt-BR",
    shortCode: "PT",
    endonym: "português",
    nameKey: "settings.language.pt_br",
    direction: "ltr",
  },
  {
    code: "ru",
    shortCode: "RU",
    endonym: "русский",
    nameKey: "settings.language.ru",
    direction: "ltr",
  },
  {
    code: "es",
    shortCode: "ES",
    endonym: "español",
    nameKey: "settings.language.es",
    direction: "ltr",
  },
];
