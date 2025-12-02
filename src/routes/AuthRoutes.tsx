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
import ScheduleRoutesPage from "@/pages/main/plan/ScheduleRoutesPage";
import LocationSearchPage from "@/pages/main/plan/LocationSearchPage";

export const AuthRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthLandingPage />} />
    <Route path="/auth/login" element={<EmailLoginPage />} />
    {/* 회원가입 로직 페이지 */}
    <Route path="/auth/signup" element={<TermsPage />} />
    <Route path="/auth/signup/credentials" element={<CredentialsPage />} />
    <Route path="/auth/signup/profile" element={<ProfilePage />} />
    <Route path="/auth/signup/complete" element={<SignupCompletePage />} />
    {/* 계정 찾기 */}
    <Route path="/auth/find" element={<AccountFindPage />} />
    <Route path="/auth/find/result" element={<FindIdResultPage />} />
    <Route path="/auth/find/reset-password" element={<FindPwResetPage />} />
    {/* unified verify route with flow param */}
    <Route path="/auth/verify/:flow" element={<VerifyPage />} />
    <Route path="/auth/verify/:flow/code" element={<VerifyCodePage />} />
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
