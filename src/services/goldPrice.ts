import type { GoldPriceApiResponse } from "../types/gold";

const API_ENDPOINT = import.meta.env.VITE_GOLD_API_ENDPOINT || "/api/prices";

export const getGoldPrice = async (): Promise<GoldPriceApiResponse> => {
  const response = await fetch(API_ENDPOINT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    let message = "금 시세 정보를 불러오지 못했습니다.";

    try {
      const errorPayload = (await response.json()) as { message?: string };

      if (errorPayload.message) {
        message = errorPayload.message;
      }
    } catch {
      // ignore parse errors
    }

    throw new Error(message);
  }

  return (await response.json()) as GoldPriceApiResponse;
};
