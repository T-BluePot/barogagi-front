import { Routes, Route } from "react-router-dom";
import AuthLandingPage from "@/pages/auth/AuthLandingPage";

/* auth/signup 로직 */
import TermsPage from "@/pages/auth/signup/TermsPage";
import CredentialsPage from "@/pages/auth/signup/CredentialsPage";
import VerifyPhonePage from "@/pages/auth/signup/VerifyPhonePage";

export const AuthRoutes = () => (
  <Routes>
    <Route path="/login" element={<AuthLandingPage />} />
    <Route path="/signup" element={<TermsPage />} />
    <Route path="/signup/credentials" element={<CredentialsPage />} />
    <Route path="/signup/verify" element={<VerifyPhonePage />} />
  </Routes>
);
