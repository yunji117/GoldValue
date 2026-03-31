import { DEFAULT_USD_KRW_RATE } from "./constants.js";
import type { ExchangeRateResolveResult } from "./types.js";

const DEFAULT_EXCHANGE_RATE_API_URL = "https://open.er-api.com/v6/latest/USD";

const parseRate = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const parseFallbackRate = () => {
  const envRate = process.env.USD_KRW_FALLBACK_RATE;
  const parsed = envRate ? parseRate(envRate) : null;
  return parsed ?? DEFAULT_USD_KRW_RATE;
};

const tryResolveKrwRate = (payload: unknown) => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;

  if (record.rates && typeof record.rates === "object" && record.rates !== null) {
    const fromRates = parseRate((record.rates as Record<string, unknown>).KRW);

    if (fromRates !== null) {
      return fromRates;
    }
  }

  if (
    record.conversion_rates &&
    typeof record.conversion_rates === "object" &&
    record.conversion_rates !== null
  ) {
    const fromConversionRates = parseRate(
      (record.conversion_rates as Record<string, unknown>).KRW
    );

    if (fromConversionRates !== null) {
      return fromConversionRates;
    }
  }

  return null;
};

export const resolveUsdKrwExchangeRate = async (): Promise<ExchangeRateResolveResult> => {
  const fixedRate = parseRate(process.env.USD_KRW_FIXED_RATE);

  if (fixedRate !== null) {
    return {
      info: {
        baseCurrency: "USD",
        quoteCurrency: "KRW",
        rate: fixedRate,
        source: "env:USD_KRW_FIXED_RATE"
      },
      fallbackUsed: false
    };
  }

  const exchangeRateApiUrl =
    process.env.EXCHANGE_RATE_API_URL || DEFAULT_EXCHANGE_RATE_API_URL;
  const exchangeRateApiKey = process.env.EXCHANGE_RATE_API_KEY;

  try {
    const response = await fetch(exchangeRateApiUrl, {
      headers: {
        ...(exchangeRateApiKey ? { "x-api-key": exchangeRateApiKey } : {})
      }
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API failed: ${response.status}`);
    }

    const payload = await response.json();
    const rate = tryResolveKrwRate(payload);

    if (rate === null) {
      throw new Error("Exchange rate payload does not include KRW rate");
    }

    return {
      info: {
        baseCurrency: "USD",
        quoteCurrency: "KRW",
        rate,
        source: exchangeRateApiUrl
      },
      fallbackUsed: false
    };
  } catch (error) {
    const fallbackRate = parseFallbackRate();

    return {
      info: {
        baseCurrency: "USD",
        quoteCurrency: "KRW",
        rate: fallbackRate,
        source: "fallback:USD_KRW_FALLBACK_RATE"
      },
      fallbackUsed: true,
      note:
        error instanceof Error
          ? `환율 API 조회 실패로 fallback 환율을 사용합니다: ${error.message}`
          : "환율 API 조회 실패로 fallback 환율을 사용합니다."
    };
  }
};
