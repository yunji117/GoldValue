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

      if (result.source === "mock") {
        setError("실시간 API 연결 전 또는 실패 상태입니다. 현재는 mock 데이터가 표시됩니다.");
      }
    } catch {
      setError("금 시세를 불러오지 못했습니다.");
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
