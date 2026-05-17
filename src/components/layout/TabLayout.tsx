import { Outlet } from "react-router-dom";
import BottomTabBar from "../common/tab-bar/BottomTabBar";

const TabLayout = () => {
  return (
    <div className="min-h-0 flex flex-col h-full">
      {/* 페이지 콘텐츠 */}
      <main className="flex-1 min-h-0 pb-[calc(60px+max(env(safe-area-inset-bottom,0px),var(--sai-bottom,0px)))]">
        <Outlet />
      </main>
      {/* 하단 탭 바 */}
      <BottomTabBar />
    </div>
  );
};

export default TabLayout;
