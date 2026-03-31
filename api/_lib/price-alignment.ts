import { THREE_POINT_SEVEN_FIVE_GRAMS } from "./constants.js";
import type { AssetCode } from "./types.js";

type SlotKst = "00" | "12" | "18";
type PriceAlignmentTarget = {
  buyPricePerGramKrw?: number;
  sellPricePerGramKrw?: number;
};

export interface PriceAlignmentPlan {
  slotKst: SlotKst;
  propagateGold: boolean;
  targets: Partial<Record<AssetCode, PriceAlignmentTarget>>;
}

const ASSET_ENV_LABEL: Record<AssetCode, string> = {
  "24K": "24K",
  "18K": "18K",
  "14K": "14K",
  PLATINUM: "PLATINUM",
  SILVER: "SILVER",
  PALLADIUM: "PALLADIUM"
};

const parsePositiveNumber = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

const parseBoolean = (value: string | undefined, defaultValue: boolean) => {
  if (!value) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "1" || normalized === "true" || normalized === "yes") {
    return true;
  }

  if (normalized === "0" || normalized === "false" || normalized === "no") {
    return false;
  }

  return defaultValue;
};

const resolveKstSlot = (): SlotKst => {
  const kstDate = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const hour = kstDate.getUTCHours();

  if (hour >= 18) {
    return "18";
  }

  if (hour >= 12) {
    return "12";
  }

  return "00";
};

const resolveTargetPerGram = ({
  side,
  asset,
  slotKst
}: {
  side: "BUY" | "SELL";
  asset: AssetCode;
  slotKst: SlotKst;
}) => {
  const label = ASSET_ENV_LABEL[asset];
  const perGramKeys = [
    `PRICE_ALIGN_TARGET_${side}_${label}_PER_GRAM_${slotKst}`,
    `PRICE_ALIGN_TARGET_${side}_${label}_PER_GRAM`
  ];
  const forThreePointSevenFiveGramKeys = [
    `PRICE_ALIGN_TARGET_${side}_${label}_3_75G_${slotKst}`,
    `PRICE_ALIGN_TARGET_${side}_${label}_3_75G`
  ];

  for (const key of perGramKeys) {
    const parsed = parsePositiveNumber(process.env[key]);
    if (parsed !== null) {
      return parsed;
    }
  }

  for (const key of forThreePointSevenFiveGramKeys) {
    const parsed = parsePositiveNumber(process.env[key]);
    if (parsed !== null) {
      return parsed / THREE_POINT_SEVEN_FIVE_GRAMS;
    }
  }

  return null;
};

export const resolvePriceAlignmentPlan = (): PriceAlignmentPlan => {
  const slotKst = resolveKstSlot();
  const targets: Partial<Record<AssetCode, PriceAlignmentTarget>> = {};

  (Object.keys(ASSET_ENV_LABEL) as AssetCode[]).forEach((asset) => {
    const buyPricePerGramKrw = resolveTargetPerGram({
      side: "BUY",
      asset,
      slotKst
    });
    const sellPricePerGramKrw = resolveTargetPerGram({
      side: "SELL",
      asset,
      slotKst
    });

    if (buyPricePerGramKrw === null && sellPricePerGramKrw === null) {
      return;
    }

    targets[asset] = {
      ...(buyPricePerGramKrw !== null ? { buyPricePerGramKrw } : {}),
      ...(sellPricePerGramKrw !== null ? { sellPricePerGramKrw } : {})
    };
  });

  return {
    slotKst,
    propagateGold: parseBoolean(process.env.PRICE_ALIGN_PROPAGATE_GOLD, true),
    targets
  };
};

