import { Routes, Route } from "react-router-dom";
import AuthLandingPage from "@/pages/auth/AuthLandingPage";
import TermsPage from "@/pages/auth/signup/TermsPage";

export const AuthRoutes = () => (
  <Routes>
    <Route path="/" element={<AuthLandingPage />} />
    <Route path="/signup" element={<TermsPage />} />
  </Routes>
);
