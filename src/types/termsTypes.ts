import { TERMS_LIST } from "@/constants/texts/auth/signup/terms";

/** 약관 식별자 타입: "PRIVACY" | "MARKETING" */
export type TermId = (typeof TERMS_LIST)[number]["ID"];

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
  id: termData.ID,
  label: termData.LABEL,
  required: TERMS_REQUIRED[termData.ID],
}));
