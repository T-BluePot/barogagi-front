/**
 * 회원(Auth) 관련 API 요청 함수
 * http.ts의 axios 인스턴스와 endpoints.ts의 URL 상수를 사용합니다.
 */

import { http } from "../http";
import { ENDPOINTS } from "../endpoints";
import type { BaseResponse, LoginRequest, LoginResponse, User } from "../types";

/** 로그인 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post<BaseResponse<LoginResponse>>(
    ENDPOINTS.AUTH.LOGIN,
    data
  );
  return response.data.result;
};

/** 로그아웃 */
export const logout = async (): Promise<void> => {
  await http.post(ENDPOINTS.AUTH.LOGOUT);
};

/** 내 정보 조회 */
export const getMe = async (): Promise<User> => {
  const response = await http.get<BaseResponse<User>>(ENDPOINTS.AUTH.ME);
  return response.data.result;
};
