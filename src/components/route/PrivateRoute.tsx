import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

/**
 * 인증이 필요한 라우트를 감싸는 가드 컴포넌트
 * - accessToken이 존재하면 자식 라우트를 렌더링
 * - 없으면 로그인 랜딩 페이지로 리다이렉트
 */
const PrivateRoute = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return isLoggedIn ? <Outlet /> : <Navigate to={ROUTES.AUTH.LANDING} replace />;
};

export default PrivateRoute;
