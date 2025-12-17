import { NavLink } from "react-router-dom";

import { TabItem } from "./TabItem";
import { TAB_CONFIG, type TabVariant } from "@/constants/tabs";

const BottomTabBar = () => {
  const tabs = Object.keys(TAB_CONFIG) as TabVariant[];
  return (
    <nav aria-label="Tabs" className="fixed bottom-0 left-0 right-0 z-30">
      <ul className="flex w-full h-[60px] justify-around items-center rounded-t-[40px] bg-gray-black shadow-[0_-8px_20px_rgba(0,0,0,0.12)]">
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
    </nav>
  );
};

export default BottomTabBar;
