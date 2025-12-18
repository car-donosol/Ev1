"use client";
import { useCurrency } from "@/context/currency-context";

export function CurrencyPrice({ amount, className }: { amount: number; className?: string }) {
  const { formatFromCLP } = useCurrency();
  return <span className={className}>{formatFromCLP(amount)}</span>;
}
