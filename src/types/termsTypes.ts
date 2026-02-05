import type { TermsProcessRequestType } from "@/api/types";
import { VERIFICATION_REQUEST_TYPE } from "@/constants/verificationTypes";

/** 약관 조회 응답 타입 */

export type Yn = "Y" | "N";

/** 약관 단일 항목 (응답 구성 요소) */
export interface TermsItem {
  termsNum: number;
  title: string;
  contents: string;
  useYn: Yn;
  regDate: string;
  essentialYn: Yn;
  sort: number;
  termsType?: typeof VERIFICATION_REQUEST_TYPE.JOIN_MEMBERSHIP; // auth 로직에서만 필요
}

/** Terms 동의 항목 List 타입 */
export type TermsAgreeList = TermsProcessRequestType[];

/** 약관 메타데이터 구조 정의 */
export type Term = Pick<
  TermsItem,
  "termsNum" | "title" | "essentialYn" | "contents"
>;
