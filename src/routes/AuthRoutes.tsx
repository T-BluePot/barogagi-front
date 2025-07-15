import { Routes, Route } from "react-router-dom";
import AuthLandingPage from "@/pages/auth/AuthLandingPage";
import TermsPage from "@/pages/auth/signup/TermsPage";
/* 메인 페이지 */
// 일정 생성 탭
import SelectDatePage from "@/pages/main/plan/SelectDatePage";

export const AuthRoutes = () => (
  <Routes>
    <Route path="/login" element={<AuthLandingPage />} />
    <Route path="/signup" element={<TermsPage />} />
    {/* 일정 생성 */}
    <Route path="/plan/date" element={<SelectDatePage />} />
  </Routes>
);
