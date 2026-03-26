export const NoticePanel = () => {
  return (
    <section className="rounded-[2rem] border border-line/80 bg-panel/80 p-6 backdrop-blur">
      <h3 className="text-lg font-semibold text-ink">안내 사항</h3>
      <div className="mt-4 space-y-3 text-sm leading-7 text-subink">
        <p>
          본 계산 결과는 금 시세를 기준으로 한 참고용 금액입니다.
        </p>
        <p>
          실제 금액은 세공비, 제작 공임, 수수료, 유통 마진, 매입 기준, 업체 정책에 따라 달라질 수 있습니다.
        </p>
      </div>
    </section>
  );
};
