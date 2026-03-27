import { FormEvent, useState } from "react";
import { sendContactInquiry } from "../services/contact";

type ContactStatus = "idle" | "sending" | "success" | "error";

interface ContactFormState {
  subject: string;
  message: string;
}

const INITIAL_FORM_STATE: ContactFormState = {
  subject: "",
  message: ""
};

export const ContactSection = () => {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = form.message.trim();
    const trimmedSubject = form.subject.trim();

    if (!trimmedMessage) {
      setStatus("error");
      setFeedbackMessage("문의 내용은 필수 입력 항목입니다.");
      return;
    }

    try {
      setStatus("sending");
      setFeedbackMessage("");

      const result = await sendContactInquiry({
        subject: trimmedSubject,
        message: trimmedMessage
      });

      setStatus("success");
      setFeedbackMessage(result.message);
      setForm(INITIAL_FORM_STATE);
    } catch (error) {
      setStatus("error");
      setFeedbackMessage(
        error instanceof Error ? error.message : "문의 전송에 실패했습니다."
      );
    }
  };

  return (
    <section
      id="contact"
      className="rounded-[2rem] border border-line/80 bg-panel/90 p-6 shadow-luxe backdrop-blur xl:p-8"
    >
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent/90">
          Contact
        </p>
        <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">
          문의 보내기
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-subink md:text-base">
          문의 내용은 서버 API를 통해 운영자 Gmail로 전달됩니다. 화면에는 운영자 이메일
          주소를 직접 노출하지 않습니다.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink">제목 (선택)</span>
          <input
            type="text"
            value={form.subject}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, subject: event.target.value }))
            }
            placeholder="예: 시세 데이터 관련 문의"
            className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-ink outline-none transition placeholder:text-subink/55 focus:border-accent/80"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink">문의 내용</span>
          <textarea
            rows={6}
            value={form.message}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, message: event.target.value }))
            }
            placeholder="문의 내용을 입력해 주세요"
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-ink outline-none transition placeholder:text-subink/55 focus:border-accent/80"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-subink/80">
            민감한 개인정보(주민번호, 계좌번호, 카드번호 등)는 입력하지 마세요.
          </p>
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "sending" ? "전송 중..." : "문의 보내기"}
          </button>
        </div>
      </form>

      {feedbackMessage && (
        <div
          className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
            status === "success"
              ? "border border-mint/35 bg-mint/10 text-ink"
              : "border border-danger/35 bg-danger/10 text-danger"
          }`}
        >
          {feedbackMessage}
        </div>
      )}
    </section>
  );
};
