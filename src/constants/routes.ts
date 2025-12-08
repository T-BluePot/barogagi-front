// 라우트 경로 상수
const MAIN_BASE = "/home" as const;
const PLAN_BASE = "/plan" as const;
const USER_BASE = "/user" as const;

export const ROUTES = {
  ROOT: "/", // Landing page (전역 홈)
  // Auth 관련

  AUTH: {
    SIGNIN: "/login",
    SIGNUP: {
      TERMS: "/signup",
      CREDENTIALS: "/signup/credentials",
      VERIFY: "/verify/signup-verify",
      PROFILE: "/signup/profile",
      COMPLETE: "/signup/complete",
    },
    FIND_ACCOUNT: "/find",
  },

  // 메인: 탭 관리
  TABS: {
    MAIN: MAIN_BASE,
    PLAN: PLAN_BASE,
    USER: USER_BASE,
  },

  MAIN: {
    HOME: MAIN_BASE,
    PROFILE: "/profile",
    SETTINGS: "/settings",
    CHAT: "/chat",
    NOTIFICATION: "/notification",
  },

  PLAN: {
    LIST: PLAN_BASE, // 일정 리스트 메인
    DATE: "/plan/date", // 날짜 선택
    LOCATION: "/plan/location", // 지역 선택
    TRAVEL_STYLE: "/plan/travelStyle", // 여행 스타일 선택
    CREATE: "/plan/create", // 추천 루트 완료
    DETAIL: "/plan/:id/detail", // 루트 상세 페이지
    SEARCH: "/plan/search", // 장소 검색 페이지
  },

  // 추가 기능들
  USER: {
    BASE: USER_BASE,
    DETAIL: "/user/:id", // 동적 라우트
  },
} as const;

// 라우트 경로를 문자열로 변환하는 유틸리티
export const getRoutePath = {
  auth: {
    signin: () => ROUTES.AUTH.SIGNIN,
    signup: {
      terms: () => ROUTES.AUTH.SIGNUP.TERMS,
      credentials: () => ROUTES.AUTH.SIGNUP.CREDENTIALS,
      verify: () => ROUTES.AUTH.SIGNUP.VERIFY,
      profile: () => ROUTES.AUTH.SIGNUP.PROFILE,
      complete: () => ROUTES.AUTH.SIGNUP.COMPLETE,
    },
    findAccount: () => ROUTES.AUTH.FIND_ACCOUNT,
  },
  main: {
    home: () => ROUTES.MAIN.HOME,
    profile: () => ROUTES.MAIN.PROFILE,
    settings: () => ROUTES.MAIN.SETTINGS,
    chat: () => ROUTES.MAIN.CHAT,
    notification: () => ROUTES.MAIN.NOTIFICATION,
  },
  plan: {
    list: () => ROUTES.PLAN.LIST,
    date: () => ROUTES.PLAN.DATE,
    location: () => ROUTES.PLAN.LOCATION,
    travelStyle: () => ROUTES.PLAN.TRAVEL_STYLE,
    create: () => ROUTES.PLAN.CREATE,
    detail: (id: string) =>
      ROUTES.PLAN.DETAIL.replace(":id", encodeURIComponent(id)),
    search: () => ROUTES.PLAN.SEARCH,
  },
  user: {
    detail: (id: string) =>
      ROUTES.USER.DETAIL.replace(":id", encodeURIComponent(id)),
  },
};

// 모든 라우트를 배열로 추출 (타입 체크용)
export const ALL_ROUTES = [
  ROUTES.ROOT,
  ROUTES.AUTH.SIGNIN,
  ROUTES.AUTH.SIGNUP.TERMS,
  ROUTES.AUTH.SIGNUP.CREDENTIALS,
  ROUTES.AUTH.SIGNUP.VERIFY,
  ROUTES.AUTH.SIGNUP.PROFILE,
  ROUTES.AUTH.SIGNUP.COMPLETE,
  // ROUTES.AUTH.SIGNUP_TERMS,
  ROUTES.MAIN.HOME,
  ROUTES.MAIN.PROFILE,
  ROUTES.MAIN.SETTINGS,
  ROUTES.MAIN.CHAT,
  ROUTES.MAIN.NOTIFICATION,
  // 일정 로직
  ROUTES.PLAN.LIST,
  ROUTES.PLAN.DATE,
  ROUTES.PLAN.LOCATION,
  ROUTES.PLAN.TRAVEL_STYLE,
  ROUTES.USER.DETAIL,
  ROUTES.PLAN.CREATE,
  ROUTES.PLAN.DETAIL,
  ROUTES.PLAN.SEARCH,
] as const;
