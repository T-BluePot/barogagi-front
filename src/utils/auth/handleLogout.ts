import { clearAuthTokens } from "@/lib/auth/tokenCache";

/** 로그아웃 처리: 모든 토큰 제거 및 로그인 페이지 이동 */
export const handleLogout = () => {
  // cache는 동기 즉시 비워짐. 영속 저장소는 fire-and-forget (다음 부팅 시 빈 cache로 시작)
  void clearAuthTokens();
  window.location.href = "/auth/login";
};
