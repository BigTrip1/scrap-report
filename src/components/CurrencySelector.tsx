"use client";

import { useCurrency } from "@/contexts/CurrencyContext";

export function CurrencySelector() {
  const { currentCurrency, setCurrentCurrency, availableCurrencies } =
    useCurrency();

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="currency-select" className="text-sm text-gray-400">
        Currency:
      </label>
      <select
        id="currency-select"
        value={currentCurrency}
        onChange={(e) => setCurrentCurrency(e.target.value)}
        className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableCurrencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} ({currency.symbol})
          </option>
        ))}
      </select>
    </div>
  );
}
