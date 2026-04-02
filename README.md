# Gold Value

Gold API 국제 시세를 기준으로 `24K / 18K / 14K / 백금 / 은 / 팔라듐`의 예상 매입/판매 금액을 계산하는 웹앱입니다.

## 실행 방법

### 1) 프론트 확인 모드

외부 API 없이 화면/UI만 빠르게 확인하는 모드입니다.

```bash
npm install
npm run dev
```

- 웹 주소: `http://localhost:5173/`
- 특징: API 서버를 별도로 띄우지 않으면 시세 조회가 실패하며 에러 안내가 표시됩니다.

### 2) Live 모드 (Gold API 연동)

실시간 시세를 포함한 전체 흐름을 확인하는 모드입니다.

1. `.env`에 환경변수를 설정합니다. (로컬 실행은 `.env` 한 파일만 사용)
2. 서버를 실행합니다.

```bash
npm run dev:vercel
```

- 웹 주소: `http://localhost:3000/`
- API 주소: `http://localhost:3000/api/prices`
- 확인 포인트: `/api/prices` 응답의 `"source"`가 `"live"`면 정상 연동입니다.

### 3) 오픈카톡 문의 링크 연결

`문의 보내기` 섹션에서 오픈카톡으로 바로 이동하려면 아래 환경변수를 설정하세요.

```env
VITE_OPEN_KAKAO_URL=https://open.kakao.com/o/your_open_chat_path
```

- 동작 방식: 브라우저 -> 오픈카톡 링크 새 탭 이동
- 참고: URL이 없거나 형식이 잘못되면 기본 링크(`https://open.kakao.com/`)로 이동합니다.
- QR 코드 이미지 파일 위치: `public/images/KakaoTalkqr.png`

## 기술 스택

- Frontend: `React 18`, `TypeScript`, `Vite`
- UI: `Tailwind CSS`, `PostCSS`, `Autoprefixer`
- API Runtime: `Vercel Functions` (`api/prices.ts`)
- External API: `Gold API` (`https://api.gold-api.com`)

## API 사용 방식 (요약)

1. 프론트가 `/api/prices`를 호출합니다.
2. 서버 함수가 Gold API에서 `XAU`, `XAG`, `XPT`, `XPD` spot 가격(USD/oz)을 조회합니다.
3. 서버에서 USD/KRW 환율을 적용해 KRW/g로 변환하고, 금속별 `purityRatio`, `buyPremiumMultiplier`, `buyVatRate`, `sellDiscountMultiplier`, `buy/sell 고정 오프셋`을 반영합니다.
4. (선택) `PRICE_ALIGN_TARGET_*` 환경변수가 있으면 목표 시세(예: 24K 3.75g)를 기준으로 자동 보정합니다.
5. 응답은 메모리 캐시(기본 60초) 후 반환됩니다.
6. 운영 환경에서는 외부 API 실패 시 오류를 반환하고, 개발 환경에서는 fallback 데이터를 선택적으로 사용할 수 있습니다.
7. 상단 요약 카드는 24K `내가 살 때(3.75g)`와 `내가 팔 때(3.75g)`를 표시합니다.

### 국내 시세 근접 보정 방법

- 파일: `api/_lib/metals-config.ts`
- 자주 조정하는 값:
  - `buyPremiumMultiplier`
  - `buyVatRate`
  - `buyFixedKrwPerGram`
  - `sellDiscountMultiplier`
  - `sellFixedKrwPerGram`
- 위 값만 바꾸면 전체 계산 결과가 즉시 반영됩니다.

### 목표 시세 자동 정렬

- 서버는 입력된 목표값 환경변수를 기준으로 자동 보정합니다.
- `PRICE_ALIGN_TARGET_*` 환경변수를 넣으면 Gold API 계산 결과를 목표값에 맞춰 자동 보정합니다.
- 기본은 `24K`를 기준으로 맞추고(`PRICE_ALIGN_PROPAGATE_GOLD=true`), 필요하면 자산별 목표값을 따로 입력할 수 있습니다.
- KST 시간대별로 `_00`, `_12`, `_18` suffix 값이 있으면 해당 슬롯 값이 우선 적용됩니다.

## 문의 기능 흐름 (요약)

1. 사용자가 앱 하단 `오픈카톡 문의하기` 버튼을 클릭합니다.
2. 브라우저가 `VITE_OPEN_KAKAO_URL`로 새 탭 이동합니다.

## 폴더 구조

```txt
src/
  components/         # 화면 컴포넌트
  hooks/              # 데이터 훅
  services/           # 프론트 API 호출/매핑(시세)
api/
  prices.ts           # 시세 API 엔드포인트
  _lib/               # API 계산/타입/외부 호출/보정계수 유틸
```

## 환경변수

로컬 실행 시에는 `.env` **한 파일만** 사용하세요.  
`.env.example`는 샘플 템플릿이며 런타임에서 사용되지 않습니다.

```env
# 프론트가 호출할 API 경로 (기본값)
VITE_GOLD_API_ENDPOINT=/api/prices
# 문의 버튼 오픈카톡 링크
VITE_OPEN_KAKAO_URL=https://open.kakao.com/o/your_open_chat_path

# Gold API base URL
GOLD_API_BASE_URL=https://api.gold-api.com
# (선택) Gold API 키
GOLD_API_KEY=your_gold_api_key_optional

# (선택) USD/KRW 고정 환율
USD_KRW_FIXED_RATE=
# 환율 API 실패 시 fallback 환율
USD_KRW_FALLBACK_RATE=1370
# (선택) 환율 API URL / 키
EXCHANGE_RATE_API_URL=https://open.er-api.com/v6/latest/USD
EXCHANGE_RATE_API_KEY=

# 운영 환경에서 fallback mock 허용 여부
ALLOW_MOCK_FALLBACK=false

# (선택) 목표 시세 자동 정렬
# 24K 3.75g 기준 (기본/시간대별)
PRICE_ALIGN_PROPAGATE_GOLD=true
PRICE_ALIGN_TARGET_BUY_24K_3_75G=
PRICE_ALIGN_TARGET_SELL_24K_3_75G=
PRICE_ALIGN_TARGET_BUY_24K_3_75G_00=
PRICE_ALIGN_TARGET_SELL_24K_3_75G_00=
PRICE_ALIGN_TARGET_BUY_24K_3_75G_12=
PRICE_ALIGN_TARGET_SELL_24K_3_75G_12=
PRICE_ALIGN_TARGET_BUY_24K_3_75G_18=
PRICE_ALIGN_TARGET_SELL_24K_3_75G_18=
# (선택) 자산별 정렬
# PRICE_ALIGN_TARGET_BUY_PLATINUM_3_75G=
# PRICE_ALIGN_TARGET_SELL_PLATINUM_3_75G=

```

## 로컬 주소 정리

- 프론트 확인 모드 웹: `http://localhost:5173/`
- Live 모드 웹: `http://localhost:3000/`
- Live 모드 API: `http://localhost:3000/api/prices`

## 참고

- 기본 연동 경로는 `/api/prices`입니다.
- `api/gold.ts`는 과거 예시용 경로이며 현재 기본 흐름에서는 사용하지 않습니다.
