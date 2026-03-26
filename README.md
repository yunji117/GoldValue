# Gold Value

실시간 금속 시세를 바탕으로 `24K / 18K / 14K / 백금 / 은 / 팔라듐`의 예상 금액을 계산하는 웹앱입니다.

## 실행 방법

### 1) Mock 모드 (프론트만 확인)

외부 API 없이 화면/UI만 빠르게 확인하는 모드입니다.

```bash
npm install
npm run dev
```

- 웹 주소: `http://localhost:5173/`
- 특징: API 서버를 별도로 띄우지 않으면 앱에서 `Mock Fallback` 상태로 표시됩니다.

### 2) Live 모드 (APISED 연동)

실시간 시세를 포함한 전체 흐름을 확인하는 모드입니다.

1. `.env.local` (또는 `.env`)에 환경변수를 설정합니다.
2. 서버를 실행합니다.

```bash
npm run dev:vercel
```

- 웹 주소: `http://localhost:3000/`
- API 주소: `http://localhost:3000/api/prices`
- 확인 포인트: `/api/prices` 응답의 `"source"`가 `"live"`면 정상 연동입니다.

## 기술 스택

- Frontend: `React 18`, `TypeScript`, `Vite`
- UI: `Tailwind CSS`, `PostCSS`, `Autoprefixer`
- API Runtime: `Vercel Functions` (`api/prices.ts`)
- External API: `APISED Gold API`

## API 사용 방식 (요약)

1. 프론트가 `/api/prices`를 호출합니다.
2. 서버 함수가 APISED에 `x-api-key` 헤더로 요청합니다.
3. 서버에서 KRW/gram 기준 가격을 계산하고, 금은 `18K`, `14K` 순도로 변환합니다.
4. 응답은 메모리 캐시(기본 60초) 후 반환됩니다.
5. 외부 API 오류 시 mock 데이터를 fallback으로 반환합니다.

## 폴더 구조

```txt
src/
  components/         # 화면 컴포넌트
  hooks/              # 데이터 훅
  services/           # 프론트 API 호출/매핑
  data/               # 프론트 fallback mock
api/
  prices.ts           # 메인 서버 API 엔드포인트
  _lib/               # API 계산/타입/외부 호출 유틸
```

## 환경변수

```env
# 프론트가 호출할 API 경로 (기본값)
VITE_GOLD_API_ENDPOINT=/api/prices

# 서버에서 사용하는 APISED 키
APISED_API_KEY=your_apised_api_key

# (선택) APISED base URL
METAL_API_BASE_URL=https://gold.g.apised.com/v1/latest
```

## 로컬 주소 정리

- Mock 모드 웹: `http://localhost:5173/`
- Live 모드 웹: `http://localhost:3000/`
- Live 모드 API: `http://localhost:3000/api/prices`

## 참고

- 기본 연동 경로는 `/api/prices`입니다.
- `api/gold.ts`는 과거 예시용 경로이며 현재 기본 흐름에서는 사용하지 않습니다.
