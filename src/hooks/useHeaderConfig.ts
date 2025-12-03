import { useLocation, matchPath } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

/*

type HeaderType = "none" | "back" | "title" | "close" | "common";

interface HeaderConfig {
  type: HeaderType;
  label?: string;
  isDarkBg?: boolean;
  backPath?: string; // 뒤로가기 경로 지정
  rightAction?: () => void;
  rightIcon?: React.ReactNode;
}

*/

export type HeaderConfig =
  | { type: "none" }
  | { type: "common"; rightPath?: string; isDarkBg?: boolean }
  | { type: "title"; label: string; isDarkBg?: boolean }
  | { type: "close"; label?: string; isDarkBg?: boolean; closePath?: string }
  | { type: "back"; label?: string; isDarkBg?: boolean; backPath?: string };

/** 라우트별 헤더 설정 */

// 섹션별 공통 규칙 (예: /signup/*)
const SECTION_RULES: Array<{ pattern: string; config: HeaderConfig }> = [
  {
    pattern: "/signup/*", // /signup으로 시작하는 모든 하위 경로
    config: {
      type: "back",
      label: "회원가입",
      isDarkBg: true,
      backPath: ROUTES.AUTH.SIGNIN,
    },
  },
];

// 경로에 따른 헤더 설정
const HEADER_CONFIG: Record<string, HeaderConfig> = {
  // Auth 관련
  [ROUTES.ROOT]: { type: "none" }, // 랜딩 페이지는 헤더 없음
  [ROUTES.AUTH.SIGNIN]: {
    type: "back",
    label: "로그인",
    isDarkBg: true,
    backPath: ROUTES.ROOT, // 홈(랜딩) 페이지로 이동
  },
  [ROUTES.AUTH.SIGNUP.COMPLETE]: { type: "none" },
  [ROUTES.AUTH.FIND_ACCOUNT]: {
    type: "back",
    label: "계정 찾기",
    isDarkBg: true,
    backPath: ROUTES.AUTH.SIGNIN, // 로그인 페이지로 이동
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
  [ROUTES.PLAN.TRAVEL_STYLE]: {
    type: "back",
    label: "여행 스타일 선택",
    isDarkBg: false,
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

// 기본 헤더 설정
const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  type: "common",
};

export const useHeaderConfig = () => {
  const location = useLocation();

  // 현재 경로에 맞는 헤더 설정 가져오기
  const getHeaderConfig = (): HeaderConfig => {
    // 1. 정확한 경로 매칭
    const exactMatch = HEADER_CONFIG[location.pathname];
    if (exactMatch) return exactMatch;

    // 2. 동적 라우트 매칭 (예: /user/:id)
    const dynamicMatch = Object.keys(HEADER_CONFIG).find((route) => {
      if (route.includes(":")) {
        const routePattern = route.replace(/:[^/]+/g, "[^/]+");
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(location.pathname);
      }
      return false;
    });

    if (dynamicMatch) return HEADER_CONFIG[dynamicMatch];

    // 3. 섹션 규칙 매칭 (예: /signup/*)
    for (const rule of SECTION_RULES) {
      // end:false 로 하위 경로까지 포괄
      if (matchPath({ path: rule.pattern, end: false }, location.pathname)) {
        return rule.config;
      }
    }

    // 기본값 반환
    return DEFAULT_HEADER_CONFIG;
  };

  return getHeaderConfig();
};

/* 
- 헤더 설정을 동적으로 업데이트하는 Hook
> 현재 문제: HEADER_CONFIG의 타입이 as const로 고정되어 있어(읽기 전용) 업데이트 불가
            해당 코드에 대한 필요성이 있는지 검토 필요

export const useUpdateHeaderConfig = () => {
  const updateConfig = (path: string, config: HeaderConfig) => {
    HEADER_CONFIG[path] = config;
  };

  return updateConfig;
};

> 런타임 오버라이드 훅으로 변경 필요
*/
