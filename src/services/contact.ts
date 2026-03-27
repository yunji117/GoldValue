interface ContactInquiryPayload {
  subject: string;
  message: string;
}

interface ContactInquiryResponse {
  ok: boolean;
  message: string;
}

const CONTACT_API_ENDPOINT = import.meta.env.VITE_CONTACT_API_ENDPOINT || "/api/contact";

const parseResponseMessage = async (response: Response) => {
  try {
    const json = (await response.json()) as Partial<ContactInquiryResponse>;
    return json.message || "요청 처리에 실패했습니다.";
  } catch {
    return "요청 처리에 실패했습니다.";
  }
};

export const sendContactInquiry = async (
  payload: ContactInquiryPayload
): Promise<ContactInquiryResponse> => {
  const response = await fetch(CONTACT_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await parseResponseMessage(response);
    throw new Error(message);
  }

  return (await response.json()) as ContactInquiryResponse;
};
