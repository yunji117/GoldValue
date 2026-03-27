const RESEND_API_URL = "https://api.resend.com/emails";
const RATE_LIMIT_WINDOW_MS = 30 * 1000;
const recentRequestByIp = new Map<string, number>();

const getClientIp = (req: any) => {
  const forwarded = req.headers?.["x-forwarded-for"];

  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "unknown";
};

const normalizeText = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const parseRequestBody = (body: unknown) => {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  if (body && typeof body === "object") {
    return body as Record<string, unknown>;
  }

  return null;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      ok: false,
      message: "Method Not Allowed"
    });
  }

  const clientIp = getClientIp(req);
  const now = Date.now();
  const lastRequestAt = recentRequestByIp.get(clientIp);

  if (lastRequestAt && now - lastRequestAt < RATE_LIMIT_WINDOW_MS) {
    return res.status(429).json({
      ok: false,
      message: "잠시 후 다시 시도해 주세요."
    });
  }

  recentRequestByIp.set(clientIp, now);

  const body = parseRequestBody(req.body);

  if (!body) {
    return res.status(400).json({
      ok: false,
      message: "잘못된 요청 형식입니다."
    });
  }

  const name = normalizeText(body.name, 60);
  const email = normalizeText(body.email, 120);
  const subject = normalizeText(body.subject, 120);
  const message = normalizeText(body.message, 3000);

  if (!message) {
    return res.status(400).json({
      ok: false,
      message: "문의 내용은 필수 입력 항목입니다."
    });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({
      ok: false,
      message: "올바른 이메일 형식이 아닙니다."
    });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !toEmail || !fromEmail) {
    return res.status(500).json({
      ok: false,
      message: "문의 메일 기능이 아직 설정되지 않았습니다."
    });
  }

  try {
    const composedSubject = `[Gold Value 문의] ${subject || "일반 문의"}`;
    const text = [
      "Gold Value 문의가 접수되었습니다.",
      "",
      `이름: ${name || "미입력"}`,
      `답장 이메일: ${email || "미입력"}`,
      `제목: ${subject || "일반 문의"}`,
      "",
      "문의 내용",
      "------------------------------",
      message
    ].join("\n");

    const emailPayload: Record<string, unknown> = {
      from: fromEmail,
      to: [toEmail],
      subject: composedSubject,
      text
    };

    if (email) {
      emailPayload.reply_to = email;
    }

    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emailPayload)
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Mail API failed: ${response.status} ${detail}`);
    }

    return res.status(200).json({
      ok: true,
      message: "문의가 접수되었습니다. 확인 후 답변드릴게요."
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message:
        error instanceof Error
          ? `문의 전송에 실패했습니다: ${error.message}`
          : "문의 전송에 실패했습니다."
    });
  }
}
