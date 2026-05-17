import React, { createContext, useContext, ReactNode } from 'react';
import { translations, Language } from './translations';

interface TranslationContextType {
  t: any;
  language: Language;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ 
  children, 
  language 
}: { 
  children: ReactNode; 
  language: Language;
}) {
  const t = translations[language] || translations.EN;

  return (
    <TranslationContext.Provider value={{ t, language }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
