import { CACHE_TTL_MS } from "./_lib/constants.js";
import { buildPricesPayload } from "./_lib/calculate.js";
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
    const metalSpotPrices = await fetchMetalSpotPrices();

    const payload = buildPricesPayload({
      gold24kPerGram: metalSpotPrices.gold24kPerGram,
      silverPerGram: metalSpotPrices.silverPerGram,
      platinumPerGram: metalSpotPrices.platinumPerGram,
      palladiumPerGram: metalSpotPrices.palladiumPerGram,
      updatedAt: metalSpotPrices.updatedAt
    });

    saveCachePayload(payload);

    return res.status(200).json(payload);
  } catch (error) {
    const fallbackPayload = {
      ...mockPricesResponse(),
      note:
        error instanceof Error
          ? `External API failed, fallback mock data is returned: ${error.message}`
          : "External API failed, fallback mock data is returned."
    };

    saveCachePayload(fallbackPayload);

    return res.status(200).json(fallbackPayload);
  }
}
