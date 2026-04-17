import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Language, type TranslationKey } from "./i18n";

const STORAGE_KEY = "kanban-board-language";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "de";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "en" ? "en" : "de";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const setLanguage = (language: Language) => setLanguageState(language);
  const t = (key: TranslationKey) => translations[language][key];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within LanguageProvider");
  }
  return context;
}
