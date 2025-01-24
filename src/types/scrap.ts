export interface Currency {
  code: string; // e.g., 'GBP', 'USD', 'EUR'
  symbol: string; // e.g., '£', '$', '€'
  rate: number; // Exchange rate relative to base currency (GBP)
}

export interface ScrapItem {
  material: string;
  materialDescription: string;
  quantity: number;
  cost: number;
  documentDate: string;
  userName: string;
  reasonArea: string;
  currency: string; // Currency code (e.g., 'GBP')
}

export interface ScrapSummary {
  totalCost: number;
  partsCount: number;
  averageCPM: number;
  currency: string; // Add currency to summary
}

export interface MonthlyData {
  month: string;
  totalCost: number;
  quantity: number;
  cpm: number;
}

export interface TopPart {
  material: string;
  materialDescription: string;
  quantity: number;
  cost: number;
  reasonArea: string;
  documentDate: string;
}

export interface ScrapData {
  summary: {
    totalCost: number;
    partsCount: number;
    averageCPM: number;
  };
  monthlyData: MonthlyData[];
  topParts: TopPart[];
}
