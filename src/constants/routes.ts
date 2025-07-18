// 라우트 경로 상수
export const ROUTES = {
  // Auth 관련
  HOME: "/",
  AUTH: {
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
    SIGNUP_TERMS: "/auth/signup/terms",
  },

  // 메인 앱
  MAIN: {
    HOME: "/home",
    PROFILE: "/profile",
    SETTINGS: "/settings",
    CHAT: "/chat",
    NOTIFICATION: "/notification",
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
  },
  main: {
    home: () => ROUTES.MAIN.HOME,
    profile: () => ROUTES.MAIN.PROFILE,
    settings: () => ROUTES.MAIN.SETTINGS,
    chat: () => ROUTES.MAIN.CHAT,
    notification: () => ROUTES.MAIN.NOTIFICATION,
  },
  user: {
    detail: (id: string) => ROUTES.USER.DETAIL.replace(":id", id),
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
  ROUTES.USER.DETAIL,
] as const;
