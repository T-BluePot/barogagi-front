import { Routes, Route } from "react-router-dom";
import AuthLandingPage from "@/pages/auth/AuthLandingPage";

/* auth/signup 로직 */
import TermsPage from "@/pages/auth/signup/TermsPage";
import CredentialsPage from "@/pages/auth/signup/CredentialsPage";
/* use shared verify code page */
import VerifyCodePage from "@/pages/auth/verify/VerifyCodePage";
import ProfilePage from "@/pages/auth/signup/ProfilePage";
import SignupCompletePage from "@/pages/auth/signup/SignupCompletePage";

/* auth/signin 로직 */
import EmailLoginPage from "@/pages/auth/signin/EmailLoginPage";

/* auth/find 로직 */
import AccountFindPage from "@/pages/auth/find/AccountFindPage";
import FindIdResultPage from "@/pages/auth/find/FindIdResultPage";
import FindPwResetPage from "@/pages/auth/find/FindPwResetPage";

/* unified verify page */
import VerifyPage from "@/pages/auth/verify/VerifyPage";

/* 메인 페이지 */
// 일정 생성 탭
import PlanListPage from "@/pages/main/plan/PlanListPage";
import SelectDatePage from "@/pages/main/plan/SelectDatePage";
import SelectLocationPage from "../pages/main/plan/SelectLocationPage";
import TravelStylePage from "@/pages/main/plan/TravelStylePage";

export const AuthRoutes = () => (
  <Routes>
    <Route path="/" element={<AuthLandingPage />} />
    <Route path="/login" element={<EmailLoginPage />} />
    {/* 회원가입 로직 페이지 */}
    <Route path="/signup" element={<TermsPage />} />
    <Route path="/signup/credentials" element={<CredentialsPage />} />
    <Route path="/signup/profile" element={<ProfilePage />} />
    <Route path="/signup/complete" element={<SignupCompletePage />} />
    {/* 계정 찾기 */}
    <Route path="/find" element={<AccountFindPage />} />
    <Route path="/find/result" element={<FindIdResultPage />} />
    <Route path="/find/reset-password" element={<FindPwResetPage />} />
    {/* unified verify route with flow param */}
    <Route path="/verify/:flow" element={<VerifyPage />} />
    <Route path="/verify/:flow/code" element={<VerifyCodePage />} />
    {/* 일정 생성 */}
    <Route path="/plan" element={<PlanListPage />} />
    <Route path="/plan/date" element={<SelectDatePage />} />
    <Route path="/plan/location" element={<SelectLocationPage />} />
    <Route path="/plan/travelStyle" element={<TravelStylePage />} />
  </Routes>
);
