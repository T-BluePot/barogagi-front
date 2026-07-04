import { ROUTES } from "./routes";

// key 순서가 탭바 노출 순서 (홈 → 일정 → 마이)
export const TAB_CONFIG = {
  home: { path: ROUTES.TABS.MAIN, label: "홈", ariaLabel: "홈" },
  plan: { path: ROUTES.TABS.PLAN, label: "일정", ariaLabel: "일정" },
  my: { path: ROUTES.TABS.USER, label: "마이", ariaLabel: "내 정보" },
} as const;

export type TabVariant = keyof typeof TAB_CONFIG;
