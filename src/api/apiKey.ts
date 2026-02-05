/**
 * API 키 검증 및 반환 유틸리티
 */
export const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "VITE_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요."
    );
  }

  return apiKey;
};
