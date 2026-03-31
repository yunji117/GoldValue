import {
  METAL_ASSET_CONFIG,
  type MetalAssetConfig
} from "./metals-config.js";
import { resolvePriceAlignmentPlan } from "./price-alignment.js";
import {
  THREE_POINT_SEVEN_FIVE_GRAMS,
  TROY_OUNCE_TO_GRAMS
} from "./constants.js";
import type {
  AssetCode,
  ExchangeRateInfo,
  MarketSymbol,
  PriceAlignmentInfo,
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

const GOLD_ASSETS: AssetCode[] = ["24K", "18K", "14K"];

const roundKrw = (value: number) => Math.round(value);

const toKrwPerOunce = (usdPerOunce: number, usdKrwRate: number) =>
  usdPerOunce * usdKrwRate;

const toKrwPerGram = (usdPerOunce: number, usdKrwRate: number) =>
  toKrwPerOunce(usdPerOunce, usdKrwRate) / TROY_OUNCE_TO_GRAMS;

const normalizeNonNegative = (value: number) => (value < 0 ? 0 : value);

const toSafeNonNegative = (value: number, fallback: number) => {
  if (!Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return value;
};

const buildBuyPricePerGram = ({
  baseKrwPerGram,
  config
}: {
  baseKrwPerGram: number;
  config: MetalAssetConfig;
}) =>
  baseKrwPerGram * config.buyPremiumMultiplier * (1 + config.buyVatRate) +
  config.buyFixedKrwPerGram;

const buildSellPricePerGram = ({
  baseKrwPerGram,
  config
}: {
  baseKrwPerGram: number;
  config: MetalAssetConfig;
}) =>
  baseKrwPerGram * config.sellDiscountMultiplier + config.sellFixedKrwPerGram;

const deriveBuyPremiumMultiplier = ({
  targetBuyPricePerGramKrw,
  baseKrwPerGram,
  config,
  fallback
}: {
  targetBuyPricePerGramKrw: number;
  baseKrwPerGram: number;
  config: MetalAssetConfig;
  fallback: number;
}) => {
  const denominator = baseKrwPerGram * (1 + config.buyVatRate);

  if (denominator <= 0) {
    return fallback;
  }

  return toSafeNonNegative(
    (targetBuyPricePerGramKrw - config.buyFixedKrwPerGram) / denominator,
    fallback
  );
};

const deriveSellDiscountMultiplier = ({
  targetSellPricePerGramKrw,
  baseKrwPerGram,
  config,
  fallback
}: {
  targetSellPricePerGramKrw: number;
  baseKrwPerGram: number;
  config: MetalAssetConfig;
  fallback: number;
}) => {
  if (baseKrwPerGram <= 0) {
    return fallback;
  }

  return toSafeNonNegative(
    (targetSellPricePerGramKrw - config.sellFixedKrwPerGram) / baseKrwPerGram,
    fallback
  );
};

const buildAssetItemFromPerGram = ({
  marketPricePerGram,
  buyPricePerGram,
  sellPricePerGram,
  config
}: {
  marketPricePerGram: number;
  buyPricePerGram: number;
  sellPricePerGram: number;
  config: MetalAssetConfig;
}) => {
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
  alignment,
  note
}: {
  assets: PricesResponse["assets"];
  updatedAt: string;
  source: PricesResponse["source"];
  provider: string;
  exchangeRate: ExchangeRateInfo;
  fallbackUsed: boolean;
  alignment: PriceAlignmentInfo;
  note?: string;
}): PricesResponse => ({
  assets,
  updatedAt,
  source,
  provider,
  currency: "KRW",
  fallbackUsed,
  exchangeRate,
  alignment,
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
  const alignmentPlan = resolvePriceAlignmentPlan();
  const alignmentAppliedAssets = new Set<AssetCode>();

  const baseKrwPerGramByAsset = (Object.keys(METAL_ASSET_CONFIG) as AssetCode[]).reduce(
    (acc, asset) => {
      const config = METAL_ASSET_CONFIG[asset];
      acc[asset] =
        toKrwPerGram(usdPerOunceBySymbol[config.symbol], exchangeRate.rate) * config.purityRatio;
      return acc;
    },
    {} as Record<AssetCode, number>
  );

  const base24K = baseKrwPerGramByAsset["24K"];
  const config24K = METAL_ASSET_CONFIG["24K"];
  const target24K = alignmentPlan.targets["24K"];

  const derived24KBuyMultiplier =
    target24K?.buyPricePerGramKrw !== undefined
      ? deriveBuyPremiumMultiplier({
          targetBuyPricePerGramKrw: target24K.buyPricePerGramKrw,
          baseKrwPerGram: base24K,
          config: config24K,
          fallback: config24K.buyPremiumMultiplier
        })
      : null;
  const derived24KSellMultiplier =
    target24K?.sellPricePerGramKrw !== undefined
      ? deriveSellDiscountMultiplier({
          targetSellPricePerGramKrw: target24K.sellPricePerGramKrw,
          baseKrwPerGram: base24K,
          config: config24K,
          fallback: config24K.sellDiscountMultiplier
        })
      : null;

  const assets = (Object.keys(METAL_ASSET_CONFIG) as AssetCode[]).reduce(
    (acc, asset) => {
      const config = METAL_ASSET_CONFIG[asset];
      const baseKrwPerGram = baseKrwPerGramByAsset[asset];
      const target = alignmentPlan.targets[asset];

      const appliedConfig: MetalAssetConfig = {
        ...config
      };

      const shouldPropagateGoldMultiplier =
        alignmentPlan.propagateGold && GOLD_ASSETS.includes(asset) && !target;

      if (shouldPropagateGoldMultiplier) {
        if (derived24KBuyMultiplier !== null) {
          appliedConfig.buyPremiumMultiplier = derived24KBuyMultiplier;
          alignmentAppliedAssets.add(asset);
        }

        if (derived24KSellMultiplier !== null) {
          appliedConfig.sellDiscountMultiplier = derived24KSellMultiplier;
          alignmentAppliedAssets.add(asset);
        }
      }

      let buyKrwPerGram = buildBuyPricePerGram({
        baseKrwPerGram,
        config: appliedConfig
      });
      let sellKrwPerGram = buildSellPricePerGram({
        baseKrwPerGram,
        config: appliedConfig
      });

      if (target?.buyPricePerGramKrw !== undefined) {
        buyKrwPerGram = target.buyPricePerGramKrw;
        appliedConfig.buyPremiumMultiplier = deriveBuyPremiumMultiplier({
          targetBuyPricePerGramKrw: target.buyPricePerGramKrw,
          baseKrwPerGram,
          config: appliedConfig,
          fallback: appliedConfig.buyPremiumMultiplier
        });
        alignmentAppliedAssets.add(asset);
      }

      if (target?.sellPricePerGramKrw !== undefined) {
        sellKrwPerGram = target.sellPricePerGramKrw;
        appliedConfig.sellDiscountMultiplier = deriveSellDiscountMultiplier({
          targetSellPricePerGramKrw: target.sellPricePerGramKrw,
          baseKrwPerGram,
          config: appliedConfig,
          fallback: appliedConfig.sellDiscountMultiplier
        });
        alignmentAppliedAssets.add(asset);
      }

      acc[asset] = buildAssetItemFromPerGram({
        marketPricePerGram: baseKrwPerGram,
        buyPricePerGram: buyKrwPerGram,
        sellPricePerGram: sellKrwPerGram,
        config: appliedConfig
      });

      return acc;
    },
    {} as PricesResponse["assets"]
  );

  const appliedAssets = Array.from(alignmentAppliedAssets);

  return buildResponse({
    assets,
    updatedAt,
    source,
    provider,
    exchangeRate,
    fallbackUsed,
    alignment: {
      mode: appliedAssets.length > 0 ? "env-targets" : "none",
      slotKst: alignmentPlan.slotKst,
      appliedAssets
    },
    note
  });
};
