import { Routes, Route, Navigate } from "react-router-dom";
import TabLayout from "@/components/layout/TabLayout";
import { ROUTES } from "@/constants/routes";

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
 * 루트 경로(/) 진입 시 로그인 여부에 따라 리다이렉트
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
    <Route path="/" element={<RootRedirect />} />
    {/* 정의되지 않은 경로: 인증 상태에 따라 분기 */}
    <Route path="*" element={<RootRedirect />} />

    {/* Bottom Tab 페이지 */}
    <Route element={<TabLayout />}>
      {/* Home 페이지 */}
      <Route path="/home" element={<HomePage />} />
      {/* Plan 페이지 */}
      <Route path="/plan" element={<ScheduleListPage />} />
      {/* Profile 페이지 */}
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
    {/* Profile Edit */}
    <Route path="/profile/edit" element={<ProfileEditPage />} />
    {/* 일정 생성 */}
    <Route path="/plan/date" element={<SelectDatePage />} />
    <Route path="/plan/location" element={<SelectLocationPage />} />
    <Route path="/plan/setting" element={<PlanSettingPage />} />
    <Route path="/plan/style" element={<ScheduleStylePage />} />
    <Route
      path="/plan/create"
      element={<ScheduleRoutesPage variant="create" />}
    />

    {/* 일정 상세 화면: /plan/:id/detail */}
    <Route
      path="/plan/:id/detail"
      element={<ScheduleRoutesPage variant="detail" />}
    >
      {/* 자식 검색 페이지 */}
      <Route path="search" element={<LocationSearchPage />} />
    </Route>

    {/* 공통 장소 검색 페이지 */}
    <Route path="/plan/search" element={<LocationSearchPage />} />
  </Routes>
);
