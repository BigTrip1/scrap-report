import { Currency } from "@/types/scrap";

// Default currencies with their symbols and initial exchange rates
export const currencies: { [key: string]: Currency } = {
  GBP: { code: "GBP", symbol: "£", rate: 1 },
  USD: { code: "USD", symbol: "$", rate: 1.27 }, // Example rate
  EUR: { code: "EUR", symbol: "€", rate: 1.17 }, // Example rate
  INR: { code: "INR", symbol: "₹", rate: 105.5 }, // Example rate
};

export const defaultCurrency = "GBP";

// Convert amount from one currency to another
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const from = currencies[fromCurrency];
  const to = currencies[toCurrency];

  if (!from || !to) {
    console.error(
      `Invalid currency conversion: ${fromCurrency} to ${toCurrency}`
    );
    return amount;
  }

  // Convert to base currency (GBP) first, then to target currency
  const inGBP = amount / from.rate;
  return inGBP * to.rate;
}

// Format amount with currency symbol
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = currencies[currencyCode] || currencies[defaultCurrency];
  return `${currency.symbol}${amount.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Update exchange rates (to be called periodically or on-demand)
export async function updateExchangeRates(): Promise<void> {
  try {
    // In a production environment, you would fetch current exchange rates from an API
    // Example using Exchange Rate API:
    // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/GBP`);
    // const data = await response.json();
    // Object.keys(currencies).forEach(code => {
    //   if (code !== 'GBP') {
    //     currencies[code].rate = data.rates[code];
    //   }
    // });

    console.log("Exchange rates updated");
  } catch (error) {
    console.error("Failed to update exchange rates:", error);
  }
}
