/**
 * 회원(Auth) 관련 API 요청 함수
 */

import { http } from "../http";
import { ENDPOINTS } from "../endpoints";
import type {
  BaseResponse,
  LoginDTO,
  JoinRequestDTO,
  MemberRequestDTO,
  RefreshTokenRequestDTO,
  ApprovalSendRequestType,
  ApprovalCompleteRequestType,
} from "../types";
import type { VerifyCodeType } from "@/types/signupTypes";
import { VERIFICATION_REQUEST_TYPE } from "@/constants/verificationTypes";

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
export const signup = async (data: JoinRequestDTO) => {
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.USERS.SIGNUP,
    data
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
        "API-KEY": import.meta.env.VITE_API_KEY,
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
    }
  );
  return response.data;
};

/** 인증번호 발송 */
export const sendVerification = async (
  tel: string,
  type?: typeof VERIFICATION_REQUEST_TYPE.JOIN_MEMBERSHIP
) => {
  const payload: ApprovalSendRequestType = {
    apiSecretKey: import.meta.env.VITE_API_KEY,
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
  type?: typeof VERIFICATION_REQUEST_TYPE.JOIN_MEMBERSHIP
) => {
  const payload: ApprovalCompleteRequestType = {
    tel: input.tel,
    authCode: input.authCode,
    apiSecretKey: import.meta.env.VITE_API_KEY,
    ...(type ? { type } : {}),
  };

  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.VERIFICATION.VERIFY,
    payload
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
