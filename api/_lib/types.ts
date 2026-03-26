export interface ApisedMetalValue {
  KRW?: number | string;
  price?: number | string;
  value?: number | string;
  ask?: number | string;
  bid?: number | string;
}

export interface ApisedLatestResponse {
  success?: boolean;
  status?: string;
  timestamp?: number;
  date?: string;
  updatedAt?: string;
  data?: Record<string, unknown>;
  rates?: Record<string, unknown>;
  result?: Record<string, unknown>;
}

export interface PricesResponse {
  gold24kPerGram: number;
  gold18kPerGram: number;
  gold14kPerGram: number;
  silverPerGram: number;
  platinumPerGram: number;
  palladiumPerGram: number;
  updatedAt: string;
  source: "live" | "mock";
  note?: string;
}
