import type { ApisedLatestResponse, ApisedMetalValue } from "./types.js";

const DEFAULT_METAL_API_BASE_URL = "https://gold.g.apised.com/v1/latest";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getPositiveNumber = (value: unknown, label: string) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid APISED price: ${label}`);
  }

  return value;
};

const toNumber = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const pickFirstNumber = (...values: unknown[]) => {
  for (const value of values) {
    const parsed = toNumber(value);

    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
};

const resolveKrwPerGram = (
  container: Record<string, unknown>,
  symbol: string
) => {
  const rawValue = container[symbol];

  if (typeof rawValue === "number" || typeof rawValue === "string") {
    return getPositiveNumber(toNumber(rawValue), symbol);
  }

  if (isRecord(rawValue)) {
    const typedValue = rawValue as ApisedMetalValue;
    const candidate = pickFirstNumber(typedValue.KRW, typedValue.price, typedValue.value);
    return getPositiveNumber(candidate, symbol);
  }

  throw new Error(`Missing APISED price for ${symbol}`);
};

const resolveKrwPerGramFromUsdPayload = (
  payload: ApisedLatestResponse,
  symbol: string
) => {
  if (!isRecord(payload.data)) {
    return null;
  }

  const metalPrices = payload.data.metal_prices;
  const currencyRates = payload.data.currency_rates;

  if (!isRecord(metalPrices) || !isRecord(currencyRates)) {
    return null;
  }

  const rawMetalPrice = metalPrices[symbol];
  const rawKrwRate = pickFirstNumber(currencyRates.KRW, currencyRates.krw);

  if (rawKrwRate === null) {
    return null;
  }

  let usdPerGram: number | null = null;

  if (typeof rawMetalPrice === "number" || typeof rawMetalPrice === "string") {
    usdPerGram = toNumber(rawMetalPrice);
  } else if (isRecord(rawMetalPrice)) {
    const typedValue = rawMetalPrice as ApisedMetalValue;
    usdPerGram = pickFirstNumber(
      typedValue.price,
      typedValue.value,
      typedValue.ask,
      typedValue.bid
    );
  }

  if (usdPerGram === null) {
    return null;
  }

  return getPositiveNumber(usdPerGram * rawKrwRate, `${symbol} KRW`);
};

const resolveUpdatedAt = (payload: ApisedLatestResponse) => {
  if (payload.updatedAt) {
    return payload.updatedAt;
  }

  if (payload.date) {
    return payload.date;
  }

  const rawDataTimestamp = isRecord(payload.data) ? payload.data.timestamp : null;
  const timestamp = pickFirstNumber(payload.timestamp, rawDataTimestamp);

  if (timestamp === null) {
    return new Date().toISOString();
  }

  const normalizedTimestamp = timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000;
  return new Date(normalizedTimestamp).toISOString();
};

export const fetchMetalSpotPrices = async () => {
  // 외부 금속 시세 API 필요
  // API KEY 필요 (APISED 또는 MetalpriceAPI 사이트에서 발급)
  // API KEY 발급 사이트:
  // APISED: https://gold.g.apised.com/
  // MetalpriceAPI: https://metalpriceapi.com/
  // API KEY는 반드시 서버 환경변수(.env)에 저장해야 함
  // APISED는 x-api-key 헤더를 사용합니다.
  const accessKey = process.env.APISED_API_KEY;
  const baseUrl = process.env.METAL_API_BASE_URL || DEFAULT_METAL_API_BASE_URL;

  if (!accessKey) {
    throw new Error("APISED_API_KEY is missing");
  }

  const url = new URL(baseUrl);
  url.searchParams.set("metals", "XAU,XAG,XPT,XPD");
  url.searchParams.set("currencies", "KRW");
  url.searchParams.set("weight_unit", "gram");

  const response = await fetch(url.toString(), {
    headers: {
      "x-api-key": accessKey,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`APISED request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApisedLatestResponse;
  const directContainer = isRecord(payload.data)
    ? payload.data
    : isRecord(payload.rates)
      ? payload.rates
      : isRecord(payload.result)
        ? payload.result
        : null;
  const resolvePrice = (symbol: string) => {
    if (directContainer) {
      try {
        return resolveKrwPerGram(directContainer, symbol);
      } catch {
        // Direct KRW container 형식이 아니면, USD + KRW 환율 조합 형식으로 재시도합니다.
      }
    }

    const fromUsdPayload = resolveKrwPerGramFromUsdPayload(payload, symbol);

    if (fromUsdPayload !== null) {
      return fromUsdPayload;
    }

    throw new Error(`Missing APISED price for ${symbol}`);
  };

  return {
    gold24kPerGram: resolvePrice("XAU"),
    silverPerGram: resolvePrice("XAG"),
    platinumPerGram: resolvePrice("XPT"),
    palladiumPerGram: resolvePrice("XPD"),
    updatedAt: resolveUpdatedAt(payload)
  };
};
