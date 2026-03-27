import type { PricesResponse } from "./types.js";

export const mockPricesResponse = (): PricesResponse => ({
  // 실제 API 연결 전 테스트용 mock 데이터
  gold24kPerGram: 142000,
  gold18kPerGram: 106500,
  gold14kPerGram: 83070,
  silverPerGram: 1650,
  platinumPerGram: 48500,
  palladiumPerGram: 46200,
  updatedAt: new Date().toISOString(),
  source: "mock",
  note: "실제 API 연결 전 테스트용 mock 데이터입니다."
});
