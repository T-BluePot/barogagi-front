import { Routes, Route, Navigate } from "react-router-dom";
import TabLayout from "@/components/layout/TabLayout";
import { ROUTES } from "@/constants/routes";
import PrivateRoute from "@/components/route/PrivateRoute";

/* 메인 페이지 */
// 일정 생성 탭
import ScheduleListPage from "@/pages/main/plan/ScheduleListPage";
import SelectDatePage from "@/pages/main/plan/SelectDatePage";
import SelectLocationPage from "../pages/main/plan/SelectLocationPage";
import ScheduleStylePage from "@/pages/main/plan/ScheduleStylePage";
import ScheduleRoutesPage from "@/pages/main/plan/ScheduleRoutesPage";
import LocationSearchPage from "@/pages/main/plan/LocationSearchPage";
import { PlanSettingPage } from "@/pages/main/plan/PlanSettingPage";

// 메인 페이지
import HomePage from "@/pages/main/HomePage";

import ProfilePage from "@/pages/main/profile/ProfilePage";
import ProfileEditPage from "@/pages/main/profile/ProfileEditPage";

/**
 * 루트 경로(/) 및 미정의 경로 진입 시 로그인 여부에 따라 리다이렉트
 * - accessToken 존재 → /home
 * - accessToken 없음 → /auth (로그인 랜딩)
 */
const RootRedirect = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return (
    <Navigate
      to={isLoggedIn ? ROUTES.MAIN.HOME : ROUTES.AUTH.LANDING}
      replace
    />
  );
};

export const MainRoutes = () => (
  <Routes>
    {/* 루트 경로: 인증 상태에 따라 분기 */}
    <Route path={ROUTES.ROOT} element={<RootRedirect />} />

    {/* 인증 필요 라우트 (PrivateRoute 가드) */}
    <Route element={<PrivateRoute />}>
      {/* Bottom Tab 페이지 */}
      <Route element={<TabLayout />}>
        <Route path={ROUTES.MAIN.HOME} element={<HomePage />} />
        <Route path={ROUTES.PLAN.LIST} element={<ScheduleListPage />} />
        <Route path={ROUTES.MAIN.PROFILE} element={<ProfilePage />} />
      </Route>

      <Route path={ROUTES.MAIN.PROFILE_EDIT} element={<ProfileEditPage />} />
      <Route path={ROUTES.PLAN.DATE} element={<SelectDatePage />} />
      <Route path={ROUTES.PLAN.LOCATION} element={<SelectLocationPage />} />
      <Route path={ROUTES.PLAN.SETTING} element={<PlanSettingPage />} />
      <Route path={ROUTES.PLAN.STYLE} element={<ScheduleStylePage />} />
      <Route
        path={ROUTES.PLAN.CREATE}
        element={<ScheduleRoutesPage variant="create" />}
      />
      <Route
        path={ROUTES.PLAN.DETAIL}
        element={<ScheduleRoutesPage variant="detail" />}
      >
        <Route path="search" element={<LocationSearchPage />} />
      </Route>
      <Route path={ROUTES.PLAN.SEARCH} element={<LocationSearchPage />} />

      {/* TODO: 페이지 구현 후 Route 등록 예정 */}
      {/* <Route path={ROUTES.MAIN.SETTINGS} element={<SettingsPage />} /> */}
      {/* <Route path={ROUTES.MAIN.CHAT} element={<ChatPage />} /> */}
      {/* <Route path={ROUTES.MAIN.NOTIFICATION} element={<NotificationPage />} /> */}
    </Route>

    {/* 인증 불필요: 미정의 경로 → 인증 상태에 따라 분기 */}
    <Route path="*" element={<RootRedirect />} />
  </Routes>
);
