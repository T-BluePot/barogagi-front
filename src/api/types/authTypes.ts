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
  /**
   * 기기를 식별할 수 있는 고유 데이터. 서버 필수값.
   *
   * 서버는 발급한 토큰을 `(membershipNo, deviceId)` 단위로 보관한다 — 로그아웃 API 가
   * "전달된 refreshToken 이 속한 (membershipNo, deviceId) 의 토큰을 REVOKE" 하는 이유다.
   * 값은 `utils/deviceId.ts` 의 `getDeviceId()` 로 얻는다 (호출부가 직접 만들지 않는다).
   */
  deviceId: string;
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

/**
 * 회원 정보 조회 응답 DTO
 * GET /api/v1/members — test 서버 실측 기준 13개 필드 전부.
 *
 * ⚠️ 서버는 **미설정을 `null` 이 아니라 빈 문자열로** 준다(`email`·`birth`·`areaCd` 등).
 *    `gender` 만 `null` 로 온다. 화면에서 직접 쓰지 말고 `toUserData` 로 정규화한 뒤 쓴다.
 *
 * ⚠️ `password` 가 응답에 포함된다(값은 빈 문자열). 서버에서 빼는 게 맞지만
 *    실제로 내려오므로 타입에는 있는 그대로 적는다 — 화면에서는 절대 쓰지 않는다.
 */
export interface MemberResponseDTO {
  membershipNo: string;
  userId: string;
  /** 🚫 항상 빈 문자열. 사용 금지 */
  password: string;
  email: string;
  /** "YYYYMMDD" 또는 빈 문자열 */
  birth: string;
  tel: string;
  gender: string | null;
  nickName: string;
  /** 선호 지역 시/도 코드 또는 빈 문자열 */
  areaCd: string;
  /** 선호 지역 시·군·구 코드 또는 빈 문자열 */
  sigunguCd: string;
  joinType: string;
  regDate: string;
  updDate: string;
}

/**
 * 회원 정보 수정 요청 DTO
 * PATCH /api/v1/members — 서버 `MemberRequestDTO` 기준 5개 필드 전부 optional
 */
export interface MemberRequestDTO {
  birth?: string;
  gender?: string;
  nickName?: string;
  /** 선호 지역 — 시/도 코드 (예: "11") */
  areaCd?: string;
  /** 선호 지역 — 시·군·구 코드 (예: "11110"). `areaCd` 없이 단독 전송하지 않는다 */
  sigunguCd?: string;
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
  /**
   * 기기 식별자. `getDeviceId()` 로 얻는다.
   *
   * ⚠️ 백엔드 API 문서에는 `userId` / `password` 만 적혀 있으나,
   *    스웨거상 이 엔드포인트의 requestBody 는 로그인과 **같은 `LoginDTO`** 를 참조하고
   *    `LoginDTO.required` 는 `["deviceId", "password", "userId"]` 다.
   *    스웨거는 코드에서 생성되므로 실제 DTO 를 반영한다 → 문서 쪽이 오래된 것으로 보인다.
   *    보내서 안 쓰이면 무시될 뿐이지만, 안 보냈다가 필수면 C101 로 튕긴다 → 보내는 쪽을 택한다.
   */
  deviceId: string;
}

/** 탈퇴 사유 항목 DTO */
export interface WithdrawalReasonDTO {
  reasonNo: number;
  reasonNm: string;
  essentialYn: string;
  useAt: string;
  sort: number;
}

/** 회원 탈퇴 요청 DTO */
export interface WithdrawRequestDTO {
  reasonNo: number;
  withdrawReason?: string;
}
