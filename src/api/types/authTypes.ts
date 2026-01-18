/**
 * 회원(Auth) 및 사용자 관련 API 타입 정의
 */

/** 로그인 요청 DTO */
export interface LoginDTO {
  userId: string;
  password: string;
  apiSecretKey?: string;
}

/** 회원가입 요청 DTO */
export interface JoinRequestDTO {
  userId: string;
  password: string;
  email: string;
  birth: string;
  tel: string;
  gender: string; // 'M' | 'F'
  nickName: string;
  joinType?: string;
  apiSecretKey?: string;
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

/** 약관 동의 요청 DTO */
export interface TermsProcessDTO {
  termsNum: number;
  agreeYn: "Y" | "N";
}

export interface TermsDTO {
  userId: string;
  apiSecretKey?: string;
  termsAgreeList: TermsProcessDTO[];
}
