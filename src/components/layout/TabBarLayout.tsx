import { Outlet } from "react-router-dom";
import BottomTabBar from "../common/tab-bar/BottomTabBar";
import CreateScheduleActionButton from "../common/fab/CreateScheduleActionButton";

const TabBarLayout = () => {
  return (
    <div className="min-h-0 flex flex-col h-full">
      {/* 탭바 여백은 여기서 주지 않는다.
          main 의 padding 은 자식 배경 박스 **바깥**이라, 페이지 배경이 화면 아래끝까지
          못 가고 MainLayout 의 흰색이 드러난다(일정 목록 탭에서 회색/흰색 경계선으로 보였다).
          → 각 페이지의 스크롤 컨테이너가 .pb-tabbar 로 직접 여백을 갖는다. */}
      <main className="flex-1 min-h-0">
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
