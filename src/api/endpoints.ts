/**
 * API 엔드포인트 URL 상수
 * 모든 API URL을 한 파일에서 관리합니다.
 * 그룹별로 객체로 묶어서 관리 (AUTH, PLAN 등)
 */

/**
 * dev 서버에 **LAN IP 로 접속한 경우**(= 실기기 테스트)에만 Vite 프록시를 경유한다.
 *
 * 배경: API 서버의 CORS 허용 목록에는 `http://localhost:8080` 만 등록돼 있다.
 * 폰에서 `http://<PC IP>:8080` 으로 접속하면 Origin 이 달라져 모든 API 가 preflight 에서
 * 차단된다(`No 'Access-Control-Allow-Origin' header`). 백엔드에 IP 를 추가 등록하는 대신,
 * baseURL 을 비워 같은 출처(dev 서버)로 요청하고 `vite.config.ts` 의 `server.proxy` 가
 * 서버 대 서버로 중계하게 한다 — 브라우저 CORS 자체가 개입하지 않는다.
 *
 * ⚠️ localhost 접속과 운영 빌드는 종전 그대로 절대 URL 을 쓴다(동작 변경 없음).
 */
const shouldUseDevProxy = (): boolean => {
  if (!import.meta.env.DEV || typeof window === "undefined") return false;
  const { hostname } = window.location;
  return hostname !== "localhost" && hostname !== "127.0.0.1";
};

export const API_BASE_URL = shouldUseDevProxy()
  ? "" // 같은 출처로 요청 → vite server.proxy 가 중계
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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
    // 공공기관 지역코드 목록. 쿼리 `type` 필수이며 **`HOT-PLACE` 만 동작**한다(실측).
    // 스웨거 설명은 핫플레이스 전용처럼 적혀 있으나, 여기서 내려오는 areaCd/sigunguCd 가
    // 회원가입·회원정보수정의 선호 지역 필드에 그대로 들어가는 값이다.
    REGION_CODES: "/api/v1/home/regions/code",
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
    TOKEN: "/api/v1/push/token", // FCM 토큰 등록(POST) / 삭제(DELETE) — 같은 경로
  },

  /** 공지사항 (Board) — 알림 화면에서 노출 */
  BOARD: {
    // ⚠️ 스웨거에 `page` 쿼리가 있지만 넘기면 COMMON-500 이 난다(실측). 붙이지 말 것.
    LIST: "/api/v1/board/list",
    DETAIL: "/api/v1/board/detail", // Query param: boardNum
  },

  /** 앱 설정 (Settings) */
  SETTINGS: {
    LIST: "/api/v1/settings", // 설정 목록 조회
    // 설정 수정 (PATCH) - settingType, value 를 path 로 전달
    UPDATE: (settingType: string, value: string) =>
      `/api/v1/settings/${settingType}/${value}`,
  },
} as const;
