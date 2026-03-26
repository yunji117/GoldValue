import { Badge } from "./Badge";
import { formatDateTime, formatKrw } from "../lib/format";
import type { GoldPriceApiResponse } from "../types/gold";

interface PriceSummaryCardProps {
  data: GoldPriceApiResponse | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export const PriceSummaryCard = ({
  data,
  isLoading,
  error,
  onRefresh
}: PriceSummaryCardProps) => {
  const goldPerGram = data?.prices.gold.pricePerGramKrw ?? 0;
  const goldPerThreePointSevenFive = goldPerGram * 3.75;

  return (
    <section className="rounded-[2rem] border border-line/80 bg-panel/90 p-6 shadow-luxe backdrop-blur xl:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <Badge tone={data?.source === "mock" ? "mint" : "gold"}>
            {data?.source === "mock" ? "Mock Fallback" : "Live Gold Price"}
          </Badge>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-ink md:text-xl">
              오늘의 금 시세
            </h3>
            <p className="text-sm leading-6 text-subink">
              24K 순금 3.75g 기준 가격을 중심으로 KRW 시세를 표시합니다.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-accent/50 hover:bg-accentSoft"
        >
          시세 새로고침
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="rounded-[1.5rem] border border-line/80 bg-accentSoft/60 p-5">
          <p className="text-sm text-subink">24K 실시간 기준가 · 3.75g</p>
          {isLoading ? (
            <div className="mt-3 h-12 animate-pulse rounded-2xl bg-accent/15" />
          ) : (
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
              {formatKrw(goldPerThreePointSevenFive)}
            </p>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-line/80 bg-white p-5">
          <p className="text-sm text-subink">24K 1g 기준</p>
          {isLoading ? (
            <div className="mt-3 h-8 animate-pulse rounded-2xl bg-accent/15" />
          ) : (
            <p className="mt-3 text-xl font-bold text-ink">
              {formatKrw(goldPerGram)}
            </p>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-line/80 bg-white p-5">
          <p className="text-sm text-subink">마지막 업데이트</p>
          {isLoading ? (
            <div className="mt-3 h-8 animate-pulse rounded-2xl bg-accent/15" />
          ) : (
            <p className="mt-3 text-base font-semibold text-ink">
              {data ? formatDateTime(data.updatedAt) : "-"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        {data && (
          <span className="rounded-full border border-line bg-white px-3 py-1.5 text-subink">
            제공처: {data.provider}
          </span>
        )}
        {error && (
          <span className="rounded-full border border-danger/25 bg-danger/10 px-3 py-1.5 text-danger">
            {error}
          </span>
        )}
      </div>
    </section>
  );
};
