/**
 * 회원(Auth) 관련 API 타입 정의
 */

/** 사용자 정보 */
export interface User {
  id: number;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

/** 로그인 요청 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 로그인 응답 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
