import { Routes, Route } from "react-router-dom";
import GuestRoute from "@/components/route/GuestRoute";
import AuthLandingPage from "@/pages/auth/AuthLandingPage";

/* auth/signup 로직 */
import TermsPage from "@/pages/auth/signup/TermsPage";
import CredentialsPage from "@/pages/auth/signup/CredentialsPage";
/* use shared verify code page */
import VerifyCodePage from "@/pages/auth/verify/VerifyCodePage";
import ProfilePage from "@/pages/auth/signup/ProfilePage";
import SignupCompletePage from "@/pages/auth/signup/SignupCompletePage";

/* auth/signin 로직 */
import LoginPage from "@/pages/auth/signin/LoginPage";

/* OAuth 소셜 로그인 */
import OAuthCallbackPage from "@/pages/auth/oauth/OAuthCallbackPage";
import OAuthProfilePage from "@/pages/auth/oauth/OAuthProfilePage";

/* auth/find 로직 */
import AccountFindPage from "@/pages/auth/find/AccountFindPage";
import FindIdResultPage from "@/pages/auth/find/FindIdResultPage";
import FindPwResetPage from "@/pages/auth/find/FindPwResetPage";

/* unified verify page */
import VerifyPage from "@/pages/auth/verify/VerifyPage";

export const AuthRoutes = () => (
  <Routes>
    {/* 게스트 전용 진입 라우트 (로그인 상태면 홈으로) */}
    <Route element={<GuestRoute />}>
      <Route path="/" element={<AuthLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<TermsPage />} />
      <Route path="/find" element={<AccountFindPage />} />
    </Route>

    {/* OAuth 소셜 로그인 (토큰 보유 중간상태 — 가드 제외) */}
    <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
    <Route path="/oauth/profile" element={<OAuthProfilePage />} />

    {/* 회원가입 하위 단계 */}
    <Route path="/signup/credentials" element={<CredentialsPage />} />
    <Route path="/signup/profile" element={<ProfilePage />} />
    <Route path="/signup/complete" element={<SignupCompletePage />} />

    {/* 계정 찾기 하위 단계 */}
    <Route path="/find/result" element={<FindIdResultPage />} />
    <Route path="/find/reset-password" element={<FindPwResetPage />} />

    {/* unified verify route with flow param */}
    <Route path="/verify/:flow" element={<VerifyPage />} />
    <Route path="/verify/:flow/code" element={<VerifyCodePage />} />
  </Routes>
);
