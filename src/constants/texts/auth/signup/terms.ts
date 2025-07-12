export const TERMS_TEXT = {
  TITLE: "바로가기 서비스를 이용하기 위해\n약관에 동의해주세요",
  AGREE_ALL: "전체 동의하기",
  NEXT_BUTTON: "다음",
} as const;

/** 약관 항목 정의 */
export const TERMS_LIST = [
  {
    ID: "PRIVACY",
    LABEL: "개인정보 수집 및 이용 동의 (필수)",
  },
  {
    ID: "MARKETING",
    LABEL: "마케팅 정보 수신 동의 (선택)",
  },
] as const;
