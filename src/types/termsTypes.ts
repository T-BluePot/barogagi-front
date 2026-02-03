import type { TermsItem } from "@/api/types/authResponseTypes";

/** 약관 메타데이터 구조 정의 */
export type Term = Pick<
  TermsItem,
  "termsNum" | "title" | "essentialYn" | "contents"
>;
