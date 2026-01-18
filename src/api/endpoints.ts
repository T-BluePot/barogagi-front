/**
 * API 엔드포인트 URL 상수
 * 모든 API URL을 한 파일에서 관리합니다.
 * 그룹별로 객체로 묶어서 관리 (AUTH, PLAN 등)
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const ENDPOINTS = {
  /** 회원 인증 관련 엔드포인트 */
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  /** 일정 관련 엔드포인트 */
  PLAN: {
    LIST: "/plans",
    DETAIL: (id: number | string) => `/plans/${id}`,
    CREATE: "/plans",
    UPDATE: (id: number | string) => `/plans/${id}`,
    DELETE: (id: number | string) => `/plans/${id}`,
  },
} as const;
