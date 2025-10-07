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
