export const TERMS_TEXT = {
  title: "바로가기 서비스를 이용하기 위해\n약관에 동의해주세요",
  agreeAll: "전체 동의하기",
  nextButton: "다음",
} as const;

/** 약관 항목 정의 */
export const TERMS_LIST = [
  {
    id: "privacy",
    label: "개인정보 수집 및 이용 동의 (필수)",
  },
  {
    id: "marketing",
    label: "마케팅 정보 수신 동의 (선택)",
  },
] as const;
