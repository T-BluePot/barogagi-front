import { TERMS_LIST } from "@/constants/texts/auth/signup/terms";

/** 약관 메타데이터 */
export interface Term {
  id: "privacy" | "marketing"; // 식별자
  label: string; // UI에 표시될 텍스트
  required: boolean; // 필수 여부 (디자인/검증에 활용)
}

/** "privacy" | "marketing"  */
export type TermId = (typeof TERMS_LIST)[number]["id"];

export const TERMS_REQUIRED: Record<TermId, boolean> = {
  privacy: true,
  marketing: false,
} as const;

/** 약관 데이터 선언 */
export const TERMS = TERMS_LIST.map((termData) => ({
  ...termData,
  required: TERMS_REQUIRED[termData.id],
})) satisfies Term[];
