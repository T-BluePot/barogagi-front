import { Outlet } from "react-router-dom";
import BottomTabBar from "../common/tab-bar/BottomTabBar";
import CreateScheduleActionButton from "../common/fab/CreateScheduleActionButton";

const TabBarLayout = () => {
  return (
    <div className="min-h-0 flex flex-col h-full">
      {/* 페이지 콘텐츠 (플로팅 탭바 높이 68px + bottom 24px 만큼 하단 여백 확보) */}
      <main className="flex-1 min-h-0 pb-[calc(92px+max(env(safe-area-inset-bottom,0px),var(--sai-bottom,0px)))]">
        <Outlet />
      </main>
      {/* 새 일정 생성 플로팅 액션 버튼 (탭바 위 오른쪽) */}
      <CreateScheduleActionButton />
      {/* 하단 탭 바 */}
      <BottomTabBar />
    </div>
  );
};

export default TabBarLayout;
