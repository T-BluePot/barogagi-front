import { Outlet } from "react-router-dom";
import BottomTabBar from "../common/tab-bar/BottomTabBar";

const TabLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 페이지 콘텐츠 */}
      <main className="flex-1 pb-[60px]">
        <Outlet />
      </main>

      {/* 푸터(탭바) - 레이아웃 흐름에 포함되어 공간 차지 */}
      <footer>
        <BottomTabBar />
      </footer>
    </div>
  );
};

export default TabLayout;
