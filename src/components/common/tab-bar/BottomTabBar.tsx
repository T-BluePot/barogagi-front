import { NavLink } from "react-router-dom";

import { TabItem } from "./TabItem";
import { TAB_CONFIG, type TabVariant } from "@/constants/tabs";

/**
 * 플로팅 글라스(frosted) 하단 탭바
 * - DESIGN.md 지오메트리: 좌우 16px, bottom 24px(+safe-area), 높이 68px, pill
 * - 글라스모피즘은 DESIGN-apple.md 참조: 반투명 화이트 + blur(20px) saturate(180%)
 *   + 상단 1px 화이트 하이라이트 (사용자 요청으로 DESIGN.md frosted blur 금지의 예외)
 * - 탭은 flex:1 균등 분배, 활성 표시는 컬러 변화만 (TabItem 담당)
 */
const BottomTabBar = () => {
  const tabs = Object.keys(TAB_CONFIG) as TabVariant[];
  return (
    <nav
      aria-label="Tabs"
      className="fixed inset-x-0 mx-auto w-[calc(100%-32px)] max-w-[calc(var(--app-max-width)-32px)] bottom-[calc(var(--tabbar-bottom)+max(env(safe-area-inset-bottom,0px),var(--sai-bottom,0px)))] z-30 h-[var(--tabbar-height)] rounded-full bg-white/75 px-2 backdrop-blur-[20px] backdrop-saturate-[1.8] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_12px_32px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.04)]"
    >
      <ul className="flex h-full items-center">
        {tabs.map((tab) => {
          const { path, ariaLabel } = TAB_CONFIG[tab];
          return (
            <li key={path} className="flex-1">
              <NavLink
                to={path}
                aria-label={ariaLabel}
                className="flex justify-center"
              >
                {({ isActive }) => <TabItem variant={tab} isActive={isActive} />}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomTabBar;
