import { RootRedirect } from "./routes/RootRedirect";
import { AuthRoutes } from "@/routes/AuthRoutes";
import { MainRoutes } from "@/routes/MainRoutes";
import SharedSchedulePage from "@/pages/share/SharedSchedulePage";
import { ROUTES } from "@/constants/routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import GlobalAlertModal from "@/components/common/modal/GlobalAlertModal";
import GlobalConfirmModal from "@/components/common/modal/GlobalConfirmModal";
import GlobalLoading from "@/components/common/loading/GlobalLoading";
import GlobalErrorScreen from "@/components/common/error/GlobalErrorScreen";
import { useFcmForegroundMessage } from "@/hooks/useFcmForegroundMessage";
import { useFcmRegistrationResync } from "@/hooks/useFcmRegistrationResync";
import { useAppUpdateCheck } from "@/hooks/useAppUpdateCheck";

function App() {
  // 포그라운드 FCM 메시지를 toast로 표시 (앱 생애 1회 구독)
  useFcmForegroundMessage();
  // FCM 토큰 갱신 감지 — 부팅 시·포그라운드 복귀 시 서버 등록과 대조해 재등록
  useFcmRegistrationResync();
  // 앱 버전 체크 (앱 생애 1회). 라우터 의존이 없어 BrowserRouter 바깥에서 호출해도 무해하다
  useAppUpdateCheck();

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          {/* 공유 링크 공개 뷰: 비로그인 접근이므로 PrivateRoute(MainRoutes) 밖에 둔다.
              단 MainLayout은 Routes 바깥이라 이 경로도 통과하므로,
              headerConfig.ts 의 { type: "none" } 등록이 함께 있어야 로그인으로 튕기지 않는다. */}
          <Route path={ROUTES.SHARE.VIEW} element={<SharedSchedulePage />} />
          <Route path="/*" element={<MainRoutes />} />
        </Routes>
      </MainLayout>
      <GlobalAlertModal />
      <GlobalConfirmModal />
      <GlobalLoading />
      {/* 심각 오류 전체화면 — 헤더·탭바·모달 위를 덮는다 (z-9999) */}
      <GlobalErrorScreen />
    </BrowserRouter>
  );
}

export default App;
