export type AssetCode =
  | "24K"
  | "18K"
  | "14K"
  | "PLATINUM"
  | "SILVER"
  | "PALLADIUM";

export type MarketSymbol = "XAU" | "XAG" | "XPT" | "XPD";

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

export interface ExchangeRateInfo {
  baseCurrency: "USD";
  quoteCurrency: "KRW";
  rate: number;
  source: string;
}

export interface GoldPriceData {
  assets: Record<AssetCode, AssetPriceItem>;
  updatedAt: string;
  source: "live" | "fallback";
  fallbackUsed: boolean;
  provider: string;
  currency: "KRW";
  exchangeRate: ExchangeRateInfo;
}

export interface GoldPriceApiResponse extends GoldPriceData {
  note?: string;
}
