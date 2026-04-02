import { useState } from "react";

const DEFAULT_OPEN_KAKAO_URL = "https://open.kakao.com/";
const OPEN_KAKAO_QR_IMAGE_PATH = "/images/KakaoTalkqr.png";

const resolveOpenKakaoUrl = () => {
  const rawUrl = import.meta.env.VITE_OPEN_KAKAO_URL?.trim();

  if (!rawUrl) {
    return {
      url: DEFAULT_OPEN_KAKAO_URL,
      isCustom: false
    };
  }

  try {
    const parsedUrl = new URL(rawUrl);
    const isHttps = parsedUrl.protocol === "https:";
    const isKakaoDomain = parsedUrl.hostname.endsWith("kakao.com");

    if (!isHttps || !isKakaoDomain) {
      throw new Error("invalid kakao url");
    }

    return {
      url: parsedUrl.toString(),
      isCustom: true
    };
  } catch {
    return {
      url: DEFAULT_OPEN_KAKAO_URL,
      isCustom: false
    };
  }
};

export const ContactSection = () => {
  const { url: openKakaoUrl, isCustom: isCustomOpenKakaoUrl } = resolveOpenKakaoUrl();
  const [isQrImageUnavailable, setIsQrImageUnavailable] = useState(false);

  return (
    <section
      id="contact"
      className="rounded-[2rem] border border-line/80 bg-panel/90 p-6 shadow-luxe backdrop-blur xl:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent/90">
            Contact
          </p>
          <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">
            문의 보내기
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-subink md:text-base">
            문의는 오픈카톡으로 받고 있습니다. 아래 버튼을 누르거나 우측 QR 코드를
            스캔해 바로 문의해 주세요.
          </p>

          <div className="pt-2 space-y-4">
            <p className="text-xs leading-5 text-subink/80">
              민감한 개인정보(주민번호, 계좌번호, 카드번호 등)는 오픈채팅으로도 보내지
              마세요.
            </p>
            <a
              href={openKakaoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-white transition hover:brightness-105"
            >
              오픈카톡 문의하기
            </a>
            {!isCustomOpenKakaoUrl && (
              <p className="rounded-2xl border border-danger/35 bg-danger/10 px-4 py-3 text-sm text-danger">
                운영 환경에서는 `.env`의 `VITE_OPEN_KAKAO_URL`에 실제 오픈카톡 링크를
                설정해 주세요.
              </p>
            )}
          </div>
        </div>

        <aside className="w-full max-w-[240px] self-start rounded-2xl border border-line/80 bg-white/85 p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-ink">QR로 바로 문의하기</p>
          <a
            href={openKakaoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="block"
            aria-label="오픈카톡 QR 코드 링크 열기"
          >
            {isQrImageUnavailable ? (
              <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-line bg-surface text-center text-xs leading-5 text-subink">
                `public/images/KakaoTalkqr.png`에
                <br />
                QR 이미지를 넣어주세요.
              </div>
            ) : (
              <img
                src={OPEN_KAKAO_QR_IMAGE_PATH}
                alt="오픈카톡 문의 QR 코드"
                className="aspect-square w-full rounded-xl border border-line/80 object-cover"
                loading="lazy"
                onError={() => setIsQrImageUnavailable(true)}
              />
            )}
          </a>
        </aside>
      </div>
    </section>
  );
};
