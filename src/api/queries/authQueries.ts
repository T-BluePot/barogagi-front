/**
 * 회원(Auth) 관련 API 요청 함수
 */

import { http, apiKeyHttp, refreshHttp } from "../client";
import { ENDPOINTS } from "../endpoints";
import { getRefreshToken } from "@/lib/auth/tokenCache";
import { getDeviceId } from "@/utils/deviceId";

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

/**
 * 로그인
 *
 * `deviceId` 는 인자로 받지 않고 여기서 직접 조회한다.
 * 호출부마다 챙기게 하면 한 곳만 빠뜨려도 서버가 400(C101)으로 튕기므로,
 * 요청을 만드는 이 지점에서 한 번만 주입한다. (`getDeviceId()` 는 결과가 캐시된다)
 */
export const login = async (userId: string, password: string) => {
  const payload: LoginRequestType = {
    userId,
    password,
    deviceId: await getDeviceId(),
  };
  const response = await apiKeyHttp.post<BaseResponse<LoginResponseDataType>>(
    ENDPOINTS.AUTH.LOGIN,
    payload
  );
  return response.data;
};

/**
 * 로그아웃 (현재 기기)
 *
 * 서버는 전달된 refreshToken 이 속한 `(membershipNo, deviceId)` 의 VALID 토큰들을
 * REVOKE 한다 — 즉 **이 기기의 세션만** 끊고 다른 기기 로그인은 유지된다.
 *
 * ⚠️ refreshToken 은 body 가 아니라 **`REFRESH-TOKEN` 헤더**로 보낸다.
 *    종전 구현은 body 로 보내고 있었고(호출하는 곳이 없어 드러나지 않았다),
 *    그대로 부르면 서버가 필수값 누락(C101)으로 거절한다. `refresh` / `withdrawMe` 와 동일 규약.
 *
 * 실패해도 로컬 세션 정리는 진행되어야 하므로 전역 오류 화면으로 승격하지 않는다.
 */
export const logout = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("refreshToken이 없습니다.");
  }

  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.AUTH.LOGOUT,
    null,
    {
      headers: {
        "REFRESH-TOKEN": refreshToken, // 서버가 요구하는 필수 헤더
      },
      _skipGlobalError: true,
    }
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

/**
 * 비밀번호 재설정
 *
 * `deviceId` 를 함께 보낸다 — 이 엔드포인트의 requestBody 가 로그인과 같은 `LoginDTO` 라서
 * 서버 검증상 필수값이다. 배경은 `PasswordResetConfirmDTO` 주석 참고.
 */
export const resetPassword = async (userId: string, password: string) => {
  const payload: PasswordResetConfirmDTO = {
    userId,
    password,
    deviceId: await getDeviceId(),
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
