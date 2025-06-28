import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLandingPage from "@/pages/auth/AuthLandingPage";

export const AuthRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<AuthLandingPage />} />
    </Routes>
  </BrowserRouter>
);
