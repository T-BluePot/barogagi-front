import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { isLoggedIn } from "@/lib/auth/tokenCache";

/**
 * 게스트(미로그인) 전용 라우트 가드
 * - 토큰이 없으면 자식 라우트 렌더링
 * - 로그인 상태면 메인(홈)으로 리다이렉트 (뒤로가기/콜드스타트 자동로그인 시 인증 페이지 잔류 방지)
 *
 * 주의: OAuth 신규회원 닉네임 설정(/auth/oauth/profile)·콜백은 토큰 보유 중간상태이므로
 *       이 가드로 감싸지 않는다.
 */
const GuestRoute = () => {
  return isLoggedIn() ? <Navigate to={ROUTES.MAIN.HOME} replace /> : <Outlet />;
};

export default GuestRoute;
