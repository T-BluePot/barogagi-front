import { Routes, Route } from "react-router-dom";

/* 메인 페이지 */
// 일정 생성 탭
import PlanListPage from "@/pages/main/plan/PlanListPage";
import SelectDatePage from "@/pages/main/plan/SelectDatePage";
import SelectLocationPage from "../pages/main/plan/SelectLocationPage";
import TravelStylePage from "@/pages/main/plan/TravelStylePage";

// 메인 페이지
import HomePage from "@/pages/main/HomePage";

export const MainRoutes = () => (
  <Routes>
    {/* 일정 생성 */}
    <Route path="/plan" element={<PlanListPage />} />
    <Route path="/plan/date" element={<SelectDatePage />} />
    <Route path="/plan/location" element={<SelectLocationPage />} />
    <Route path="/plan/travelStyle" element={<TravelStylePage />} />
    <Route path="/home" element={<HomePage />} />
  </Routes>
);
