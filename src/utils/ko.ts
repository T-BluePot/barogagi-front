/**
 * 한글 검색 안정성을 위한 문자열 정규화 유틸
 * - NFC 정규화: 같은 글자의 다른 유니코드 표현을 통일
 * - 연속 공백을 한 칸으로 축소
 * - 앞뒤 공백 제거
 */
export const normalizeKo = (s?: string): string => {
  // s가 undefined/null이어도 안전하게 처리
  const safe = s ?? "";
  return safe.normalize("NFC").replace(/\s+/g, " ").trim();
};
