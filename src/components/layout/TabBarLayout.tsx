import { Outlet } from "react-router-dom";
import BottomTabBar from "../common/tab-bar/BottomTabBar";
import CreateScheduleActionButton from "../common/fab/CreateScheduleActionButton";

const TabBarLayout = () => {
  return (
    <div className="min-h-0 flex flex-col h-full">
      {/* 페이지 콘텐츠 하단 여백 = 탭바 높이 + 하단 간격 + 콘텐츠~바 사이 24px (탭바 치수는 globals.css --tabbar-*) */}
      <main className="flex-1 min-h-0 pb-[calc(var(--tabbar-height)+var(--tabbar-bottom)+24px+max(env(safe-area-inset-bottom,0px),var(--sai-bottom,0px)))]">
        <Outlet />
      </main>
      {/* 탭바·FAB 뒤에 깔리는 스크림 — 위는 투명, 아래로 갈수록 흰 배경.
          z-20 으로 플로팅 UI(z-30) 아래에 두고, 스크롤·탭을 가로막지 않도록 pointer-events 를 끈다. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[var(--app-max-width)] bottom-scrim h-[calc(var(--tabbar-scrim-height)+max(env(safe-area-inset-bottom,0px),var(--sai-bottom,0px)))]"
      />
      {/* 새 일정 생성 플로팅 액션 버튼 (탭바 위 오른쪽) */}
      <CreateScheduleActionButton />
      {/* 하단 탭 바 */}
      <BottomTabBar />
    </div>
  );
};

export default TabBarLayout;
