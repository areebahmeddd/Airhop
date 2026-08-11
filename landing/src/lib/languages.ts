export interface LanguageSpec {
  code: string;
  tag: string;
  name: string;
  endonym: string;
}

export const ACTIVE_LANGUAGE: LanguageSpec = {
  code: "EN",
  tag: "en",
  name: "English",
  endonym: "english",
};

export const PLANNED_LANGUAGES: LanguageSpec[] = [
  { code: "AR", tag: "ar", name: "Arabic", endonym: "العربية" },
  { code: "ZH", tag: "zh-Hans", name: "Chinese (Simplified)", endonym: "简体中文" },
  { code: "DE", tag: "de", name: "German", endonym: "deutsch" },
  { code: "HI", tag: "hi", name: "Hindi", endonym: "हिन्दी" },
  { code: "ID", tag: "id", name: "Indonesian", endonym: "bahasa indonesia" },
  { code: "FA", tag: "fa", name: "Persian", endonym: "فارسی" },
  { code: "PT", tag: "pt-BR", name: "Portuguese (Brazil)", endonym: "português" },
  { code: "RU", tag: "ru", name: "Russian", endonym: "русский" },
  { code: "ES", tag: "es", name: "Spanish", endonym: "español" },
];
