import type { Yn, TermsItem } from "@/types/termsTypes";
import type { SignupPayloadType } from "@/types/signupTypes";

import { VERIFICATION_REQUEST_TYPE } from "@/constants/verificationTypes";

/**
 * 회원(Auth) 및 사용자 관련 요청 API 타입 정의
 */

/** 로그인 요청 Request Body 타입 */
export interface LoginRequestType {
  userId: string;
  password: string;
}

/** 로그인 응답 data 타입 */
export type LoginResponseDataType = {
  userId: string;
  membershipNo: string;
  accessToken: string;
  accessTokenExpiresIn: number; // 초 단위- 예: 1800 = 30분
  refreshToken: string;
  refreshTokenExpiresIn: number; // 초 단위- ex: 2592000 = 30일
};

/** 약관 조회 응답 타입 */
export type TermsResponseType = TermsItem[];

/** 약관 동의 요청 DTO */
export type TermsDTOType = {
  termsType: typeof VERIFICATION_REQUEST_TYPE.JOIN_MEMBERSHIP;
  termsAgreeList: TermsProcessRequestType[];
};

/** 회원가입 Request Body */
export type JoinRequestType = SignupPayloadType;

/** 회원 정보 수정 요청 DTO */
export interface MemberRequestDTO {
  birth?: string;
  gender?: string;
  nickName?: string;
}

/** refresh(토큰 재발급/로그아웃/탈퇴) 요청 타입 */
export interface RefreshTokenRequestType {
  refreshToken: string;
}

/** refresh 응답 data 타입 */
export type RefreshResponseDataType = {
  refreshTokenExpiresIn: number; // 초 단위
  accessTokenExpiresIn: number; // 초 단위
  accessToken: string;
  refreshToken: string;
};

/** 인증번호 발송 */
export interface ApprovalSendRequestType {
  tel: string;
  type?: string; // signup: 'JOIN-MEMBERSHIP';
}

/** 인증번호 확인 */
export interface ApprovalCompleteRequestType {
  tel: string;
  authCode: string;
  type?: string;
}

/** 아이디 찾기 응답 */
export type FindUserResponseType = {
  userId?: string;
};

/** 약관별 동의 내역 */
export interface TermsProcessRequestType {
  termsNum: number;
  agreeYn: Yn;
}

/** 비밀번호 재설정 요청 DTO */
export interface PasswordResetConfirmDTO {
  userId: string;
  password: string;
}

/** 탈퇴 사유 항목 DTO */
export interface WithdrawalReasonDTO {
  reasonNo: number;
  reason: string;
}

/** 회원 탈퇴 요청 DTO */
export interface WithdrawRequestDTO {
  reasonNo: number;
  withdrawReason: string;
}
