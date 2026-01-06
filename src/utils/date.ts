/**
 * 시간 입력값 검증 (1-12 범위)
 * @param value - 입력된 값
 * @returns 유효한 경우 value, 아니면 null
 */
export const validateHourInput = (value: string): string | null => {
  const cleaned = value.replace(/\D/g, "").slice(0, 2);
  if (cleaned === "") return cleaned;
  const num = parseInt(cleaned, 10);
  return num >= 1 && num <= 12 ? cleaned : null;
};

/**
 * 분 입력값 검증 (0-59 범위)
 * @param value - 입력된 값
 * @returns 유효한 경우 value, 아니면 null
 */
export const validateMinuteInput = (value: string): string | null => {
  const cleaned = value.replace(/\D/g, "").slice(0, 2);
  if (cleaned === "") return cleaned;
  const num = parseInt(cleaned, 10);
  return num >= 0 && num <= 59 ? cleaned : null;
};

export const formatDateToKorean = (date: Date | null): string => {
  if (!date) return "날짜를 선택해주세요";

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * 날짜 포맷 변환 함수
 * @param date - Date 객체
 * @param type - "display" | "server"
 * @returns 문자열 (예: "2025년 10월 05일" 또는 "2025-10-05")
 */
export const formatDate = (
  date: Date,
  type: "display" | "server" = "server"
): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  if (type === "display") {
    // 화면 표시용 (한국어)
    return `${year}년 ${month}월 ${day}일`;
  } else {
    // 서버 전송용 (표준 ISO 형식)
    return `${year}-${month}-${day}`;
  }
};
