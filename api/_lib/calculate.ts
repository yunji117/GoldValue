import { METAL_ASSET_CONFIG } from "./metals-config.js";
import {
  THREE_POINT_SEVEN_FIVE_GRAMS,
  TROY_OUNCE_TO_GRAMS
} from "./constants.js";
import type {
  AssetCode,
  ExchangeRateInfo,
  MarketSymbol,
  PricesResponse
} from "./types.js";

type BuildPricesPayloadParams = {
  usdPerOunceBySymbol: Record<MarketSymbol, number>;
  updatedAt: string;
  source: PricesResponse["source"];
  provider: string;
  exchangeRate: ExchangeRateInfo;
  fallbackUsed: boolean;
  note?: string;
};

const roundKrw = (value: number) => Math.round(value);

const toKrwPerOunce = (usdPerOunce: number, usdKrwRate: number) =>
  usdPerOunce * usdKrwRate;

const toKrwPerGram = (usdPerOunce: number, usdKrwRate: number) =>
  toKrwPerOunce(usdPerOunce, usdKrwRate) / TROY_OUNCE_TO_GRAMS;

const normalizeNonNegative = (value: number) => (value < 0 ? 0 : value);

const buildAssetItemFromPerGram = ({
  asset,
  marketPricePerGram,
  buyPricePerGram,
  sellPricePerGram
}: {
  asset: AssetCode;
  marketPricePerGram: number;
  buyPricePerGram: number;
  sellPricePerGram: number;
}) => {
  const config = METAL_ASSET_CONFIG[asset];
  const marketPricePerGramKrw = roundKrw(normalizeNonNegative(marketPricePerGram));
  const buyPricePerGramKrw = roundKrw(normalizeNonNegative(buyPricePerGram));
  const sellPricePerGramKrw = roundKrw(normalizeNonNegative(sellPricePerGram));

  return {
    displayName: config.displayName,
    symbol: config.symbol,
    purityRatio: config.purityRatio,
    buyPremiumMultiplier: config.buyPremiumMultiplier,
    buyVatRate: config.buyVatRate,
    buyFixedKrwPerGram: config.buyFixedKrwPerGram,
    sellDiscountMultiplier: config.sellDiscountMultiplier,
    sellFixedKrwPerGram: config.sellFixedKrwPerGram,
    marketPricePerGramKrw,
    buyPricePerGramKrw,
    sellPricePerGramKrw,
    marketPricePerOunceKrw: roundKrw(marketPricePerGramKrw * TROY_OUNCE_TO_GRAMS),
    buyPricePerOunceKrw: roundKrw(buyPricePerGramKrw * TROY_OUNCE_TO_GRAMS),
    sellPricePerOunceKrw: roundKrw(sellPricePerGramKrw * TROY_OUNCE_TO_GRAMS),
    marketPriceForThreePointSevenFiveGramKrw: roundKrw(
      marketPricePerGramKrw * THREE_POINT_SEVEN_FIVE_GRAMS
    ),
    buyPriceForThreePointSevenFiveGramKrw: roundKrw(
      buyPricePerGramKrw * THREE_POINT_SEVEN_FIVE_GRAMS
    ),
    sellPriceForThreePointSevenFiveGramKrw: roundKrw(
      sellPricePerGramKrw * THREE_POINT_SEVEN_FIVE_GRAMS
    )
  };
};

const buildResponse = ({
  assets,
  updatedAt,
  source,
  provider,
  exchangeRate,
  fallbackUsed,
  note
}: {
  assets: PricesResponse["assets"];
  updatedAt: string;
  source: PricesResponse["source"];
  provider: string;
  exchangeRate: ExchangeRateInfo;
  fallbackUsed: boolean;
  note?: string;
}): PricesResponse => ({
  assets,
  updatedAt,
  source,
  provider,
  currency: "KRW",
  fallbackUsed,
  exchangeRate,
  ...(note ? { note } : {})
});

export const buildPricesPayload = ({
  usdPerOunceBySymbol,
  updatedAt,
  source,
  provider,
  exchangeRate,
  fallbackUsed,
  note
}: BuildPricesPayloadParams): PricesResponse => {
  const assets = (Object.keys(METAL_ASSET_CONFIG) as AssetCode[]).reduce(
    (acc, asset) => {
      const config = METAL_ASSET_CONFIG[asset];
      const baseKrwPerGram =
        toKrwPerGram(usdPerOunceBySymbol[config.symbol], exchangeRate.rate) * config.purityRatio;

      const buyKrwPerGram =
        baseKrwPerGram * config.buyPremiumMultiplier * (1 + config.buyVatRate) +
        config.buyFixedKrwPerGram;
      const sellKrwPerGram =
        baseKrwPerGram * config.sellDiscountMultiplier + config.sellFixedKrwPerGram;

      acc[asset] = buildAssetItemFromPerGram({
        asset,
        marketPricePerGram: baseKrwPerGram,
        buyPricePerGram: buyKrwPerGram,
        sellPricePerGram: sellKrwPerGram
      });

      return acc;
    },
    {} as PricesResponse["assets"]
  );

  return buildResponse({
    assets,
    updatedAt,
    source,
    provider,
    exchangeRate,
    fallbackUsed,
    note
  });
};
