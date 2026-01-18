/**
 * API 엔드포인트 URL 상수
 * 모든 API URL을 한 파일에서 관리합니다.
 * 그룹별로 객체로 묶어서 관리 (AUTH, PLAN 등)
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const ENDPOINTS = {
  /** 회원 인증 및 관리 */
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    LOGOUT: "/api/v1/auth/logout",
    REFRESH: "/api/v1/auth/token/refresh",
    FIND_ID: "/api/v1/auth/find-user",
    RESET_PW_CONFIRM: "/api/v1/auth/password-reset/confirm",
  },
  USERS: {
    SIGNUP: "/api/v1/users",
    CHECK_ID: "/api/v1/users/userid/exists",
    CHECK_NICKNAME: "/api/v1/users/nickname/exists",
    ME: "/api/v1/users/me", // 회원 탈퇴
  },
  MEMBERS: {
    GET_ME: "/api/v1/members", // 회원 정보 조회
    UPDATE_ME: "/api/v1/members", // 회원 정보 수정
  },

  /** 일정 (Schedule) */
  SCHEDULE: {
    LIST: "/api/v1/schedule/list",
    DETAIL: "/api/v1/schedule/detail", // Query param: scheduleNum
    CREATE: "/api/v1/schedule/create", // 일정 생성 (등록 전)
    SAVE: "/api/v1/schedule/save", // 일정 저장 (최종 등록)
    UPDATE: "/api/v1/schedule", // PUT
    DELETE: "/api/v1/schedule", // DELETE
  },

  /** 메인 홈 */
  HOME: {
    POPULAR_TAGS: "/api/v1/home/tags/popular",
    POPULAR_REGIONS: "/api/v1/home/regions/popular",
    MY_SCHEDULES: "/api/v1/home/me/schedules",
  },

  /** 기타 (태그, 지역, 인증, 약관) */
  TAG: {
    SEARCH: "/api/v1/tag/search-list",
  },
  REGION: {
    SEARCH: "/api/v1/region/search-list",
    GEOCODE: "/api/v1/region/geocode",
  },
  VERIFICATION: {
    SEND: "/api/v1/verification-codes/send",
    VERIFY: "/api/v1/verification-codes/verify",
  },
  TERMS: {
    LIST: "/api/v1/terms",
    AGREE: "/api/v1/terms/terms-agreements",
  },
  PLACE: {
    SEARCH: "/api/v1/place/keyword-search",
  },
} as const;
