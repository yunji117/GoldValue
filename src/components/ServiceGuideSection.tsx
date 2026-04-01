export const ServiceGuideSection = () => {
  return (
    <section
      id="service-guide"
      className="rounded-[2rem] border border-line/80 bg-panel/90 p-6 shadow-luxe backdrop-blur xl:p-8"
    >
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent/90">
          Service Guide
        </p>
        <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">
          서비스 안내
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-subink md:text-base">
          Gold Value는 귀금속 시세를 참고해 예상 금액을 계산하는 정보형 웹앱입니다.
          광고 노출 전후와 관계없이 계산 결과는 참고용이며 실제 거래 금액은 매장 정책과
          수수료 등에 따라 달라질 수 있습니다.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-3xl border border-line/80 bg-white p-5">
          <h3 className="text-base font-semibold text-ink">이 웹은 무엇인가요?</h3>
          <p className="mt-2 text-sm leading-6 text-subink">
            24K, 18K, 14K, 백금, 은, 팔라듐의 g/kg 입력값을 기준으로 예상 금액을 빠르게
            계산해 주는 귀금속 계산기입니다.
          </p>
        </article>

        <article className="rounded-3xl border border-line/80 bg-white p-5">
          <h3 className="text-base font-semibold text-ink">사용 방법</h3>
          <ol className="mt-2 space-y-2 text-sm leading-6 text-subink">
            <li>1. 귀금속 카드를 선택하고 무게(g 또는 kg)를 입력합니다.</li>
            <li>2. 입력 즉시 예상 금액이 자동 계산됩니다.</li>
            <li>3. 오류 시 화면 상단에 안내 문구가 표시됩니다.</li>
          </ol>
        </article>

        <article className="rounded-3xl border border-line/80 bg-white p-5">
          <h3 className="text-base font-semibold text-ink">광고 및 데이터 안내</h3>
          <p className="mt-2 text-sm leading-6 text-subink">
            본 서비스는 추후 Google AdSense 광고가 포함될 수 있습니다. 시세 데이터는 외부
            API 제공 값을 가공해 제공하며, 투자/매매 판단의 단독 근거로 사용하면 안 됩니다.
          </p>
        </article>
      </div>
    </section>
  );
};
