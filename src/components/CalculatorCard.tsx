import { useState } from "react";
import {
  calculateMetalValue,
  canAcceptDecimalInput,
  parseGramInput
} from "../lib/gold";
import { formatKrw, formatNumber } from "../lib/format";
import type { AssetCode } from "../types/gold";

interface CalculatorCardProps {
  asset: AssetCode;
  badgeLabel: string;
  purityLabel: string;
  description: string;
  pricePerGramKrw?: number;
  multiplier?: number;
  disabled?: boolean;
}

export const CalculatorCard = ({
  asset,
  badgeLabel,
  purityLabel,
  description,
  pricePerGramKrw = 0,
  multiplier,
  disabled = false
}: CalculatorCardProps) => {
  const [grams, setGrams] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    if (!canAcceptDecimalInput(value)) {
      return;
    }

    setGrams(value);
    setError(null);
  };

  const handleCalculate = () => {
    const parsed = parseGramInput(grams);

    if (!parsed.valid) {
      setError(parsed.message);
      setResult(null);
      return;
    }

    const calculated = calculateMetalValue({
      grams: parsed.value,
      asset,
      pricePerGramKrw,
      multiplier
    });

    setResult(calculated.estimatedPrice);
    setError(null);
  };

  const handleReset = () => {
    setGrams("");
    setResult(null);
    setError(null);
  };

  return (
    <article className="rounded-[2rem] border border-white/10 bg-panel/70 p-6 shadow-luxe backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {badgeLabel}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{badgeLabel} 계산 카드</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">
              {description}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">
            순도
          </p>
          <p className="mt-1 text-lg font-bold text-white">{purityLabel}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white/70">
            {badgeLabel} 그람 수 입력
          </span>
          <div className="relative">
            <input
              inputMode="decimal"
              value={grams}
              onChange={(event) => handleChange(event.target.value)}
              placeholder="예: 3.75"
              disabled={disabled}
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-16 text-lg text-white outline-none transition placeholder:text-white/25 focus:border-accent/50 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-white/45">
              gram
            </span>
          </div>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={disabled}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-bold text-surface transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            금액 계산하기
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            초기화
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="mt-5 rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-white/55">예상 금액</p>
            <p className="mt-1 text-xs text-white/40">
              입력값 {grams ? `${formatNumber(Number(grams), 3)}g` : "대기 중"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-white md:text-3xl">
              {result === null ? "-" : formatKrw(result)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
