
import React, { createContext, useContext, useState } from 'react';
import { IntlProvider } from 'react-intl';
import enMessages from '../translations/en';
import arMessages from '../translations/ar';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const messages = {
  en: enMessages,
  ar: arMessages,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  React.useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage }}>
      <IntlProvider messages={messages[language]} locale={language}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};
