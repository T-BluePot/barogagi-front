import { Routes, Route } from "react-router-dom";
import AuthLandingPage from "@/pages/auth/AuthLandingPage";

export const AuthRoutes = () => (
  <Routes>
    <Route path="/login" element={<AuthLandingPage />} />
  </Routes>
);
