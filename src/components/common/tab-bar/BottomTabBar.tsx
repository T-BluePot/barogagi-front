import { NavLink } from "react-router-dom";

import { TabItem } from "./TabItem";
import { TAB_CONFIG, type TabVariant } from "@/constants/tabs";

/**
 * 플로팅 화이트 카드형 하단 탭바
 * - 좌우 16px, bottom 22px(+safe-area) 띄운 66px 카드, radius 26px
 * - 탭은 flex:1 균등 분배, 활성 표시는 컬러 변화만 (TabItem 담당)
 */
const BottomTabBar = () => {
  const tabs = Object.keys(TAB_CONFIG) as TabVariant[];
  return (
    <nav
      aria-label="Tabs"
      className="fixed left-4 right-4 bottom-[calc(22px+max(env(safe-area-inset-bottom,0px),var(--sai-bottom,0px)))] z-30 h-16.5 rounded-[26px] bg-white px-2 shadow-[0_14px_34px_rgba(28,28,30,0.12),0_0_0_1px_rgba(0,0,0,0.03)]"
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
