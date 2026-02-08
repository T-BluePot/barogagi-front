import type { Yn, TermsItem, TermsAgreeList } from "@/types/termsTypes";
import type { GenderType } from "@/constants/userInfo";

/**
 * 회원(Auth) 및 사용자 관련 요청 API 타입 정의
 */

/** 로그인 요청 DTO */
export interface LoginDTO {
  userId: string;
  password: string;
  apiSecretKey?: string;
}

/** 회원가입 Request Body */
export type JoinRequestType = {
  apiSecretKey: string;
  userId: string;
  password: string;
  tel: string;
  nickName: string;

  email?: string; // optional
  birth?: string; // optional (YYYYMMDD)
  gender?: GenderType; // optional
};

/** 회원 정보 수정 요청 DTO */
export interface MemberRequestDTO {
  birth?: string;
  gender?: string;
  nickName?: string;
}

/** 토큰 재발급/로그아웃/탈퇴 요청 DTO */
export interface RefreshTokenRequestDTO {
  refreshToken: string;
}

/** 인증번호 발송 */
export interface ApprovalSendRequestType {
  tel: string;
  type?: string; // 'JOIN-MEMBERSHIP', etc.
  apiSecretKey?: string;
}

/** 인증번호 확인 */
export interface ApprovalCompleteRequestType {
  tel: string;
  authCode: string;
  type?: string;
  apiSecretKey?: string;
}

/** 아이디 찾기 응답 (배열로 반환) */
export type FindUserResponseType = { userId: string }[];

/** 약관별 동의 내역 */
export interface TermsProcessRequestType {
  termsNum: number;
  agreeYn: Yn;
}

/** 약관 조회 응답 */
export type TermsResponseType = TermsItem[];

/** 약관 동의 요청 DTO */
export interface TermsDTO {
  userId: string;
  apiSecretKey?: string;
  termsAgreeList: TermsAgreeList;
}
