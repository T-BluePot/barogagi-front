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
  | { type: "none"; isDarkBg?: boolean }
  | { type: "common"; rightPath?: string; isDarkBg?: boolean }
  | { type: "title"; label: string; isDarkBg?: boolean }
  | { type: "close"; label?: string; isDarkBg?: boolean; closePath?: string }
  | { type: "back"; label?: string; isDarkBg?: boolean; backPath?: string };

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
      isDarkBg: true,
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
  [ROUTES.AUTH.LANDING]: { type: "none", isDarkBg: true }, // Auth 랜딩 페이지도 헤더 없음, 다크 배경
  [ROUTES.AUTH.SIGNIN]: {
    type: "back",
    label: "로그인",
    isDarkBg: true,
    backPath: ROUTES.AUTH.LANDING, // Auth 랜딩 페이지로 이동
  },
  [ROUTES.AUTH.SIGNUP.VERIFY]: {
    type: "back",
    label: "회원가입",
    isDarkBg: true,
    backPath: ROUTES.AUTH.SIGNUP.CREDENTIALS,
  },
  [ROUTES.AUTH.SIGNUP.COMPLETE]: { type: "none", isDarkBg: true },
  // 인증 페이지들 (VERIFY는 객체이므로 개별 경로 사용)
  [ROUTES.AUTH.VERIFY.SIGNUP]: {
    type: "back",
    label: "회원가입",
    isDarkBg: true,
    backPath: ROUTES.AUTH.SIGNUP.CREDENTIALS,
  },
  [ROUTES.AUTH.VERIFY.FIND_ID]: {
    type: "back",
    label: "아이디 찾기",
    isDarkBg: true,
    backPath: ROUTES.AUTH.FIND_ACCOUNT,
  },
  [ROUTES.AUTH.VERIFY.RESET_PASSWORD]: {
    type: "back",
    label: "비밀번호 재설정",
    isDarkBg: true,
    backPath: ROUTES.AUTH.FIND_ACCOUNT,
  },
  [ROUTES.AUTH.FIND_ACCOUNT]: {
    type: "back",
    label: "계정 찾기",
    isDarkBg: true,
    backPath: ROUTES.AUTH.SIGNIN, // 로그인 페이지로 이동
  },
  [ROUTES.AUTH.FIND_RESET_PASSWORD]: {
    type: "back",
    label: "비밀번호 재설정",
    isDarkBg: true,
    backPath: ROUTES.AUTH.FIND_ACCOUNT, // 비밀번호 재설정 페이지로 이동
  },

  // Plan 관련
  [ROUTES.PLAN.LIST]: {
    type: "none",
  },
  [ROUTES.PLAN.DATE]: {
    type: "back",
    label: "날짜 선택",
    isDarkBg: false,
    backPath: ROUTES.PLAN.LIST,
  },
  [ROUTES.PLAN.LOCATION]: {
    type: "back",
    label: "지역 선택",
    isDarkBg: false,
    backPath: ROUTES.PLAN.DATE,
  },
  [ROUTES.PLAN.STYLE]: {
    type: "back",
    label: "일정 스타일 선택",
    isDarkBg: false,
  },
  [ROUTES.PLAN.SETTING]: {
    type: "back",
    label: "일정 구성",
    isDarkBg: false,
    backPath: ROUTES.PLAN.STYLE,
  },
  [ROUTES.PLAN.CREATE]: {
    type: "title",
    label: "추천 루트",
    isDarkBg: false,
  },
  [ROUTES.PLAN.DETAIL]: {
    type: "back",
    isDarkBg: false,
  },
  [ROUTES.PLAN.SEARCH]: {
    type: "none",
  },

  // 메인 앱 라우트들
  [ROUTES.MAIN.HOME]: {
    type: "common",
    isDarkBg: true,
  },
  [ROUTES.MAIN.PROFILE]: {
    type: "back",
    label: "프로필",
  },
  [ROUTES.MAIN.SETTINGS]: {
    type: "back",
    label: "설정",
  },
  [ROUTES.MAIN.CHAT]: {
    type: "title",
    label: "채팅",
    isDarkBg: false,
  },
  [ROUTES.MAIN.NOTIFICATION]: {
    type: "back",
    label: "알림",
    isDarkBg: false,
  },

  // 동적 라우트
  [ROUTES.USER.DETAIL]: {
    type: "back",
    label: "사용자 프로필",
    isDarkBg: false,
  },
} as const;

/**
 * 기본 헤더 설정
 * - 매칭되는 설정이 없을 때 사용
 */
export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  type: "common",
};
