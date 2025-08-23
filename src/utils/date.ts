export const formatDateToKorean = (date: Date | null): string => {
  if (!date) return "날짜를 선택해주세요";

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
