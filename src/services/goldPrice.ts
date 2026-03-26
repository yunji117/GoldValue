import { mockGoldPrice } from "../data/mockGoldPrice";
import type { GoldPriceApiResponse } from "../types/gold";

interface PricesApiResponse {
  gold24kPerGram: number;
  gold18kPerGram: number;
  gold14kPerGram: number;
  silverPerGram: number;
  platinumPerGram: number;
  palladiumPerGram: number;
  updatedAt: string;
  source: "live" | "mock";
  note?: string;
}

const TROY_OUNCE_TO_GRAMS = 31.1035;

const API_ENDPOINT = import.meta.env.VITE_GOLD_API_ENDPOINT || "/api/prices";

const toPerOuncePrice = (pricePerGramKrw: number) =>
  Math.round(pricePerGramKrw * TROY_OUNCE_TO_GRAMS);

const mapPricesResponse = (data: PricesApiResponse): GoldPriceApiResponse => ({
  prices: {
    gold: {
      label: "24K Gold",
      pricePerGramKrw: data.gold24kPerGram,
      pricePerOunceKrw: toPerOuncePrice(data.gold24kPerGram)
    },
    silver: {
      label: "Silver",
      pricePerGramKrw: data.silverPerGram,
      pricePerOunceKrw: toPerOuncePrice(data.silverPerGram)
    },
    platinum: {
      label: "Platinum",
      pricePerGramKrw: data.platinumPerGram,
      pricePerOunceKrw: toPerOuncePrice(data.platinumPerGram)
    },
    palladium: {
      label: "Palladium",
      pricePerGramKrw: data.palladiumPerGram,
      pricePerOunceKrw: toPerOuncePrice(data.palladiumPerGram)
    }
  },
  updatedAt: data.updatedAt,
  source: data.source,
  provider: data.source === "live" ? "APISED" : "Mock Gold Feed",
  currency: "KRW",
  note: data.note
});

export const getGoldPrice = async (): Promise<GoldPriceApiResponse> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("금 시세 정보를 불러오지 못했습니다.");
    }

    const data = (await response.json()) as PricesApiResponse;
    return mapPricesResponse(data);
  } catch {
    return {
      ...mockGoldPrice,
      note: "외부 API 연결에 실패해 mock 데이터로 표시 중입니다."
    };
  }
};
