import { CalculatorCard } from "./components/CalculatorCard";
import { HeroSection } from "./components/HeroSection";
import { NoticePanel } from "./components/NoticePanel";
import { PriceSummaryCard } from "./components/PriceSummaryCard";
import { SectionTitle } from "./components/SectionTitle";
import { useGoldPrice } from "./hooks/useGoldPrice";
import { ASSET_MULTIPLIER, getAssetPricePerGram } from "./lib/gold";

const App = () => {
  const { data, isLoading, error, refetch } = useGoldPrice();

  return (
    <div className="min-h-screen bg-surface text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8 xl:px-8 xl:py-10">
        <HeroSection />

        <PriceSummaryCard
          data={data}
          isLoading={isLoading}
          error={error}
          onRefresh={() => void refetch()}
        />

        <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <SectionTitle
              eyebrow="Calculator"
              title="귀금속별 예상 금액을 한 번에 계산"
              description="24K, 18K, 14K는 금 시세 기준 순도를 반영하고, 백금, 은, 팔라듐은 각각의 실시간 시세를 사용합니다. 각 입력창은 독립적으로 동작해 계산 흐름이 명확합니다."
            />
            <NoticePanel />
          </div>

          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            <CalculatorCard
              asset="24K"
              badgeLabel="24K"
              purityLabel="순도 100%"
              description="순금 기준 시세를 그대로 반영해 예상 금액을 계산합니다."
              pricePerGramKrw={data ? getAssetPricePerGram(data, "24K") : 0}
              multiplier={ASSET_MULTIPLIER["24K"]}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="18K"
              badgeLabel="18K"
              purityLabel="순도 75%"
              description="24K 기준 시세에 75% 순도를 적용해 현실적인 참고 금액을 보여줍니다."
              pricePerGramKrw={data ? getAssetPricePerGram(data, "18K") : 0}
              multiplier={ASSET_MULTIPLIER["18K"]}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="14K"
              badgeLabel="14K"
              purityLabel="순도 58.5%"
              description="24K 금 시세 기준으로 58.5% 순도를 반영해 14K 예상 금액을 계산합니다."
              pricePerGramKrw={data ? getAssetPricePerGram(data, "14K") : 0}
              multiplier={ASSET_MULTIPLIER["14K"]}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="PLATINUM"
              badgeLabel="백금"
              purityLabel="실시간 시세"
              description="백금 실시간 시세 기준으로 입력한 중량의 예상 금액을 계산합니다."
              pricePerGramKrw={data ? getAssetPricePerGram(data, "PLATINUM") : 0}
              multiplier={ASSET_MULTIPLIER.PLATINUM}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="SILVER"
              badgeLabel="은"
              purityLabel="실시간 시세"
              description="은 실시간 시세를 기준으로 간단하게 예상 금액을 확인할 수 있습니다."
              pricePerGramKrw={data ? getAssetPricePerGram(data, "SILVER") : 0}
              multiplier={ASSET_MULTIPLIER.SILVER}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="PALLADIUM"
              badgeLabel="팔라듐"
              purityLabel="실시간 시세"
              description="팔라듐 시세를 사용해 입력한 중량의 예상 금액을 계산합니다."
              pricePerGramKrw={data ? getAssetPricePerGram(data, "PALLADIUM") : 0}
              multiplier={ASSET_MULTIPLIER.PALLADIUM}
              disabled={isLoading || !data}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
