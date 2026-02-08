/**
 * 회원(Auth) 관련 API 요청 함수
 */

import { http } from "../http";
import { ENDPOINTS } from "../endpoints";
import { getApiKey } from "../apiKey";

// === request body type ===
import type {
  BaseResponse,
  LoginDTO,
  JoinRequestType,
  MemberRequestDTO,
  RefreshTokenRequestDTO,
  ApprovalSendRequestType,
  ApprovalCompleteRequestType,
  FindUserResponseType,
  PasswordResetConfirmDTO,
} from "../types";

// === data type ===
import type { VerifyCodeType } from "@/types/signupTypes";
import type { SignupPayloadType } from "@/types/signupTypes";
import type { VerificationType } from "@/constants/verificationTypes";

/** 로그인 */
export const login = async (data: LoginDTO) => {
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.AUTH.LOGIN,
    data
  );
  return response.data;
};

/** 로그아웃 */
export const logout = async (data: RefreshTokenRequestDTO) => {
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.AUTH.LOGOUT,
    data
  );
  return response.data;
};

/** 토큰 재발급 */
export const refresh = async (data: RefreshTokenRequestDTO) => {
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.AUTH.REFRESH,
    data
  );
  return response.data;
};

/** 회원가입 */
export const signup = async (data: SignupPayloadType) => {
  const payload: JoinRequestType = {
    apiSecretKey: getApiKey(),
    userId: data.userId,
    password: data.password,
    tel: data.tel,
    nickName: data.nickName,

    ...(data.email ? { email: data.email } : {}),
    ...(data.birth ? { birth: data.birth } : {}),
    ...(data.gender ? { gender: data.gender } : {}),
  };

  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.USERS.SIGNUP,
    payload
  );
  return response.data;
};

/** 아이디 중복 체크 */
export const checkId = async (userId: string) => {
  const response = await http.get<BaseResponse<unknown>>(
    ENDPOINTS.USERS.CHECK_ID,
    {
      params: { userId },
      headers: {
        "API-KEY": getApiKey(),
      },
    }
  );
  return response.data;
};

/** 닉네임 중복 체크 */
export const checkNickname = async (nickname: string) => {
  const response = await http.get<BaseResponse<unknown>>(
    ENDPOINTS.USERS.CHECK_NICKNAME,
    {
      params: { nickname },
      headers: {
        "API-KEY": getApiKey(),
      },
    }
  );
  return response.data;
};

/** 인증번호 발송 */
export const sendVerification = async (
  tel: string,
  type?: VerificationType
) => {
  const payload: ApprovalSendRequestType = {
    apiSecretKey: getApiKey(),
    tel,
    ...(type ? { type } : {}), // type이 있을 때만 전송
  };
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.VERIFICATION.SEND,
    payload
  );

  return response.data;
};

/** 인증번호 확인 */
export const verifyVerification = async (
  input: VerifyCodeType,
  type?: VerificationType
) => {
  const payload: ApprovalCompleteRequestType = {
    tel: input.tel,
    authCode: input.authCode,
    apiSecretKey: getApiKey(),
    ...(type ? { type } : {}),
  };

  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.VERIFICATION.VERIFY,
    payload
  );

  return response.data;
};

/** 아이디 찾기 */
export const findUser = async (tel: string) => {
  const response = await http.post<BaseResponse<FindUserResponseType>>(
    ENDPOINTS.AUTH.FIND_ID,
    null,
    {
      params: { tel },
      headers: {
        "API-KEY": getApiKey(),
      },
    }
  );
  return response.data;
};

/** 내 정보 조회 */
export const getMe = async () => {
  const response = await http.get<BaseResponse<unknown>>(
    ENDPOINTS.MEMBERS.GET_ME
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

/** 아이디 찾기 */
export const findUser = async (tel: string) => {
  const response = await http.post<BaseResponse<FindUserResponseType>>(
    ENDPOINTS.AUTH.FIND_ID,
    null,
    {
      params: { tel },
      headers: {
        "API-KEY": getApiKey(),
      },
    }
  );
  return response.data;
};

/** 비밀번호 재설정 */
export const resetPassword = async (userId: string, password: string) => {
  const payload: PasswordResetConfirmDTO = {
    apiSecretKey: getApiKey(),
    userId,
    password,
  };
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.AUTH.RESET_PW_CONFIRM,
    payload
  );
  return response.data;
};
