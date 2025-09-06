import { useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

type HeaderType = "none" | "back" | "title" | "close" | "common";

interface HeaderConfig {
  type: HeaderType;
  label?: string;
  isDarkBg?: boolean;
  rightAction?: () => void;
  rightIcon?: React.ReactNode;
}

// 라우트별 헤더 설정
const HEADER_CONFIG: Record<string, HeaderConfig> = {
  // Auth 관련 라우트들
  [ROUTES.HOME]: { type: "none", isDarkBg: true }, // 랜딩 페이지는 헤더 없음
  [ROUTES.AUTH.SIGNIN]: {
    type: "back",
    label: "로그인",
    isDarkBg: true,
  },
  [ROUTES.AUTH.SIGNUP]: {
    type: "back",
    label: "회원가입",
    isDarkBg: true,
  },
  [ROUTES.AUTH.SIGNUP_TERMS]: {
    type: "title",
    label: "약관 동의",
    isDarkBg: true,
  },

  // 메인 앱 라우트들
  [ROUTES.MAIN.HOME]: {
    type: "title",
    label: "바로가기",
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
  isDarkBg: false,
};

export const useHeaderConfig = () => {
  const location = useLocation();

  // 현재 경로에 맞는 헤더 설정 가져오기
  const getHeaderConfig = (): HeaderConfig => {
    // 정확한 경로 매칭
    const exactMatch = HEADER_CONFIG[location.pathname];
    if (exactMatch) return exactMatch;

    // 동적 라우트 매칭 (예: /user/:id)
    const dynamicMatch = Object.keys(HEADER_CONFIG).find((route) => {
      if (route.includes(":")) {
        const routePattern = route.replace(/:[^/]+/g, "[^/]+");
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(location.pathname);
      }
      return false;
    });

    if (dynamicMatch) return HEADER_CONFIG[dynamicMatch];

    // 기본값 반환
    return DEFAULT_HEADER_CONFIG;
  };

  return getHeaderConfig();
};

// 헤더 설정을 동적으로 업데이트하는 Hook
export const useUpdateHeaderConfig = () => {
  const updateConfig = (path: string, config: HeaderConfig) => {
    HEADER_CONFIG[path] = config;
  };

  return updateConfig;
};
