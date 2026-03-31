import { CalculatorCard } from "./components/CalculatorCard";
import { ContactSection } from "./components/ContactSection";
import { HeroSection } from "./components/HeroSection";
import { NoticePanel } from "./components/NoticePanel";
import { PriceSummaryCard } from "./components/PriceSummaryCard";
import { SectionTitle } from "./components/SectionTitle";
import { ServiceGuideSection } from "./components/ServiceGuideSection";
import { useGoldPrice } from "./hooks/useGoldPrice";
import { getAssetPriceItem } from "./lib/gold";
import type { AssetCode } from "./types/gold";

const App = () => {
  const { data, isLoading, error, refetch } = useGoldPrice();
  const getAsset = (asset: AssetCode) => (data ? getAssetPriceItem(data, asset) : null);

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
              description="24K, 18K, 14K는 금 시세 기준 순도를 반영하고, 백금, 은, 팔라듐은 각각의 실시간 시세를 사용합니다. 각 입력창은 독립적으로 동작해 계산 흐름이 명확합니다."
            />
            <NoticePanel />
          </div>

          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            <CalculatorCard
              asset="24K"
              badgeLabel="24K"
              purityLabel="99.9%"
              description="순금 기준 시세를 그대로 반영해 예상 금액을 계산합니다."
              marketPricePerGramKrw={getAsset("24K")?.marketPricePerGramKrw ?? 0}
              buyPricePerGramKrw={getAsset("24K")?.buyPricePerGramKrw ?? 0}
              sellPricePerGramKrw={getAsset("24K")?.sellPricePerGramKrw ?? 0}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="18K"
              badgeLabel="18K"
              purityLabel="75%"
              description="24K 기준 시세에 75% 순도를 적용해 현실적인 참고 금액을 보여줍니다."
              marketPricePerGramKrw={getAsset("18K")?.marketPricePerGramKrw ?? 0}
              buyPricePerGramKrw={getAsset("18K")?.buyPricePerGramKrw ?? 0}
              sellPricePerGramKrw={getAsset("18K")?.sellPricePerGramKrw ?? 0}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="14K"
              badgeLabel="14K"
              purityLabel="58.5%"
              description="24K 금 시세 기준으로 58.5% 순도를 반영해 14K 예상 금액을 계산합니다."
              marketPricePerGramKrw={getAsset("14K")?.marketPricePerGramKrw ?? 0}
              buyPricePerGramKrw={getAsset("14K")?.buyPricePerGramKrw ?? 0}
              sellPricePerGramKrw={getAsset("14K")?.sellPricePerGramKrw ?? 0}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="PLATINUM"
              badgeLabel="백금"
              description="백금 실시간 시세 기준으로 입력한 중량의 예상 금액을 계산합니다."
              inputPlaceholder="무게를 입력해 주세요"
              marketPricePerGramKrw={getAsset("PLATINUM")?.marketPricePerGramKrw ?? 0}
              buyPricePerGramKrw={getAsset("PLATINUM")?.buyPricePerGramKrw ?? 0}
              sellPricePerGramKrw={getAsset("PLATINUM")?.sellPricePerGramKrw ?? 0}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="SILVER"
              badgeLabel="은"
              description="은 실시간 시세를 기준으로 간단하게 예상 금액을 확인할 수 있습니다."
              inputPlaceholder="무게를 입력해 주세요"
              marketPricePerGramKrw={getAsset("SILVER")?.marketPricePerGramKrw ?? 0}
              buyPricePerGramKrw={getAsset("SILVER")?.buyPricePerGramKrw ?? 0}
              sellPricePerGramKrw={getAsset("SILVER")?.sellPricePerGramKrw ?? 0}
              disabled={isLoading || !data}
            />
            <CalculatorCard
              asset="PALLADIUM"
              badgeLabel="팔라듐"
              description="팔라듐 시세를 사용해 입력한 중량의 예상 금액을 계산합니다."
              inputPlaceholder="무게를 입력해 주세요"
              marketPricePerGramKrw={getAsset("PALLADIUM")?.marketPricePerGramKrw ?? 0}
              buyPricePerGramKrw={getAsset("PALLADIUM")?.buyPricePerGramKrw ?? 0}
              sellPricePerGramKrw={getAsset("PALLADIUM")?.sellPricePerGramKrw ?? 0}
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
