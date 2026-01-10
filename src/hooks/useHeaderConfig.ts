import { useLocation, matchPath } from "react-router-dom";
import {
  type HeaderConfig,
  SECTION_RULES,
  HEADER_CONFIG,
  DEFAULT_HEADER_CONFIG,
} from "@/constants/headerConfig";

// HeaderConfig 타입을 re-export하여 기존 import 호환성 유지
export type { HeaderConfig };

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
