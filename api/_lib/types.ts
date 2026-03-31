export type MarketSymbol = "XAU" | "XAG" | "XPT" | "XPD";

export type AssetCode =
  | "24K"
  | "18K"
  | "14K"
  | "PLATINUM"
  | "SILVER"
  | "PALLADIUM";

export interface GoldApiPriceResponse {
  currency?: string;
  currencySymbol?: string;
  exchangeRate?: number;
  name?: string;
  price?: number | string;
  symbol?: string;
  updatedAt?: string;
  updatedAtReadable?: string;
}

export interface ExchangeRateInfo {
  baseCurrency: "USD";
  quoteCurrency: "KRW";
  rate: number;
  source: string;
}

export interface ExchangeRateResolveResult {
  info: ExchangeRateInfo;
  fallbackUsed: boolean;
  note?: string;
}

export interface AssetPriceItem {
  displayName: string;
  symbol: MarketSymbol;
  purityRatio: number;
  buyPremiumMultiplier: number;
  buyVatRate: number;
  buyFixedKrwPerGram: number;
  sellDiscountMultiplier: number;
  sellFixedKrwPerGram: number;
  marketPricePerGramKrw: number;
  buyPricePerGramKrw: number;
  sellPricePerGramKrw: number;
  marketPricePerOunceKrw: number;
  buyPricePerOunceKrw: number;
  sellPricePerOunceKrw: number;
  marketPriceForThreePointSevenFiveGramKrw: number;
  buyPriceForThreePointSevenFiveGramKrw: number;
  sellPriceForThreePointSevenFiveGramKrw: number;
}

export interface PriceAlignmentInfo {
  mode: "none" | "env-targets";
  slotKst: "00" | "12" | "18";
  appliedAssets: AssetCode[];
}

export interface PricesResponse {
  assets: Record<AssetCode, AssetPriceItem>;
  updatedAt: string;
  source: "live" | "fallback";
  provider: string;
  currency: "KRW";
  fallbackUsed: boolean;
  exchangeRate: ExchangeRateInfo;
  alignment: PriceAlignmentInfo;
  note?: string;
}
