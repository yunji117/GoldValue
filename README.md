# Gold Value API

`/api/prices` 엔드포인트에서 귀금속 `g`당 `KRW` 가격을 반환하는 서버리스 API 예시입니다.

## API 흐름

1. `APISED Gold API`에서 `KRW + gram` 기준 금속 시세를 조회합니다.
2. 금은 `24K / 18K / 14K` 순도로 재계산합니다.
3. 최소 60초 동안 서버 메모리 캐시와 `Cache-Control` 헤더를 사용합니다.
4. 외부 API 실패 시 mock 데이터를 반환합니다.

## 폴더 구조

```txt
api/
  _lib/
    calculate.ts
    constants.ts
    metal-api.ts
    mock.ts
    types.ts
  prices.ts
```

## 환경변수

```env
APISED_API_KEY=your_api_key
METAL_API_BASE_URL=https://gold.g.apised.com/v1/latest
```

중요:

- 외부 금속 시세 API 필요
- API KEY 필요 (APISED 또는 MetalpriceAPI 사이트에서 발급)
- API KEY 발급 사이트:
  - APISED: https://gold.g.apised.com/
  - MetalpriceAPI: https://metalpriceapi.com/
- API KEY는 반드시 서버 환경변수에 저장해야 함
- APISED는 `x-api-key` 헤더를 사용함
- `currencies=KRW`, `weight_unit=gram`으로 바로 g당 KRW 가격 조회 가능

## 실행

```bash
npm install
npm run dev:vercel
```

로컬 접속 주소:

- 웹 앱: `http://localhost:3000/`
- API: `http://localhost:3000/api/prices`

정상 동작 시 `/api/prices`는 아래 형태를 반환합니다.

```json
{
  "gold24kPerGram": 142000,
  "gold18kPerGram": 106500,
  "gold14kPerGram": 83070,
  "silverPerGram": 1650,
  "platinumPerGram": 48500,
  "palladiumPerGram": 46200,
  "updatedAt": "2026-03-26T09:00:00.000Z",
  "source": "live"
}
```
