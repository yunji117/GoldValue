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
          제시되는 시세는 실시간 국제시세와 환율, 보정계수를 반영해 산출된 참고용 값입니다.
        </p>
      </div>
    </section>
  );
};
