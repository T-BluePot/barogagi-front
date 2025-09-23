// 라우트 경로 상수
export const ROUTES = {
  // Auth 관련
  HOME: "/",
  AUTH: {
    SIGNIN: "/login",
    SIGNUP: "/signup",
    SIGNUP_TERMS: "/signup/terms",

    FIND_ACCOUNT: "/find",
  },

  // 메인 앱
  MAIN: {
    HOME: "/home",
    PROFILE: "/profile",
    SETTINGS: "/settings",
    CHAT: "/chat",
    NOTIFICATION: "/notification",
  },

  PLAN: {
    LIST: "/plan", // 일정 리스트 메인
    DATE: "/plan/date", // 날짜 선택
    LOCATION: "/plan/location", // 지역 선택
    TRAVEL_STYLE: "/plan/travelStyle", // 여행 스타일 선택
  },

  // 추가 기능들
  USER: {
    DETAIL: "/user/:id", // 동적 라우트
  },
} as const;

// 라우트 경로를 문자열로 변환하는 유틸리티
export const getRoutePath = {
  auth: {
    signin: () => ROUTES.AUTH.SIGNIN,
    signup: () => ROUTES.AUTH.SIGNUP,
    signupTerms: () => ROUTES.AUTH.SIGNUP_TERMS,
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
  },
  user: {
    detail: (id: string) =>
      ROUTES.USER.DETAIL.replace(":id", encodeURIComponent(id)),
  },
};

// 모든 라우트를 배열로 추출 (타입 체크용)
export const ALL_ROUTES = [
  ROUTES.HOME,
  ROUTES.AUTH.SIGNIN,
  ROUTES.AUTH.SIGNUP,
  ROUTES.AUTH.SIGNUP_TERMS,
  ROUTES.MAIN.HOME,
  ROUTES.MAIN.PROFILE,
  ROUTES.MAIN.SETTINGS,
  ROUTES.MAIN.CHAT,
  ROUTES.MAIN.NOTIFICATION,
  ROUTES.PLAN.LIST,
  ROUTES.PLAN.DATE,
  ROUTES.PLAN.LOCATION,
  ROUTES.PLAN.TRAVEL_STYLE,
  ROUTES.USER.DETAIL,
] as const;
