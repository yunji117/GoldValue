import { mockGoldPrice } from "../data/mockGoldPrice";
import type { GoldPriceApiResponse } from "../types/gold";

const API_ENDPOINT = import.meta.env.VITE_GOLD_API_ENDPOINT || "/api/gold";

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

    const data = (await response.json()) as GoldPriceApiResponse;
    return data;
  } catch {
    return {
      ...mockGoldPrice,
      note: "외부 API 연결에 실패해 mock 데이터로 표시 중입니다."
    };
  }
};
