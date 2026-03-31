import type { AssetCode, MarketSymbol } from "./types.js";

export interface MetalAssetConfig {
  asset: AssetCode;
  displayName: string;
  symbol: MarketSymbol;
  purityRatio: number;
  buyPremiumMultiplier: number;
  buyVatRate: number;
  buyFixedKrwPerGram: number;
  sellDiscountMultiplier: number;
  sellFixedKrwPerGram: number;
}

// 국내 시장 시세에 더 가깝게 맞추고 싶다면 이 값들만 조정하면 됩니다.
export const METAL_ASSET_CONFIG: Record<AssetCode, MetalAssetConfig> = {
  "24K": {
    asset: "24K",
    displayName: "24K Gold",
    symbol: "XAU",
    purityRatio: 1,
    buyPremiumMultiplier: 1.0689,
    buyVatRate: 0.1,
    buyFixedKrwPerGram: 0,
    sellDiscountMultiplier: 0.996,
    sellFixedKrwPerGram: 0
  },
  "18K": {
    asset: "18K",
    displayName: "18K Gold",
    symbol: "XAU",
    purityRatio: 0.75,
    buyPremiumMultiplier: 1.0689,
    buyVatRate: 0.1,
    buyFixedKrwPerGram: 0,
    sellDiscountMultiplier: 0.9761,
    sellFixedKrwPerGram: 0
  },
  "14K": {
    asset: "14K",
    displayName: "14K Gold",
    symbol: "XAU",
    purityRatio: 0.585,
    buyPremiumMultiplier: 1.0689,
    buyVatRate: 0.1,
    buyFixedKrwPerGram: 0,
    sellDiscountMultiplier: 0.9705,
    sellFixedKrwPerGram: 0
  },
  PLATINUM: {
    asset: "PLATINUM",
    displayName: "Platinum",
    symbol: "XPT",
    purityRatio: 1,
    buyPremiumMultiplier: 1.0747,
    buyVatRate: 0.1,
    buyFixedKrwPerGram: 0,
    sellDiscountMultiplier: 0.9596,
    sellFixedKrwPerGram: 0
  },
  SILVER: {
    asset: "SILVER",
    displayName: "Silver",
    symbol: "XAG",
    purityRatio: 1,
    buyPremiumMultiplier: 1.0551,
    buyVatRate: 0.1,
    buyFixedKrwPerGram: 0,
    sellDiscountMultiplier: 0.9335,
    sellFixedKrwPerGram: 0
  },
  PALLADIUM: {
    asset: "PALLADIUM",
    displayName: "Palladium",
    symbol: "XPD",
    purityRatio: 1,
    buyPremiumMultiplier: 1.05,
    buyVatRate: 0.1,
    buyFixedKrwPerGram: 0,
    sellDiscountMultiplier: 0.94,
    sellFixedKrwPerGram: 0
  }
};

export const GOLD_API_SYMBOLS: MarketSymbol[] = ["XAU", "XAG", "XPT", "XPD"];
