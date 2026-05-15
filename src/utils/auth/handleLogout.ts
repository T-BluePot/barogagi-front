import { clearAuthTokens } from "@/lib/auth/tokenCache";

/** 로그아웃 처리: 모든 토큰 제거 및 로그인 페이지 이동 */
export const handleLogout = async (): Promise<void> => {
  // 영속 저장소 정리가 끝난 뒤 리다이렉트.
  // 정리 전에 페이지가 리로드되면 다음 부팅 시 bootstrapTokens()가 오래된 토큰을 읽음.
  try {
    await clearAuthTokens();
  } catch (err) {
    // clear 실패해도 리다이렉트는 진행 (cache는 동기 즉시 비워졌으므로 세션은 종료된 상태)
    console.error("[handleLogout] clearAuthTokens 실패", err);
  }
  window.location.href = "/auth/login";
};
