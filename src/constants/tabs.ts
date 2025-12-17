import { ROUTES } from "./routes";

export const TAB_CONFIG = {
  plan: { path: ROUTES.TABS.PLAN, ariaLabel: "일정" },
  home: { path: ROUTES.TABS.MAIN, ariaLabel: "홈" },
  my: { path: ROUTES.TABS.USER, ariaLabel: "내 정보" },
} as const;

export type TabVariant = keyof typeof TAB_CONFIG;
