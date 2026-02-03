import type { Yn, TermsItem, TermsAgreeList } from "@/types/termsTypes";

/**
 * 회원(Auth) 및 사용자 관련 요청 API 타입 정의
 */

/** 로그인 요청 DTO */
export interface LoginDTO {
  userId: string;
  password: string;
  apiSecretKey?: string;
}

/** 회원가입 요청 DTO */
export interface JoinRequestDTO {
  apiSecretKey?: string;
  userId: string;
  password: string;
  email: string;
  birth: string;
  tel: string;
  gender: string; // 'M' | 'F'
  nickName: string;
  joinType?: string; // JOIN_TYPE 값은 넘겨주지 않아도 됨
}

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

/** 인증번호 발송 VO */
export interface ApprovalSendVO {
  tel: string;
  type: string; // 'JOIN-MEMBERSHIP', etc.
  apiSecretKey?: string;
}

/** 인증번호 확인 VO */
export interface ApprovalCompleteVO {
  tel: string;
  authCode: string;
  type: string;
  apiSecretKey?: string;
}

// 약관별 동의 내역
export interface TermsProcessDTO {
  termsNum: number;
  agreeYn: Yn;
}

/** 약관 조회 응답 DTO */
export type TermsResponseType = TermsItem[];

/** 약관 동의 요청 DTO */
export interface TermsDTO {
  userId: string;
  apiSecretKey?: string;
  termsAgreeList: TermsAgreeList;
}
