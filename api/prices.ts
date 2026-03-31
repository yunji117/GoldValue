import { CACHE_TTL_MS } from "./_lib/constants.js";
import { buildPricesPayload } from "./_lib/calculate.js";
import { resolveUsdKrwExchangeRate } from "./_lib/exchange-rate.js";
import { fetchMetalSpotPrices } from "./_lib/metal-api.js";
import { mockPricesResponse } from "./_lib/mock.js";
import type { PricesResponse } from "./_lib/types.js";

type CacheStore = {
  expiresAt: number;
  payload: PricesResponse;
} | null;

let memoryCache: CacheStore = null;

const setCacheHeaders = (res: any) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=60, s-maxage=60, stale-while-revalidate=300"
  );
};

const getCachedPayload = () => {
  if (!memoryCache) {
    return null;
  }

  if (Date.now() > memoryCache.expiresAt) {
    memoryCache = null;
    return null;
  }

  return memoryCache.payload;
};

const saveCachePayload = (payload: PricesResponse) => {
  memoryCache = {
    payload,
    expiresAt: Date.now() + CACHE_TTL_MS
  };
};

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      message: "Method Not Allowed"
    });
  }

  setCacheHeaders(res);

  const cachedPayload = getCachedPayload();

  if (cachedPayload) {
    return res.status(200).json(cachedPayload);
  }

  try {
    const [metalSpotPrices, exchangeRate] = await Promise.all([
      fetchMetalSpotPrices(),
      resolveUsdKrwExchangeRate()
    ]);

    const payload = buildPricesPayload({
      usdPerOunceBySymbol: metalSpotPrices.usdPerOunceBySymbol,
      updatedAt: metalSpotPrices.updatedAt,
      source: "live",
      provider: metalSpotPrices.provider,
      fallbackUsed: exchangeRate.fallbackUsed,
      exchangeRate: exchangeRate.info,
      note: exchangeRate.note
    });

    saveCachePayload(payload);
    return res.status(200).json(payload);
  } catch (error) {
    const allowFallback =
      process.env.NODE_ENV !== "production" || process.env.ALLOW_MOCK_FALLBACK === "true";

    if (!allowFallback) {
      return res.status(502).json({
        message:
          error instanceof Error
            ? `실시간 시세를 불러오지 못했습니다: ${error.message}`
            : "실시간 시세를 불러오지 못했습니다."
      });
    }

    const fallbackPayload = mockPricesResponse(
      error instanceof Error
        ? `실시간 API 실패로 개발용 fallback 데이터를 사용합니다: ${error.message}`
        : "실시간 API 실패로 개발용 fallback 데이터를 사용합니다."
    );

    saveCachePayload(fallbackPayload);

    return res.status(200).json(fallbackPayload);
  }
}
