import type { GoldPriceApiResponse } from "../types/gold";

export const mockGoldPrice: GoldPriceApiResponse = {
  // 실제 API 연결 전 테스트용
  prices: {
    gold: {
      label: "24K Gold",
      pricePerGramKrw: 142000,
      pricePerOunceKrw: 4416794
    },
    silver: {
      label: "Silver",
      pricePerGramKrw: 1650,
      pricePerOunceKrw: 51321
    },
    platinum: {
      label: "Platinum",
      pricePerGramKrw: 48500,
      pricePerOunceKrw: 150854
    },
    palladium: {
      label: "Palladium",
      pricePerGramKrw: 46200,
      pricePerOunceKrw: 1436991
    }
  },
  updatedAt: "2026-03-26T09:00:00.000Z",
  source: "mock",
  provider: "Mock Gold Feed",
  currency: "KRW",
  note: "실제 API 연결 전 테스트용 mock 데이터입니다."
};
