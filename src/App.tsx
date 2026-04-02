import { useState } from "react";
import { CalculatorCard } from "./components/CalculatorCard";
import { ContactSection } from "./components/ContactSection";
import { HeroSection } from "./components/HeroSection";
import { NoticePanel } from "./components/NoticePanel";
import { PriceSummaryCard } from "./components/PriceSummaryCard";
import { SectionTitle } from "./components/SectionTitle";
import { ServiceGuideSection } from "./components/ServiceGuideSection";
import { useGoldPrice } from "./hooks/useGoldPrice";
import { formatKrw, formatNumber } from "./lib/format";
import { getAssetPriceItem } from "./lib/gold";
import type { AssetCode } from "./types/gold";

const GOLD_REFERENCE_ASSETS: AssetCode[] = ["24K", "18K", "14K"];

const normalizeKrwInput = (value: string) => value.replace(/[^\d]/g, "").slice(0, 12);

const formatKrwInput = (value: string) => {
  const digits = normalizeKrwInput(value);

  if (!digits) {
    return "";
  }

  return formatNumber(Number(digits), 0);
};

const parseKrwInput = (value: string) => {
  const digits = normalizeKrwInput(value);

  if (!digits) {
    return null;
  }

  return Number(digits);
};

const App = () => {
  const { data, isLoading, error, refetch } = useGoldPrice();
  const [manual24kReferenceInput, setManual24kReferenceInput] = useState("");
  const getAsset = (asset: AssetCode) => (data ? getAssetPriceItem(data, asset) : null);
  const manual24kReferencePriceForThreePointSevenFiveGram = parseKrwInput(
    manual24kReferenceInput
  );
  const isManual24kReferenceValid =
    manual24kReferencePriceForThreePointSevenFiveGram !== null &&
    manual24kReferencePriceForThreePointSevenFiveGram > 0;
  const manual24kReferencePricePerGram = isManual24kReferenceValid
    ? manual24kReferencePriceForThreePointSevenFiveGram / 3.75
    : null;
  const live24kBuyPricePerGram = getAsset("24K")?.buyPricePerGramKrw ?? 0;
  const goldReferenceScaleFactor =
    manual24kReferencePricePerGram && live24kBuyPricePerGram > 0
      ? manual24kReferencePricePerGram / live24kBuyPricePerGram
      : null;
  const isManualReferenceApplied = goldReferenceScaleFactor !== null;

  const handleManualReferenceChange = (value: string) => {
    setManual24kReferenceInput(formatKrwInput(value));
  };

  const getCalculatorPrices = (asset: AssetCode) => {
    const priceItem = getAsset(asset);

    if (!priceItem) {
      return {
        marketPricePerGramKrw: 0,
        buyPricePerGramKrw: 0,
        sellPricePerGramKrw: 0
      };
    }

    const shouldApplyCustomReference =
      isManualReferenceApplied && GOLD_REFERENCE_ASSETS.includes(asset);
    const multiplier = shouldApplyCustomReference ? goldReferenceScaleFactor : 1;

    return {
      marketPricePerGramKrw: priceItem.marketPricePerGramKrw * multiplier,
      buyPricePerGramKrw: priceItem.buyPricePerGramKrw * multiplier,
      sellPricePerGramKrw: priceItem.sellPricePerGramKrw * multiplier
    };
  };

  const price24k = getCalculatorPrices("24K");
  const price18k = getCalculatorPrices("18K");
  const price14k = getCalculatorPrices("14K");
  const pricePlatinum = getCalculatorPrices("PLATINUM");
  const priceSilver = getCalculatorPrices("SILVER");
  const pricePalladium = getCalculatorPrices("PALLADIUM");

  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8 xl:px-8 xl:py-10">
        <HeroSection />

        <PriceSummaryCard
          data={data}
          isLoading={isLoading}
          error={error}
          onRefresh={() => void refetch()}
        />

        <section className="space-y-8">
          <div className="space-y-6">
            <SectionTitle
              eyebrow="Calculator"
              title="귀금속별 예상 금액을 한 번에 계산"
              description={`24K, 18K, 14K는 금 시세 기준 순도를 반영하고, 백금, 은, 팔라듐은 각각의 실시간 시세를 사용합니다.
각 입력창은 독립적으로 동작해 계산 흐름이 명확합니다.`}
            />
            <NoticePanel />
            <div className="rounded-[1.75rem] border-2 border-accent/45 bg-gradient-to-br from-accentSoft/55 to-white p-5 shadow-[0_12px_28px_-18px_rgba(184,107,18,0.55)]">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-ink">안내사항</p>
                <p className="text-sm leading-6 text-subink">
                  24K(3.75g) 살 때 기준가를 직접 입력하면 24K/18K/14K 카드만
                  재계산합니다.
                  백금/은/팔라듐은 실시간 시세를 그대로 유지합니다.
                </p>
              </div>

              <div className="mt-4 rounded-2xl border-2 border-accent/60 bg-white p-4 shadow-[0_10px_24px_-18px_rgba(184,107,18,0.65)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <label className="block flex-1">
                    <span className="mb-2 block text-sm font-bold tracking-[0.08em] text-ink">
                      24K 살 때 기준가 (3.75g / KRW)
                    </span>
                    <input
                      inputMode="numeric"
                      value={manual24kReferenceInput}
                      onChange={(event) => handleManualReferenceChange(event.target.value)}
                      placeholder="예: 650,000"
                      className="h-12 w-full rounded-2xl border-2 border-accent bg-white px-4 text-base font-semibold text-ink outline-none transition placeholder:text-subink/65 focus:border-[#b86b12] focus:ring-2 focus:ring-accent/35"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setManual24kReferenceInput("")}
                    disabled={!manual24kReferenceInput}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    기준가 초기화
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-xs leading-6 text-subink">
                {isManualReferenceApplied && manual24kReferencePriceForThreePointSevenFiveGram && (
                  <p className="text-ink">
                    적용 중인 사용자 기준가:{" "}
                    {formatKrw(manual24kReferencePriceForThreePointSevenFiveGram)}
                  </p>
                )}
                {!isManualReferenceApplied &&
                  manual24kReferencePriceForThreePointSevenFiveGram && (
                    <p>실시간 24K 살 때 시세를 불러오면 사용자 기준가가 적용됩니다.</p>
                  )}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            <CalculatorCard
              asset="24K"
              badgeLabel="24K"
              purityLabel="99.9%"
              description="순금 기준 시세를 그대로 반영해 예상 금액을 계산합니다."
              marketPricePerGramKrw={price24k.marketPricePerGramKrw}
              buyPricePerGramKrw={price24k.buyPricePerGramKrw}
              sellPricePerGramKrw={price24k.sellPricePerGramKrw}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="18K"
              badgeLabel="18K"
              purityLabel="75%"
              description="24K 기준 시세에 75% 순도를 적용해 현실적인 참고 금액을 보여줍니다."
              marketPricePerGramKrw={price18k.marketPricePerGramKrw}
              buyPricePerGramKrw={price18k.buyPricePerGramKrw}
              sellPricePerGramKrw={price18k.sellPricePerGramKrw}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="14K"
              badgeLabel="14K"
              purityLabel="58.5%"
              description="24K 금 시세 기준으로 58.5% 순도를 반영해 14K 예상 금액을 계산합니다."
              marketPricePerGramKrw={price14k.marketPricePerGramKrw}
              buyPricePerGramKrw={price14k.buyPricePerGramKrw}
              sellPricePerGramKrw={price14k.sellPricePerGramKrw}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="PLATINUM"
              badgeLabel="백금"
              description="백금 실시간 시세 기준으로 입력한 중량의 예상 금액을 계산합니다."
              inputPlaceholder="무게를 입력해 주세요"
              marketPricePerGramKrw={pricePlatinum.marketPricePerGramKrw}
              buyPricePerGramKrw={pricePlatinum.buyPricePerGramKrw}
              sellPricePerGramKrw={pricePlatinum.sellPricePerGramKrw}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="SILVER"
              badgeLabel="은"
              description="은 실시간 시세를 기준으로 간단하게 예상 금액을 확인할 수 있습니다."
              inputPlaceholder="무게를 입력해 주세요"
              marketPricePerGramKrw={priceSilver.marketPricePerGramKrw}
              buyPricePerGramKrw={priceSilver.buyPricePerGramKrw}
              sellPricePerGramKrw={priceSilver.sellPricePerGramKrw}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="PALLADIUM"
              badgeLabel="팔라듐"
              description="팔라듐 시세를 사용해 입력한 중량의 예상 금액을 계산합니다."
              inputPlaceholder="무게를 입력해 주세요"
              marketPricePerGramKrw={pricePalladium.marketPricePerGramKrw}
              buyPricePerGramKrw={pricePalladium.buyPricePerGramKrw}
              sellPricePerGramKrw={pricePalladium.sellPricePerGramKrw}
              disabled={isLoading || !data}
            />
          </div>
        </section>

        <ServiceGuideSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default App;
