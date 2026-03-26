# Gold Value

실시간 금 시세를 기준으로 24K와 18K 예상 금액을 계산하는 React + TypeScript + Vite 프로젝트입니다.

## 추천 API

- `MetalpriceAPI`
  - 공식 문서: https://metalpriceapi.com/documentation
  - `latest` 엔드포인트와 `XAU` 심볼을 사용해 금 시세를 받아올 수 있습니다.
  - 무료 플랜이 있다고 안내하지만, 실제 호출 제한과 unit 옵션은 플랜에 따라 다를 수 있으니 공식 문서를 확인하세요.
- `GoldAPI`
  - 대안으로 많이 쓰이는 금속 시세 API입니다.
  - 공식 사이트: https://www.goldapi.io/api/
  - 세부 플랜과 응답 형식은 배포 전에 공식 문서를 다시 확인하는 것을 권장합니다.

## 로컬 개발

```bash
npm install
npm run dev
```

## 환경변수

`.env.example`를 참고하세요.

중요:

- 프론트엔드에 API Key를 직접 넣지 않습니다.
- 서버 환경변수에 `METALPRICE_API_KEY`를 설정합니다.
- 로컬에서 `/api/gold` 서버리스 함수가 없으면 프론트는 자동으로 mock 데이터를 사용합니다.

## 배포

Vercel 배포를 기준으로 `api/gold.ts` 서버리스 함수를 함께 사용할 수 있게 구성했습니다.

## 주요 구조

```txt
api/                서버리스 금 시세 프록시
src/components/     UI 컴포넌트
src/hooks/          시세 조회 훅
src/lib/            계산/포맷 유틸
src/services/       프론트 API 호출 분리
src/data/           mock 데이터
```
