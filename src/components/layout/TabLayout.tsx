import { Outlet } from "react-router-dom";
import BottomTabBar from "../common/tab-bar/BottomTabBar";

const TabLayout = () => {
  return (
    <div className="min-h-screen">
      {/* 페이지 콘텐츠 */}
      <main className="min-h-screen pb-[60px]">
        <Outlet />
      </main>
      {/* 하단 탭 바 */}
      <BottomTabBar />
    </div>
  );
};

export default TabLayout;
