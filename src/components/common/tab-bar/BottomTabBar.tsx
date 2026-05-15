import { NavLink } from "react-router-dom";

import { TabItem } from "./TabItem";
import { TAB_CONFIG, type TabVariant } from "@/constants/tabs";

const BottomTabBar = () => {
  const tabs = Object.keys(TAB_CONFIG) as TabVariant[];
  return (
    <nav
      aria-label="Tabs"
      className="fixed bottom-0 left-0 right-0 z-30"
    >
      {/* 배경/모서리/그림자는 wrapper가 담당. nav 자체엔 배경 없음(콘텐츠 안 가림).
          safe-area 영역도 wrapper 배경(검정)으로 자연스럽게 이어지도록 안쪽에 pb-safe spacer */}
      <div className="rounded-t-[40px] bg-gray-black shadow-[0_-8px_20px_rgba(0,0,0,0.12)]">
        <ul className="flex w-full h-[60px] justify-around items-center">
          {tabs.map((tab) => {
            const { path, ariaLabel } = TAB_CONFIG[tab];
            return (
              <li key={path} className="flex-1">
                <NavLink
                  to={path}
                  aria-label={ariaLabel}
                  className="flex justify-center"
                >
                  {({ isActive }) => (
                    <TabItem variant={tab} isActive={isActive} />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="pb-safe" />
      </div>
    </nav>
  );
};

export default BottomTabBar;
