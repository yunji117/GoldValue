import { buildPricesPayload } from "./calculate.js";
import type { PricesResponse } from "./types.js";

const MOCK_USD_PER_OUNCE = {
  XAU: 3100,
  XAG: 34,
  XPT: 980,
  XPD: 1020
} as const;

const MOCK_EXCHANGE_RATE = 1370;

export const mockPricesResponse = (note?: string): PricesResponse =>
  buildPricesPayload({
    usdPerOunceBySymbol: {
      XAU: MOCK_USD_PER_OUNCE.XAU,
      XAG: MOCK_USD_PER_OUNCE.XAG,
      XPT: MOCK_USD_PER_OUNCE.XPT,
      XPD: MOCK_USD_PER_OUNCE.XPD
    },
    updatedAt: new Date().toISOString(),
    source: "fallback",
    provider: "Fallback Mock Feed",
    fallbackUsed: true,
    exchangeRate: {
      baseCurrency: "USD",
      quoteCurrency: "KRW",
      rate: MOCK_EXCHANGE_RATE,
      source: "fallback:mock"
    },
    note: note ?? "실시간 API 실패로 개발용 fallback 데이터를 사용합니다."
  });
