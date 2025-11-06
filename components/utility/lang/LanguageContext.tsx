"use client";

import * as React from "react";

interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => void;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState("en");

  React.useEffect(() => {
    const stored = localStorage.getItem("preferred-locale");
    if (stored) setLocale(stored);
  }, []);

  const handleSetLocale = (newLocale: string) => {
    localStorage.setItem("preferred-locale", newLocale);
    setLocale(newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
