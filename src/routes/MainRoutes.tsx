import { Routes, Route } from "react-router-dom";

/* 메인 페이지 */
// 일정 생성 탭
import PlanListPage from "@/pages/main/plan/PlanListPage";
import SelectDatePage from "@/pages/main/plan/SelectDatePage";
import SelectLocationPage from "../pages/main/plan/SelectLocationPage";
import TravelStylePage from "@/pages/main/plan/TravelStylePage";
import ScheduleRoutesPage from "@/pages/main/plan/ScheduleRoutesPage";
import LocationSearchPage from "@/pages/main/plan/LocationSearchPage";

// 메인 페이지
import HomePage from "@/pages/main/HomePage";

export const MainRoutes = () => (
  <Routes>
    {/* Home 페이지 */}
    <Route path="/" element={<HomePage />} />
    <Route path="/home" element={<HomePage />} />
    {/* 일정 생성 */}
    <Route path="/plan" element={<PlanListPage />} />
    <Route path="/plan/date" element={<SelectDatePage />} />
    <Route path="/plan/location" element={<SelectLocationPage />} />
    <Route path="/plan/travelStyle" element={<TravelStylePage />} />
    {/* 추천 루트: /plan/create */}
    <Route
      path="/plan/create"
      element={<ScheduleRoutesPage variant="create" />}
    />

    {/* 상세 화면: /plan/:id/detail */}
    <Route
      path="/plan/:id/detail"
      element={<ScheduleRoutesPage variant="detail" />}
    />
    {/* 공통 장소 검색 페이지 */}
    <Route path="/plan/location-search" element={<LocationSearchPage />} />
  </Routes>
);
