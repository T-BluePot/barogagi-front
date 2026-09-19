import { ROUTES } from "@/constants/routes";

/**
 * 헤더 설정 타입
 * - none: 헤더 없음
 * - common: 기본 공통 헤더
 * - title: 타이틀만 있는 헤더
 * - close: 닫기 버튼이 있는 헤더
 * - back: 뒤로가기 버튼이 있는 헤더
 */
export type HeaderConfig =
  | { type: "none"; isHeaderDark?: boolean; isContentDark?: boolean }
  | {
      type: "common";
      rightPath?: string;
      isHeaderDark?: boolean;
      isContentDark?: boolean;
    }
  | {
      type: "title";
      label: string;
      isHeaderDark?: boolean;
      isContentDark?: boolean;
    }
  | {
      type: "close";
      label?: string;
      isHeaderDark?: boolean;
      isContentDark?: boolean;
      closePath?: string;
      showCloseConfirm?: boolean;
      confirmMessage?: string;
    }
  | {
      type: "back";
      label?: string;
      isHeaderDark?: boolean;
      isContentDark?: boolean;
      backPath?: string;
      showBackConfirm?: boolean;
      confirmMessage?: string;
    };

/**
 * 섹션별 공통 규칙 (예: /signup/*)
 * - pattern: 매칭할 경로 패턴
 * - config: 해당 패턴에 적용할 헤더 설정
 */
export const SECTION_RULES: Array<{ pattern: string; config: HeaderConfig }> = [
  {
    pattern: "/auth/signup/*", // /auth/signup으로 시작하는 모든 하위 경로
    config: {
      type: "back",
      label: "회원가입",
      isHeaderDark: false,
      backPath: ROUTES.AUTH.SIGNIN,
    },
  },
];

/**
 * 경로별 헤더 설정
 * - 각 라우트에 해당하는 헤더 타입과 옵션 정의
 */
export const HEADER_CONFIG: Record<string, HeaderConfig> = {
  // Auth 관련
  [ROUTES.ROOT]: { type: "none" }, // 랜딩 페이지는 헤더 없음
  [ROUTES.AUTH.LANDING]: { type: "none", isHeaderDark: false }, // Auth 랜딩 페이지도 헤더 없음, 라이트 배경
  [ROUTES.AUTH.SIGNIN]: {
    type: "back",
    label: "로그인",
    isHeaderDark: false,
    backPath: ROUTES.AUTH.LANDING, // Auth 랜딩 페이지로 이동
  },
  [ROUTES.AUTH.SIGNUP.TERMS]: {
    type: "back",
    label: "회원가입",
    isHeaderDark: false,
    backPath: ROUTES.AUTH.SIGNIN,
  },
  [ROUTES.AUTH.SIGNUP.CREDENTIALS]: {
    type: "back",
    label: "회원가입",
    isHeaderDark: false,
    showBackConfirm: true,
    backPath: ROUTES.AUTH.SIGNIN,
  },
  [ROUTES.AUTH.SIGNUP.VERIFY]: {
    type: "back",
    label: "회원가입",
    isHeaderDark: false,

    showBackConfirm: true,
    backPath: ROUTES.AUTH.SIGNIN,
  },
  [ROUTES.AUTH.SIGNUP.PROFILE]: {
    type: "back",
    label: "회원가입",
    isHeaderDark: false,

    showBackConfirm: true,
    backPath: ROUTES.AUTH.SIGNIN,
  },
  [ROUTES.AUTH.SIGNUP.COMPLETE]: { type: "none", isHeaderDark: false },
  [ROUTES.AUTH.OAUTH_CALLBACK]: { type: "none", isHeaderDark: false },
  [ROUTES.AUTH.OAUTH_PROFILE]: {
    type: "back",
    label: "프로필 설정",
    isHeaderDark: false,
    backPath: ROUTES.AUTH.LANDING,
  },
  // 인증 페이지들 (VERIFY는 객체이므로 개별 경로 사용)
  [ROUTES.AUTH.VERIFY.SIGNUP]: {
    type: "back",
    label: "회원가입",
    isHeaderDark: false,

    showBackConfirm: true,
    backPath: ROUTES.AUTH.SIGNUP.CREDENTIALS,
  },
  [ROUTES.AUTH.VERIFY.FIND_ID]: {
    type: "back",
    label: "아이디 찾기",
    isHeaderDark: false,
    backPath: ROUTES.AUTH.FIND_ACCOUNT,
  },
  [ROUTES.AUTH.VERIFY.RESET_PASSWORD]: {
    type: "back",
    label: "비밀번호 재설정",
    isHeaderDark: false,
    backPath: ROUTES.AUTH.FIND_ACCOUNT,
  },
  [ROUTES.AUTH.FIND_ACCOUNT]: {
    type: "back",
    label: "계정 찾기",
    isHeaderDark: false,
    backPath: ROUTES.AUTH.SIGNIN, // 로그인 페이지로 이동
  },
  [ROUTES.AUTH.FIND_RESET_PASSWORD]: {
    type: "back",
    label: "비밀번호 재설정",
    isHeaderDark: false,
    backPath: ROUTES.AUTH.FIND_ACCOUNT, // 계정 찾기 페이지로 이동
  },

  // Plan 관련
  [ROUTES.PLAN.LIST]: {
    type: "none",
  },
  [ROUTES.PLAN.DATE]: {
    type: "back",
    label: "날짜 선택",
    isHeaderDark: false,
    backPath: ROUTES.PLAN.LIST,
  },
  [ROUTES.PLAN.LOCATION]: {
    type: "back",
    label: "지역 선택",
    isHeaderDark: false,
    backPath: ROUTES.PLAN.DATE,
  },
  [ROUTES.PLAN.SETTING]: {
    type: "back",
    label: "일정 구성",
    isHeaderDark: false,
    backPath: ROUTES.PLAN.LOCATION,
  },
  [ROUTES.PLAN.STYLE]: {
    type: "back",
    label: "일정 스타일 선택",
    isHeaderDark: false,
    backPath: ROUTES.PLAN.SETTING,
  },

  [ROUTES.PLAN.CREATE]: {
    type: "close",
    label: "추천 루트",
    isHeaderDark: false,
    closePath: ROUTES.PLAN.LIST,
    showCloseConfirm: true,
    confirmMessage: "지금 나가면 생성된 일정이 모두 사라집니다.",
  },

  // 상세는 페이지가 직접 BackHeader(+kebab 메뉴)를 렌더하므로 앱 레이아웃 헤더는 없음
  [ROUTES.PLAN.DETAIL]: {
    type: "none",
    isHeaderDark: false,
  },
  [ROUTES.PLAN.SETTING_SEARCH]: { type: "none" },
  [ROUTES.PLAN.DETAIL_SEARCH]: { type: "none" },

  // 공유 뷰는 비로그인 방문자가 대상이므로 앱 레이아웃 헤더를 그리지 않는다.
  // 여기에 등록하지 않으면 기본값 type:"common" → CommonHeader → getMe() → 401 →
  // 인터셉터가 handleForcedLogout() → /auth/login 으로 하드 리다이렉트되어 일정을 볼 수 없다.
  [ROUTES.SHARE.VIEW]: { type: "none" },

  // 메인 앱 라우트들
  [ROUTES.MAIN.HOME]: {
    type: "common",
    isHeaderDark: false,
    isContentDark: false,
  },
  [ROUTES.MAIN.PROFILE]: {
    type: "title",
    label: "프로필",
    isHeaderDark: false,
  },
  [ROUTES.MAIN.PROFILE_EDIT]: {
    type: "back",
    label: "프로필 수정",
    isHeaderDark: false,
    backPath: ROUTES.MAIN.PROFILE,
  },
  [ROUTES.MAIN.SETTINGS]: {
    type: "back",
    label: "설정",
    isHeaderDark: false,
    backPath: ROUTES.MAIN.PROFILE,
  },
  [ROUTES.MAIN.CHAT]: {
    type: "title",
    label: "채팅",
    isHeaderDark: false,
  },
  [ROUTES.MAIN.NOTIFICATION]: {
    type: "back",
    label: "알림",
    isHeaderDark: false,
  },

  // 동적 라우트
  [ROUTES.USER.DETAIL]: {
    type: "back",
    label: "사용자 프로필",
    isHeaderDark: false,
  },
} as const;

/**
 * 기본 헤더 설정
 * - 매칭되는 설정이 없을 때 사용
 */
export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  type: "common",
};
