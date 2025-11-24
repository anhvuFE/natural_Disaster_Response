import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { vi } from "@/locales/vi";
import { en } from "@/locales/en";

const STORAGE_KEY = "ndr_lang";

const translations = {
  vi,
  en,
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof vi;
type Params = Record<string, string | number>;

interface I18nContextValue {
  lang: Language;
  t: (key: TranslationKey, params?: Params) => string;
  setLang: (lang: Language) => void;
  available: { code: Language; label: string }[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

function format(template: string, params?: Params) {
  if (!params) return template;
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => String(params[key.trim()] ?? ""));
}

function getInitialLang(): Language {
  if (typeof window === "undefined") return "vi";
  const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;
  if (saved && saved in translations) return saved;
  return "vi";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(getInitialLang);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  }, [lang]);

  const translate = useCallback(
    (key: TranslationKey, params?: Params) => {
      const dict = translations[lang] || translations.vi;
      const fallback = translations.vi;
      const template = dict[key] || fallback[key] || key;
      return format(template, params);
    },
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      t: translate,
      setLang,
      available: [
        { code: "vi" as const, label: translations[lang]["language.vi"] },
        { code: "en" as const, label: translations[lang]["language.en"] },
      ],
    }),
    [lang, translate]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
