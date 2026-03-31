export const NoticePanel = () => {
  return (
    <section className="rounded-[2rem] border border-line/80 bg-panel/80 p-6 backdrop-blur">
      <h3 className="text-lg font-semibold text-ink">🚨 안내 사항</h3>
      <div className="mt-4 space-y-3 text-sm leading-7 text-subink">
        <p>
          본 계산 결과는 국제 시세와 환율, 금속별 보정계수를 반영한 참고용 예상 금액입니다.
        </p>
        <p>
          실제 매입/판매 금액은 세공비, 제작 공임, 수수료, 유통 마진, 매장 정책, 시세 반영 시점에 따라 달라질 수 있습니다.
        </p>
        <p>
          본 서비스는 특정 거래소와 제휴하지 않으며, 공식 고시 가격을 그대로 제공하는 서비스가 아닙니다.
        </p>
      </div>
    </section>
  );
};
