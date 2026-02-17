import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'CZ';
type Currency = 'USD' | 'CZK';

interface LanguageContextType {
  language: Language;
  currency: Currency;
  toggleLanguage: () => void;
  t: (en: string, cz: string) => string;
  formatCurrency: (amountUSD: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');
  const currency: Currency = language === 'EN' ? 'USD' : 'CZK';

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'CZ' : 'EN');
  };

  const t = (en: string, cz: string) => language === 'EN' ? en : cz;

  const formatCurrency = (amountUSD: number) => {
    if (currency === 'CZK') {
      return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(amountUSD * 25);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amountUSD);
  };

  return (
    <LanguageContext.Provider value={{ language, currency, toggleLanguage, t, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
