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
    OAUTH_LINK: "/api/v1/oauth-link",
  },
  USERS: {
    SIGNUP: "/api/v1/users",
    CHECK_ID: "/api/v1/users/userid/exists",
    CHECK_NICKNAME: "/api/v1/users/nickname/exists",
    CHECK_TEL: "/api/v1/users/tel/exists",
    ME: "/api/v1/users/me", // 회원 탈퇴
    WITHDRAWAL_REASONS: "/api/v1/withdrawal-reasons", // 탈퇴 사유 목록 조회
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
    UPDATE: "/api/v1/schedule/", // PUT
    DELETE: "/api/v1/schedule/", // DELETE
    IMAGE_PROXY: "/api/v1/schedule/image/proxy",
    // 공유 링크 생성 (POST) - scheduleNum 을 path 로 전달. 로그인 토큰 필요
    SHARE: (scheduleNum: number) => `/api/v1/schedule/${scheduleNum}/share`,
    // 공유 일정 조회 (GET) - shareToken 을 path 로 전달. API-KEY만으로 비로그인 조회 가능
    SHARED: (shareToken: string) => `/api/v1/schedule/share/${shareToken}`,
  },

  /** 메인 홈 */
  HOME: {
    POPULAR_TAGS: "/api/v1/home/tags/popular",
    POPULAR_REGIONS: "/api/v1/home/regions/popular",
    HOT_PLACE: "/api/v1/home/regions/hot-place", // 오늘의 핫플레이스 (한국관광공사 데이터)
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

  /** 카테고리 (Category) */
  CATEGORY: {
    LIST: "/api/v1/category/",
  },

  /** 아이템 (Item) - 카테고리 상세 */
  ITEM: {
    LIST: "/api/v1/item/",
  },

  /** 푸시 알림 (Push) */
  PUSH: {
    TOKEN: "/api/v1/push/token", // FCM 토큰 등록
  },

  /** 앱 설정 (Settings) */
  SETTINGS: {
    LIST: "/api/v1/settings", // 설정 목록 조회
    // 설정 수정 (PATCH) - settingType, value 를 path 로 전달
    UPDATE: (settingType: string, value: string) =>
      `/api/v1/settings/${settingType}/${value}`,
  },
} as const;
