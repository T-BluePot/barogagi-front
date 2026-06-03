import type { AuthTokenBundle } from "@/types/tokenTypes";
import { setAuthTokens } from "@/lib/auth/tokenCache";

/**
 * 인증 토큰 저장. 호출자(useLoginMutation, axiosInterceptors, OAuthCallbackPage)는
 * 동기 인터페이스를 기대하므로 Promise를 반환하지 않고 fire-and-forget 으로 위임.
 *
 * - 메모리 캐시는 setAuthTokens 내부에서 즉시 동기 갱신됨 → 후속 read는 항상 정상 값
 * - 영속 저장소 쓰기는 비동기. 강제 종료 등 극단 케이스에서 영속화 누락 가능 (수용 가능 위험)
 */
export const saveAuthTokens = (bundle: AuthTokenBundle): void => {
  void setAuthTokens(bundle).catch((err) => {
    console.error("[tokenStorage] saveAuthTokens 실패", err);
  });
};
