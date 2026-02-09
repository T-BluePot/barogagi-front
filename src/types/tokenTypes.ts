import type { LoginResponseDataType } from "@/api/types";

/**
 * 토큰 갱신에 필요한 최소 공통 필드 묶음
 * - login 응답 / refresh 응답 모두 이 형태로 매핑 가능
 */
export type AuthTokenBundle = Pick<
  LoginResponseDataType,
  | "accessToken"
  | "accessTokenExpiresIn"
  | "refreshToken"
  | "refreshTokenExpiresIn"
>;
