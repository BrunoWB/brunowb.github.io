import React, { createContext, useContext, useEffect, useState } from 'react';
import type { LocalizedString, SupportedLanguage } from '../types/cv';

interface LanguageContextType {
  selectedLang: SupportedLanguage;
  previewLang: SupportedLanguage | null;
  effectiveLang: SupportedLanguage;
  setSelectedLang: (lang: SupportedLanguage) => void;
  setPreviewLang: (lang: SupportedLanguage | null) => void;
  t: (localized: LocalizedString) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLang?: SupportedLanguage;
}> = ({ children, initialLang = 'en' }) => {
  const [selectedLang, setSelectedLangState] = useState<SupportedLanguage>(initialLang);
  const [previewLang, setPreviewLangState] = useState<SupportedLanguage | null>(null);

  const effectiveLang: SupportedLanguage = previewLang ?? selectedLang;

  useEffect(() => {
    document.documentElement.lang = effectiveLang;
  }, [effectiveLang]);

  const setSelectedLang = (lang: SupportedLanguage) => {
    setSelectedLangState(lang);
    setPreviewLangState(null);
  };

  const setPreviewLang = (lang: SupportedLanguage | null) => {
    setPreviewLangState(lang);
  };

  const t = (localized: LocalizedString): string => {
    return localized[effectiveLang] || localized.en;
  };

  return (
    <LanguageContext.Provider
      value={{
        selectedLang,
        previewLang,
        effectiveLang,
        setSelectedLang,
        setPreviewLang,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
