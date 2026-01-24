import { Routes, Route } from "react-router-dom";
import TabLayout from "@/components/layout/TabLayout";

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

export const MainRoutes = () => (
  <Routes>
    {/* Bottom Tab 페이지 */}
    <Route element={<TabLayout />}>
      {/* Home 페이지 */}
      <Route path="/" element={<HomePage />} />
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
