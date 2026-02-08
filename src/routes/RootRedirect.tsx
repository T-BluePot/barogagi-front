import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

/**
 * 루트 진입 시 토큰 유무로 랜딩 분기
 * - accessToken 존재: /home
 * - accessToken 없음: /auth/login
 */

export function RootRedirect() {
  const location = useLocation();

  // localStorage 기반 로그인 여부 판단
  const accessToken = localStorage.getItem("accessToken");

  //
  const isLoggedIn = Boolean(accessToken);
  if (location.pathname.startsWith("/auth")) {
    return null;
  }

  return isLoggedIn ? (
    <Navigate to={ROUTES.MAIN.HOME} replace />
  ) : (
    <Navigate to={ROUTES.AUTH.LANDING} replace />
  );
}
