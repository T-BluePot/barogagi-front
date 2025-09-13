import { useEffect, useState, useCallback } from "react";

type VerifyStatus =
  | "idle"
  | "sending"
  | "sent"
  | "verifying"
  | "verified"
  | "failed";

export const usePhoneVerify = () => {
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // sendCode: simulate API call to send SMS
  const sendCode = useCallback(async (phone: string) => {
    setError(null);
    setStatus("sending");
    try {
      // TODO: replace with real API call
      await new Promise((res) => setTimeout(res, 700));
      setStatus("sent");
      setRemainingSeconds(180); // 3 minutes
      return true;
    } catch (e) {
      setError("인증번호 전송에 실패했습니다.");
      setStatus("failed");
      return false;
    }
  }, []);

  const verifyCode = useCallback(async (phone: string, code: string) => {
    setError(null);
    setStatus("verifying");
    try {
      // TODO: replace with real API call
      await new Promise((res) => setTimeout(res, 600));
      // For now accept any non-empty code as success
      if (!code.trim()) throw new Error("invalid code");
      setStatus("verified");
      return true;
    } catch (e) {
      setError("인증번호가 일치하지 않습니다.");
      setStatus("failed");
      return false;
    }
  }, []);

  const resend = useCallback(
    async (phone: string) => {
      return sendCode(phone);
    },
    [sendCode]
  );

  // timer
  useEffect(() => {
    if (status !== "sent") return;
    if (remainingSeconds <= 0) return;

    const id = setInterval(() => {
      setRemainingSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [status, remainingSeconds]);

  const formattedTime = (() => {
    const mm = Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (remainingSeconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  })();

  return {
    status,
    error,
    remainingSeconds,
    formattedTime,
    sendCode,
    verifyCode,
    resend,
  } as const;
};
