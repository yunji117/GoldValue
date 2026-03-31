import { useEffect, useState } from "react";
import { getGoldPrice } from "../services/goldPrice";
import type { GoldPriceApiResponse } from "../types/gold";

export const useGoldPrice = () => {
  const [data, setData] = useState<GoldPriceApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getGoldPrice();
      setData(result);

      if (result.source === "fallback") {
        setError(
          result.note ??
            "실시간 시세 연결에 실패해 fallback 데이터가 표시됩니다. 운영 환경에서는 API 오류 안내가 표시됩니다."
        );
      } else if (result.fallbackUsed && result.note) {
        setError(result.note);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "금 시세를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPrice();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchPrice
  };
};
