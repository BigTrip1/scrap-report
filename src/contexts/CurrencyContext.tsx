"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  currencies,
  defaultCurrency,
  updateExchangeRates,
} from "@/lib/currency";
import { Currency } from "@/types/scrap";

interface CurrencyContextType {
  currentCurrency: string;
  setCurrentCurrency: (currency: string) => void;
  availableCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentCurrency, setCurrentCurrency] = useState(defaultCurrency);
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>(
    []
  );

  useEffect(() => {
    // Initialize available currencies
    setAvailableCurrencies(Object.values(currencies));

    // Update exchange rates periodically (every hour)
    updateExchangeRates();
    const interval = setInterval(updateExchangeRates, 3600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrentCurrency,
        availableCurrencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
