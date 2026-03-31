import { GOLD_API_SYMBOLS } from "./metals-config.js";
import type { GoldApiPriceResponse, MarketSymbol } from "./types.js";

const DEFAULT_GOLD_API_BASE_URL = "https://api.gold-api.com";

const parsePositiveNumber = (value: unknown, label: string) => {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid price for ${label}`);
  }

  return parsed;
};

const toIsoString = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
};

const fetchSymbolPrice = async ({
  symbol,
  baseUrl,
  apiKey
}: {
  symbol: MarketSymbol;
  baseUrl: string;
  apiKey?: string;
}) => {
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const response = await fetch(`${normalizedBaseUrl}/price/${symbol}`, {
    headers: {
      ...(apiKey ? { "x-api-key": apiKey } : {})
    }
  });

  if (!response.ok) {
    throw new Error(`Gold API request failed for ${symbol}: ${response.status}`);
  }

  const payload = (await response.json()) as GoldApiPriceResponse;

  return {
    symbol,
    pricePerOunceUsd: parsePositiveNumber(payload.price, symbol),
    updatedAt: toIsoString(payload.updatedAt) ?? new Date().toISOString()
  };
};

export const fetchMetalSpotPrices = async () => {
  const baseUrl = process.env.GOLD_API_BASE_URL || DEFAULT_GOLD_API_BASE_URL;
  const apiKey = process.env.GOLD_API_KEY;

  const symbols = await Promise.all(
    GOLD_API_SYMBOLS.map((symbol) =>
      fetchSymbolPrice({
        symbol,
        baseUrl,
        apiKey
      })
    )
  );

  const updatedAt = symbols
    .map((item) => Date.parse(item.updatedAt))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => b - a)[0];

  const bySymbol = symbols.reduce(
    (acc, item) => {
      acc[item.symbol] = item.pricePerOunceUsd;
      return acc;
    },
    {} as Record<MarketSymbol, number>
  );

  return {
    usdPerOunceBySymbol: bySymbol,
    updatedAt: Number.isFinite(updatedAt) ? new Date(updatedAt).toISOString() : new Date().toISOString(),
    provider: "Gold API"
  };
};
