/**
 * 회원(Auth) 및 사용자 관련 응답 API 타입 정의
 */

/** 약관 조회 응답 DTO */

export type Yn = "Y" | "N";
export type JoinTermsType = "JOIN-MEMBERSHIP";

/** 약관 단일 항목 (응답 구성 요소) */
export interface TermsItem {
  termsNum: number;
  title: string;
  contents: string;
  termsType: JoinTermsType;
  useYn: Yn;
  regDate: string;
  essentialYn: Yn;
  sort: number;
}

/** 약관 조회 응답 DTO */
export type TermsResponseDTO = TermsItem[];
