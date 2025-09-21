import { useEffect, useState, useCallback, useRef } from "react";

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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 정리 함수
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 타이머 시작 함수
  const startTimer = useCallback(
    (seconds: number) => {
      clearTimer(); // 기존 타이머 정리
      setRemainingSeconds(seconds);

      timerRef.current = setInterval(() => {
        setRemainingSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          // 0 이하가 되면 타이머 정리하고 0으로 설정
          if (newSeconds <= 0) {
            clearTimer();
            return 0;
          }
          return newSeconds;
        });
      }, 1000);
    },
    [clearTimer]
  );

  // 인증번호 전송 API 호출 시뮬레이션
  const sendCode = useCallback(
    async (phone: string) => {
      setError(null);
      setStatus("sending");
      try {
        // TODO: 실제 API 호출로 교체 필요
        console.log("인증번호 전송:", phone);
        await new Promise((res) => setTimeout(res, 700));
        setStatus("sent");
        startTimer(180); // 3분(180초) 타이머 시작
        return true;
      } catch {
        setError("인증번호 전송에 실패했습니다.");
        setStatus("failed");
        return false;
      }
    },
    [startTimer]
  );

  // 인증번호 확인 API 호출 시뮬레이션
  const verifyCode = useCallback(
    async (phone: string, code: string) => {
      setError(null);
      setStatus("verifying");
      try {
        // TODO: 실제 API 호출로 교체 필요
        console.log("인증번호 확인:", phone, code);
        await new Promise((res) => setTimeout(res, 600));
        // 현재는 빈 문자열이 아닌 모든 코드를 성공으로 처리
        if (!code.trim()) throw new Error("invalid code");
        setStatus("verified");
        clearTimer(); // 인증 성공 시 타이머 정리
        return true;
      } catch {
        setError("인증번호가 일치하지 않습니다.");
        setStatus("failed");
        return false;
      }
    },
    [clearTimer]
  );

  // 인증번호 재전송 (내부적으로 sendCode 재호출)
  const resend = useCallback(
    async (phone: string) => {
      return sendCode(phone);
    },
    [sendCode]
  );

  // 타이머 관리 - 한 번만 시작하고 내부에서 0 이하 체크
  useEffect(() => {
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // MM:SS 형식으로 시간 포맷팅
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
