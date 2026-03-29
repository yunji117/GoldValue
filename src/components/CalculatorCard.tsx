import { useState } from "react";
import {
  calculateMetalValue,
  canAcceptDecimalInput,
  convertToGrams,
  parseGramInput
} from "../lib/gold";
import { formatKrw, formatNumber } from "../lib/format";
import type { AssetCode } from "../types/gold";
import type { WeightUnit } from "../lib/gold";

interface CalculatorCardProps {
  asset: AssetCode;
  badgeLabel: string;
  purityLabel?: string;
  description: string;
  inputPlaceholder?: string;
  pricePerGramKrw?: number;
  multiplier?: number;
  disabled?: boolean;
}

export const CalculatorCard = ({
  asset,
  badgeLabel,
  purityLabel,
  description,
  inputPlaceholder = "무게를 입력해 주세요",
  pricePerGramKrw = 0,
  multiplier,
  disabled = false
}: CalculatorCardProps) => {
  const marketPriceForThreePointSevenFiveGrams =
    pricePerGramKrw > 0
      ? calculateMetalValue({
          grams: 3.75,
          asset,
          pricePerGramKrw,
          multiplier
        }).estimatedPrice
      : null;

  const [grams, setGrams] = useState("");
  const [unit, setUnit] = useState<WeightUnit>("g");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateFromInput = (value: string, nextUnit: WeightUnit = unit) => {
    if (!value.trim()) {
      setResult(null);
      setError(null);
      return;
    }

    const parsed = parseGramInput(value);

    if (!parsed.valid) {
      setError(parsed.message);
      setResult(null);
      return;
    }

    const gramsValue = convertToGrams(parsed.value, nextUnit);

    const calculated = calculateMetalValue({
      grams: gramsValue,
      asset,
      pricePerGramKrw,
      multiplier
    });

    setResult(calculated.estimatedPrice);
    setError(null);
  };

  const handleChange = (value: string) => {
    if (!canAcceptDecimalInput(value)) {
      return;
    }

    setGrams(value);
    calculateFromInput(value);
  };

  const handleUnitChange = (nextUnit: WeightUnit) => {
    setUnit(nextUnit);
    calculateFromInput(grams, nextUnit);
  };

  const formattedMarketPrice =
    marketPriceForThreePointSevenFiveGrams === null
      ? "-"
      : `약\u00A0${formatKrw(marketPriceForThreePointSevenFiveGrams)}`;
  const buyEstimate = result;
  const sellEstimate = result;

  const formatEstimate = (value: number | null) =>
    value === null ? "-" : `약\u00A0${formatKrw(value)}`;
  const buyEstimateLabel = formatEstimate(buyEstimate);
  const sellEstimateLabel = formatEstimate(sellEstimate);

  const getEstimateTextSizeClass = (estimateLabel: string) => {
    const length = estimateLabel.length;

    if (length >= 18) {
      return "text-[0.72rem] sm:text-[0.8rem] md:text-[0.8rem]";
    }

    if (length >= 15) {
      return "text-[0.8rem] sm:text-[0.9rem] md:text-[0.9rem]";
    }

    if (length >= 13) {
      return "text-[0.9rem] sm:text-[1rem] md:text-[1rem]";
    }

    return "text-[1rem] sm:text-[1.1rem] md:text-[1.05rem]";
  };

  return (
    <article className="rounded-[2rem] border border-accent/35 bg-white p-6 shadow-luxe backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex rounded-full border border-accent/25 bg-accentSoft px-3 py-1 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {badgeLabel}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink">{badgeLabel} 계산 카드</h3>
            <p className="mt-2 text-sm leading-6 text-subink">
              {description}
            </p>
            <div className="mt-3 rounded-xl border border-accent/35 bg-accentSoft/30 px-3 py-2">
              <p className="text-xs text-subink">실시간 시세 기준 (3.75g)</p>
              <p className="mt-1 whitespace-nowrap text-base font-bold text-ink">
                {formattedMarketPrice}
              </p>
            </div>
          </div>
        </div>
        {purityLabel && (
          <div className="rounded-2xl border border-line/80 bg-white px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-subink">
              순도
            </p>
            <p className="mt-1 text-lg font-bold text-ink">{purityLabel}</p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink">
            {badgeLabel} 중량 입력
          </span>
          <div className="grid grid-cols-[1fr_92px] gap-3">
            <input
              inputMode="decimal"
              value={grams}
              onChange={(event) => handleChange(event.target.value)}
              placeholder={inputPlaceholder}
              disabled={disabled}
              className="h-14 w-full rounded-2xl border border-accent bg-white px-4 text-lg text-ink shadow-[0_0_0_1px_rgba(213,159,47,0.18)] outline-none transition placeholder:text-accent/85 focus:border-[#b86b12] focus:bg-accentSoft/35 focus:ring-2 focus:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <div className="relative">
              <select
                value={unit}
                onChange={(event) => handleUnitChange(event.target.value as WeightUnit)}
                disabled={disabled}
                className="h-14 w-full appearance-none rounded-2xl border border-accent bg-white px-4 pr-10 text-sm font-semibold text-ink shadow-[0_0_0_1px_rgba(213,159,47,0.18)] outline-none transition focus:border-[#b86b12] focus:bg-accentSoft/35 focus:ring-2 focus:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-subink">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </label>

      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="mt-5 rounded-[1.75rem] border border-line/80 bg-gradient-to-br from-accentSoft/70 to-white p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-subink">예상 금액</p>
          <p className="text-xs text-subink/80 text-right">
            입력값 {grams ? `${formatNumber(Number(grams), 3)}${unit}` : "대기 중"}
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-line/70 bg-white/80 px-3 py-3 sm:px-4 sm:py-4">
            <p className="text-xs font-semibold tracking-[0.08em] text-subink">
              살 때 금액
            </p>
            <p
              className={`mt-2 w-full min-w-0 whitespace-nowrap leading-tight font-extrabold tracking-tight text-ink ${getEstimateTextSizeClass(
                buyEstimateLabel
              )}`}
            >
              {buyEstimateLabel}
            </p>
          </div>
          <div className="min-w-0 rounded-2xl border border-line/70 bg-white/80 px-3 py-3 sm:px-4 sm:py-4">
            <p className="text-xs font-semibold tracking-[0.08em] text-subink">
              팔 때 금액
            </p>
            <p
              className={`mt-2 w-full min-w-0 whitespace-nowrap leading-tight font-extrabold tracking-tight text-ink ${getEstimateTextSizeClass(
                sellEstimateLabel
              )}`}
            >
              {sellEstimateLabel}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
