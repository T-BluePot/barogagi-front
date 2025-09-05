import { Routes, Route } from "react-router-dom";
import AuthLandingPage from "@/pages/auth/AuthLandingPage";

/* auth/signup 로직 */
import TermsPage from "@/pages/auth/signup/TermsPage";
import CredentialsPage from "@/pages/auth/signup/CredentialsPage";
import VerifyPhonePage from "@/pages/auth/signup/VerifyPhonePage";
import VerifyCodePage from "@/pages/auth/signup/VerifyCodePage";
import ProfilePage from "@/pages/auth/signup/ProfilePage";
import SignupCompletePage from "@/pages/auth/signup/SignupCompletePage";
/* 메인 페이지 */
// 일정 생성 탭
import PlanListPage from "@/pages/main/plan/PlanListPage";
import SelectDatePage from "@/pages/main/plan/SelectDatePage";
import SelectLocationPage from "../pages/main/plan/SelectLocationPage";
import TravelStylePage from "@/pages/main/plan/TravelStylePage";

export const AuthRoutes = () => (
  <Routes>
    <Route path="/login" element={<AuthLandingPage />} />
    {/* 회원가입 로직 페이지 */}
    <Route path="/signup" element={<TermsPage />} />
    <Route path="/signup/credentials" element={<CredentialsPage />} />
    <Route path="/signup/verify" element={<VerifyPhonePage />} />
    <Route path="/signup/verify/code" element={<VerifyCodePage />} />
    <Route path="/signup/profile" element={<ProfilePage />} />
    <Route path="/signup/complete" element={<SignupCompletePage />} />
    {/* 일정 생성 */}
    <Route path="/plan" element={<PlanListPage />} />
    <Route path="/plan/date" element={<SelectDatePage />} />
    <Route path="/plan/location" element={<SelectLocationPage />} />
    <Route path="/plan/travelStlye" element={<TravelStylePage />} />
  </Routes>
);
