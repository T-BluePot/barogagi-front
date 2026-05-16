import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { isLoggedIn } from "@/lib/auth/tokenCache";

/**
 * 루트 진입 시 토큰 유무로 랜딩 분기
 * - accessToken 존재: /home
 * - accessToken 없음: /auth (랜딩 페이지)
 */

export function RootRedirect() {
  return isLoggedIn() ? (
    <Navigate to={ROUTES.MAIN.HOME} replace />
  ) : (
    <Navigate to={ROUTES.AUTH.LANDING} replace />
  );
}
