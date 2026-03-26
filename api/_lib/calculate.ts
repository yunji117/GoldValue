import { GOLD_PURITY } from "./constants";
import type { PricesResponse } from "./types";

export const roundPrice = (value: number) => Math.round(value);

export const buildPricesPayload = ({
  gold24kPerGram,
  silverPerGram,
  platinumPerGram,
  palladiumPerGram,
  updatedAt
}: {
  gold24kPerGram: number;
  silverPerGram: number;
  platinumPerGram: number;
  palladiumPerGram: number;
  updatedAt: string;
}): PricesResponse => {
  return {
    gold24kPerGram: roundPrice(gold24kPerGram),
    gold18kPerGram: roundPrice(gold24kPerGram * GOLD_PURITY.GOLD_18K),
    gold14kPerGram: roundPrice(gold24kPerGram * GOLD_PURITY.GOLD_14K),
    silverPerGram: roundPrice(silverPerGram),
    platinumPerGram: roundPrice(platinumPerGram),
    palladiumPerGram: roundPrice(palladiumPerGram),
    updatedAt,
    source: "live"
  };
};
