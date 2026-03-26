import type { AssetCode, CalculationResult, GoldPriceApiResponse } from "../types/gold";

type GramInputParseResult =
  | {
      valid: true;
      value: number;
    }
  | {
      valid: false;
      message: string;
    };

export const ASSET_MULTIPLIER: Record<AssetCode, number> = {
  "24K": 1,
  "18K": 0.75,
  "14K": 0.585,
  PLATINUM: 1,
  SILVER: 1,
  PALLADIUM: 1
};

export const calculateMetalValue = ({
  grams,
  asset,
  pricePerGramKrw,
  multiplier
}: {
  grams: number;
  asset: AssetCode;
  pricePerGramKrw: number;
  multiplier?: number;
}): CalculationResult => {
  const appliedMultiplier = multiplier ?? ASSET_MULTIPLIER[asset];
  const estimatedPrice = grams * pricePerGramKrw * appliedMultiplier;

  return {
    asset,
    grams,
    multiplier: appliedMultiplier,
    estimatedPrice
  };
};

export const parseGramInput = (value: string): GramInputParseResult => {
  const parsed = Number(value);

  if (!value.trim()) {
    return { valid: false, message: "그람 수를 입력해 주세요." };
  }

  if (Number.isNaN(parsed)) {
    return { valid: false, message: "숫자만 입력할 수 있어요." };
  }

  if (parsed <= 0) {
    return { valid: false, message: "0보다 큰 값을 입력해 주세요." };
  }

  if (parsed > 100000) {
    return { valid: false, message: "입력 값이 너무 큽니다." };
  }

  return { valid: true, value: parsed };
};

export const canAcceptDecimalInput = (value: string) =>
  /^\d*(\.\d{0,3})?$/.test(value);

export const getAssetPricePerGram = (
  data: GoldPriceApiResponse,
  asset: AssetCode
) => {
  if (asset === "24K" || asset === "18K" || asset === "14K") {
    return data.prices.gold.pricePerGramKrw;
  }

  if (asset === "PLATINUM") {
    return data.prices.platinum.pricePerGramKrw;
  }

  if (asset === "SILVER") {
    return data.prices.silver.pricePerGramKrw;
  }

  return data.prices.palladium.pricePerGramKrw;
};
