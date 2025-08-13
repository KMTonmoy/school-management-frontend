"use client";
import { translateText } from "@/lib/translationService";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, string>>({});

  const translate = async (text: string) => {
    if (language === "en") return text;
    const cacheKey = `${language}:${text}`;
    if (cache[cacheKey]) return cache[cacheKey];

    setIsLoading(true);
    try {
      const translatedText = await translateText(text, language);
      setCache((prev) => ({ ...prev, [cacheKey]: translatedText }));
      return translatedText;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, translate, isLoading }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
