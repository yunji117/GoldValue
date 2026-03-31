import type { AssetCode, GoldPriceApiResponse } from "../types/gold";

export type WeightUnit = "g" | "kg";

type GramInputParseResult =
  | {
      valid: true;
      value: number;
    }
  | {
      valid: false;
      message: string;
    };

export const calculateMetalValue = ({
  grams,
  pricePerGramKrw
}: {
  grams: number;
  pricePerGramKrw: number;
}) => grams * pricePerGramKrw;

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

export const convertToGrams = (value: number, unit: WeightUnit) =>
  unit === "kg" ? value * 1000 : value;

export const getAssetPriceItem = (
  data: GoldPriceApiResponse,
  asset: AssetCode
) => data.assets[asset];
