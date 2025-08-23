/** 약관 항목 정의 */
export const TERMS_LIST = [
  {
    id: "PRIVACY",
    label: "개인정보 수집 및 이용 동의 (필수)",
    required: true,
  },
  {
    id: "MARKETING",
    label: "마케팅 정보 수신 동의 (선택)",
    required: false,
  },
] as const;

/** 약관 식별자 타입: "PRIVACY" | "MARKETING" */
export type TermId = (typeof TERMS_LIST)[number]["id"];

/** 약관 메타데이터 구조 정의 */
export interface Term {
  id: TermId; // "PRIVACY" | "MARKETING"
  label: string; // 사용자에게 보여지는 텍스트
  required: boolean; // 필수 여부 (UI/검증용)
}

export const TERMS_REQUIRED: Record<TermId, boolean> = {
  PRIVACY: true,
  MARKETING: false,
} as const;

/** 약관 데이터 선언 */
export const TERMS: Term[] = TERMS_LIST.map((termData) => ({
  id: termData.id,
  label: termData.label,
  required: termData.required,
}));
