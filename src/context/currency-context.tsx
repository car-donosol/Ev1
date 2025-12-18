"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchRatesCLP, convertFromCLP, formatCurrency } from "@/utils/currency";

type Currency = "CLP" | "USD" | "EUR";

type CurrencyContextType = {
  currency: Currency;
  rates: Record<string, number>;
  setCurrency: (c: Currency) => void;
  formatFromCLP: (amountCLP: number) => string;
  convertFromCLP: (amountCLP: number) => number;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("CLP");
  const [rates, setRates] = useState<Record<string, number>>({ CLP: 1 });

  useEffect(() => {
    let active = true;
    fetchRatesCLP().then((r) => {
      if (active) setRates(r);
    });
    return () => {
      active = false;
    };
  }, []);

  const api = useMemo<CurrencyContextType>(() => {
    return {
      currency,
      rates,
      setCurrency,
      formatFromCLP: (amountCLP: number) =>
        formatCurrency(convertFromCLP(amountCLP, currency, rates), currency),
      convertFromCLP: (amountCLP: number) =>
        convertFromCLP(amountCLP, currency, rates),
    };
  }, [currency, rates]);

  return (
    <CurrencyContext.Provider value={api}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("CurrencyContext missing");
  }
  return ctx;
}
