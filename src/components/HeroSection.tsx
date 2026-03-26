import { Badge } from "./Badge";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-panel/75 p-8 shadow-luxe backdrop-blur md:p-10 xl:p-14">
      <div className="absolute inset-0 bg-grain opacity-100" />
      <div className="relative">
        <div className="space-y-6">
          <Badge>금시세 계산기를 열어</Badge>
          <div className="space-y-5">
            <h1 className="max-w-3xl font-display text-5xl leading-[0.92] text-white md:text-6xl xl:text-7xl">
              오늘의 금 시세를
              <br />
              고급스럽고 정확하게
              <br />
              바로 계산하는 웹 앱
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/68 md:text-base">
              실시간 금 시세를 기준으로 24K와 18K 예상 금액을 한 화면에서 계산할 수 있는
              프리미엄 골드 밸류 계산기입니다. 랜딩 페이지와 계산 섹션을 함께 구성해
              실제 서비스처럼 시작할 수 있도록 설계했습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
