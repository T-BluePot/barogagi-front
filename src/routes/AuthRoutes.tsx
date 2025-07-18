import { Routes, Route } from "react-router-dom";
import AuthLandingPage from "@/pages/auth/AuthLandingPage";
import TermsPage from "@/pages/auth/signup/TermsPage";
import EmailLoginPage from "@/pages/auth/signin/EmailLoginPage";

export const AuthRoutes = () => (
  <Routes>
    <Route path="/" element={<AuthLandingPage />} />
    <Route path="/login" element={<EmailLoginPage />} />
    <Route path="/signup" element={<TermsPage />} />
  </Routes>
);
