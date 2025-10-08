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
  </Routes>
);
