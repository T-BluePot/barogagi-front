/**
 * 회원(Auth) 관련 API 요청 함수
 */

import { http, apiKeyHttp, refreshHttp } from "../client";
import { ENDPOINTS } from "../endpoints";
import { getRefreshToken } from "@/lib/auth/tokenCache";

// === request body type ===
import type {
  BaseResponse,
  LoginRequestType,
  LoginResponseDataType,
  JoinRequestType,
  MemberRequestDTO,
  MemberResponseDTO,
  RefreshTokenRequestType,
  RefreshResponseDataType,
  ApprovalSendRequestType,
  ApprovalCompleteRequestType,
  FindUserResponseType,
  PasswordResetConfirmDTO,
  WithdrawalReasonDTO,
  WithdrawRequestDTO,
} from "../types";

// === data type ===
import type { VerifyCodeType } from "@/types/signupTypes";
import type { VerificationType } from "@/constants/verificationTypes";

/** OAuth 링크 조회 */
export type OAuthProviderType = "Google" | "Kakao" | "Naver";

export const getOAuthLink = async (type: OAuthProviderType) => {
  const environment = import.meta.env.PROD ? "PROD" : "LOCAL";
  const response = await apiKeyHttp.get<BaseResponse<string>>(
    ENDPOINTS.AUTH.OAUTH_LINK,
    { params: { environment, type } }
  );
  return response.data;
};

/** 로그인 */
export const login = async (userId: string, password: string) => {
  const payload: LoginRequestType = {
    userId,
    password,
  };
  const response = await apiKeyHttp.post<BaseResponse<LoginResponseDataType>>(
    ENDPOINTS.AUTH.LOGIN,
    payload
  );
  return response.data;
};

/** 로그아웃 */
export const logout = async (data: RefreshTokenRequestType) => {
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.AUTH.LOGOUT,
    data
  );
  return response.data;
};

/** 토큰 재발급 */
export const refresh = async (data: RefreshTokenRequestType) => {
  const refreshToken = data.refreshToken;

  if (!refreshToken) {
    throw new Error("refreshToken이 없습니다.");
  }

  const response = await refreshHttp.post<
    BaseResponse<RefreshResponseDataType>
  >(ENDPOINTS.AUTH.REFRESH, data, {
    headers: {
      "REFRESH-TOKEN": refreshToken, // 서버가 요구하는 필수 헤더
    },
  });

  return response.data;
};

/**
 * 회원가입
 *
 * 실패는 `handleSignupError` 가 `ErrorModal` 로 인라인 처리한다(ProfilePage).
 * 전역 승격되면 인라인 모달과 전체화면이 이중 노출되고, 오류 화면은 래치라
 * 앱 재실행 전까지 가입 플로우로 못 돌아온다. → 승격에서 제외한다.
 */
export const signup = async (payload: JoinRequestType) => {
  const response = await apiKeyHttp.post<BaseResponse<unknown>>(
    ENDPOINTS.USERS.SIGNUP,
    payload,
    { _skipGlobalError: true }
  );
  return response.data;
};

/**
 * 아이디 중복 체크
 *
 * 결과(중복/실패)를 `CheckResultModal` 로 인라인 안내한다(CredentialsPage).
 * → 전역 오류 화면 승격에서 제외한다.
 */
export const checkId = async (userId: string) => {
  const response = await apiKeyHttp.get<BaseResponse<unknown>>(
    ENDPOINTS.USERS.CHECK_ID,
    {
      params: { userId },
      _skipGlobalError: true,
    }
  );
  return response.data;
};

/**
 * 닉네임 중복 체크
 *
 * 결과(중복/실패)를 `CheckResultModal` 로 인라인 안내한다
 * (ProfilePage / OAuthProfilePage / ProfileEditPage 세 곳 모두 동일).
 * → 전역 오류 화면 승격에서 제외한다.
 */
export const checkNickname = async (nickname: string) => {
  const response = await apiKeyHttp.get<BaseResponse<unknown>>(
    ENDPOINTS.USERS.CHECK_NICKNAME,
    {
      params: { nickname },
      _skipGlobalError: true,
    }
  );
  return response.data;
};

/**
 * 인증번호 발송
 *
 * 실패를 호출 화면이 모달로 인라인 처리한다
 * (VerifyPage / IdFindContent / PwFindContent 세 곳 모두 동일).
 * → 전역 오류 화면 승격에서 제외한다.
 */
export const sendVerification = async (
  tel: string,
  type?: VerificationType
) => {
  const payload: ApprovalSendRequestType = {
    tel,
    ...(type ? { type } : {}), // type이 있을 때만 전송
  };
  const response = await apiKeyHttp.post<BaseResponse<unknown>>(
    ENDPOINTS.VERIFICATION.SEND,
    payload,
    { _skipGlobalError: true }
  );

  return response.data;
};

/**
 * 인증번호 확인
 *
 * 실패(코드 불일치·만료)를 `VerifyCodePage` 가 인라인 문구로 처리한다.
 * → 전역 오류 화면 승격에서 제외한다.
 */
export const verifyVerification = async (
  input: VerifyCodeType,
  type?: VerificationType
) => {
  const payload: ApprovalCompleteRequestType = {
    tel: input.tel,
    authCode: input.authCode,
    ...(type ? { type } : {}),
  };

  const response = await apiKeyHttp.post<BaseResponse<unknown>>(
    ENDPOINTS.VERIFICATION.VERIFY,
    payload,
    { _skipGlobalError: true }
  );

  return response.data;
};

/** 아이디 찾기 */
export const findUser = async (tel: string) => {
  const response = await apiKeyHttp.post<BaseResponse<FindUserResponseType>>(
    ENDPOINTS.AUTH.FIND_ID,
    null,
    {
      params: { tel },
    }
  );
  return response.data;
};

/**
 * 내 정보 조회
 *
 * 홈에서 인사 문구용 부가 정보로도 쓰인다(`HomePage`, `retry: false`).
 * 부가 정보 조회 실패가 홈 전체를 덮으면 안 되므로 전역 오류 화면 승격에서 제외한다.
 */
export const getMe = async () => {
  const response = await http.get<BaseResponse<MemberResponseDTO>>(
    ENDPOINTS.MEMBERS.GET_ME,
    { _skipGlobalError: true }
  );
  return response.data;
};

/** 내 정보 수정 */
export const updateMe = async (data: MemberRequestDTO) => {
  const response = await http.patch<BaseResponse<unknown>>(
    ENDPOINTS.MEMBERS.UPDATE_ME,
    data
  );
  return response.data;
};

/** 비밀번호 재설정 */
export const resetPassword = async (userId: string, password: string) => {
  const payload: PasswordResetConfirmDTO = {
    userId,
    password,
  };
  const response = await apiKeyHttp.post<BaseResponse<unknown>>(
    ENDPOINTS.AUTH.RESET_PW_CONFIRM,
    payload
  );
  return response.data;
};

/** 탈퇴 사유 목록 조회 */
export const getWithdrawalReasons = async () => {
  const response = await apiKeyHttp.get<BaseResponse<WithdrawalReasonDTO[]>>(
    ENDPOINTS.USERS.WITHDRAWAL_REASONS
  );
  return response.data;
};

/** 회원 탈퇴 */
export const withdrawMe = async (data: WithdrawRequestDTO) => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("refreshToken이 없습니다.");
  }

  const response = await http.delete<BaseResponse<unknown>>(
    ENDPOINTS.USERS.ME,
    {
      headers: {
        "REFRESH-TOKEN": refreshToken,
      },
      data,
    }
  );
  return response.data;
};
