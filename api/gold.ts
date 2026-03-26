const TROY_OUNCE_TO_GRAM = 31.1034768;

const buildMockResponse = () => ({
  // 실제 API 연결 전 테스트용
  prices: {
    gold: {
      label: "24K Gold",
      pricePerGramKrw: 142000,
      pricePerOunceKrw: 4416794
    },
    silver: {
      label: "Silver",
      pricePerGramKrw: 1650,
      pricePerOunceKrw: 51321
    },
    platinum: {
      label: "Platinum",
      pricePerGramKrw: 48500,
      pricePerOunceKrw: 1508549
    },
    palladium: {
      label: "Palladium",
      pricePerGramKrw: 46200,
      pricePerOunceKrw: 1436991
    }
  },
  updatedAt: new Date().toISOString(),
  source: "mock",
  provider: "Mock Gold Feed",
  currency: "KRW",
  note: "실제 API 연결 전 테스트용 mock 데이터입니다."
});

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // 이 부분은 외부 금 시세 API 필요
    // 예: GoldAPI / MetalpriceAPI 사용 가능
    // API KEY 필요 시 서버 환경변수로 관리
    //
    // 현재 예시 구현은 MetalpriceAPI 기준입니다.
    // 어떤 사이트에서 발급받아야 하는지:
    // https://metalpriceapi.com/
    //
    // 어떤 키 이름으로 서버 환경변수에 넣어야 하는지:
    // METALPRICE_API_KEY
    //
    // 여기에 API KEY 필요
    const apiKey = process.env.METALPRICE_API_KEY;

    if (!apiKey) {
      return res.status(200).json(buildMockResponse());
    }

    const response = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=KRW&currencies=XAU,XAG,XPT,XPD`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("MetalpriceAPI request failed");
    }

    const payload = await response.json();
    const xauRate = payload?.rates?.XAU;
    const xagRate = payload?.rates?.XAG;
    const xptRate = payload?.rates?.XPT;
    const xpdRate = payload?.rates?.XPD;

    if (
      !xauRate ||
      !xagRate ||
      !xptRate ||
      !xpdRate ||
      typeof xauRate !== "number" ||
      typeof xagRate !== "number" ||
      typeof xptRate !== "number" ||
      typeof xpdRate !== "number"
    ) {
      throw new Error("Invalid metal rate");
    }

    // MetalpriceAPI 문서 기준:
    // base=KRW, currencies=XAU 이면 1 KRW 당 XAU 양이 내려옵니다.
    // 따라서 1 / XAU = 1 트로이온스 금 가격(KRW) 입니다.
    const goldPerOunceKrw = 1 / xauRate;
    const silverPerOunceKrw = 1 / xagRate;
    const platinumPerOunceKrw = 1 / xptRate;
    const palladiumPerOunceKrw = 1 / xpdRate;

    return res.status(200).json({
      prices: {
        gold: {
          label: "24K Gold",
          pricePerGramKrw: Math.round(goldPerOunceKrw / TROY_OUNCE_TO_GRAM),
          pricePerOunceKrw: Math.round(goldPerOunceKrw)
        },
        silver: {
          label: "Silver",
          pricePerGramKrw: Math.round(silverPerOunceKrw / TROY_OUNCE_TO_GRAM),
          pricePerOunceKrw: Math.round(silverPerOunceKrw)
        },
        platinum: {
          label: "Platinum",
          pricePerGramKrw: Math.round(platinumPerOunceKrw / TROY_OUNCE_TO_GRAM),
          pricePerOunceKrw: Math.round(platinumPerOunceKrw)
        },
        palladium: {
          label: "Palladium",
          pricePerGramKrw: Math.round(palladiumPerOunceKrw / TROY_OUNCE_TO_GRAM),
          pricePerOunceKrw: Math.round(palladiumPerOunceKrw)
        }
      },
      updatedAt: payload?.timestamp
        ? new Date(payload.timestamp * 1000).toISOString()
        : new Date().toISOString(),
      source: "live",
      provider: "MetalpriceAPI",
      currency: "KRW"
    });
  } catch (error) {
    return res.status(200).json({
      ...buildMockResponse(),
      note:
        error instanceof Error
          ? `실시간 API 호출 실패로 mock 데이터를 사용합니다: ${error.message}`
          : "실시간 API 호출 실패로 mock 데이터를 사용합니다."
    });
  }
}
