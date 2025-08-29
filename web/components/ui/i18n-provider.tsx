"use client";

import React from "react";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import es from "@/locales/es.json";
import { useRouter } from "next/navigation";

export type LanguageCode = "en" | "fr" | "es";

type Messages = Record<string, any>;

const DICTS: Record<LanguageCode, Messages> = { en, fr, es } as const;

function getByPath(obj: Messages, path: string) {
  return path
    .split(".")
    .reduce<any>((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), obj);
}

export interface I18nContextValue {
  lang: LanguageCode;
  t: (key: string) => string;
  setLanguage: (lang: LanguageCode) => void;
}

const I18nContext = React.createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ initialLanguage, children }: { initialLanguage: LanguageCode; children: React.ReactNode }) {
  const [lang, setLang] = React.useState<LanguageCode>(initialLanguage ?? "en");
  const router = useRouter();

  const allowed: LanguageCode[] = ["en", "fr", "es"];
  const normalize = (code?: string | null): LanguageCode | undefined => {
    if (!code) return undefined;
    const lower = String(code).toLowerCase();
    return (allowed as string[]).includes(lower) ? (lower as LanguageCode) : undefined;
  };

  React.useEffect(() => {
    const cookieLang = typeof document !== "undefined" ? document.cookie.match(/(?:^|; )lang=([^;]*)/)?.[1] : undefined;
    const stored = typeof window !== "undefined" ? (localStorage.getItem("lang") as string | null) : null;
    const preferred = normalize(cookieLang) || normalize(stored);
    if (preferred && preferred !== lang) setLang(preferred);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = React.useCallback((code: LanguageCode) => {
    const next = normalize(code) ?? "en";
    setLang(next);
    if (typeof document !== "undefined") {
      document.cookie = `lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", next);
      document.documentElement.setAttribute("lang", next);
      // No router.refresh() here; client context update is sufficient
    }
  }, []);

  const value: I18nContextValue = React.useMemo(() => ({
    lang,
    t: (key: string) => {
      const val = getByPath(DICTS[lang], key);
      if (val != null) return String(val);
      const fallback = getByPath(DICTS.en, key);
      return String(fallback ?? key);
    },
    setLanguage
  }), [lang, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}