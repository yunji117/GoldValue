export type AssetCode =
  | "24K"
  | "18K"
  | "14K"
  | "PLATINUM"
  | "SILVER"
  | "PALLADIUM";

export interface LivePriceItem {
  label: string;
  pricePerGramKrw: number;
  pricePerOunceKrw: number;
}

export interface GoldPriceData {
  prices: Record<"gold" | "silver" | "platinum" | "palladium", LivePriceItem>;
  updatedAt: string;
  source: "live" | "mock";
  provider: string;
  currency: "KRW";
}

export interface GoldPriceApiResponse extends GoldPriceData {
  note?: string;
}

export interface CalculationResult {
  asset: AssetCode;
  grams: number;
  multiplier: number;
  estimatedPrice: number;
}
