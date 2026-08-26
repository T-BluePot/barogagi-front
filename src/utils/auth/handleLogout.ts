import { clearAuthTokens } from "@/lib/auth/tokenCache";
import { useFcmStore } from "@/stores/fcmStore";
import { ROUTES } from "@/constants/routes";

/**
 * 강제 로그아웃: 로컬 세션만 정리하고 로그인 화면으로 보낸다.
 *
 * **세션이 이미 죽은 경우**에 쓴다 — 리프레시 토큰 만료로 axios 인터셉터가 401 을 복구하지
 * 못했을 때가 대표적이다. 이 시점에는 인증이 끊겨 있어 서버 호출(로그아웃 API, FCM 토큰
 * 삭제 API)이 전부 401 로 튕기므로 **시도하지 않는다.**
 *
 * ⚠️ 그 결과 서버에는 이 기기의 FCM 등록이 살아남는다.
 *    → 로그아웃된 뒤에도 알림이 오고, 같은 기기에 다른 계정이 로그인하면 이전 회원의 알림이
 *      그 기기로 갈 수 있다. 클라이언트로는 막을 수 없다(인증이 없어 삭제 API 를 못 부른다).
 *      같은 회원이 다시 로그인하면 재등록으로 정리된다.
 *
 * 사용자가 직접 로그아웃 버튼을 누른 경우에는 **`handleUserLogout()`** 을 쓴다.
 * 그쪽은 인증이 살아 있으므로 서버 정리까지 수행하며, 마지막 단계로 이 함수를 호출한다.
 */
export const handleForcedLogout = async (): Promise<void> => {
  // 서버 등록 정보를 더 이상 신뢰할 수 없으므로 로컬 기록도 비운다.
  // (deviceId 는 여기서 지우지 않는다 — 기기 식별자는 로그인과 무관하게 유지되어야 한다)
  useFcmStore.getState().reset();

  // 영속 저장소 정리가 끝난 뒤 리다이렉트.
  // 정리 전에 페이지가 리로드되면 다음 부팅 시 bootstrapTokens()가 오래된 토큰을 읽음.
  try {
    await clearAuthTokens();
  } catch (err) {
    // clear 실패해도 리다이렉트는 진행 (cache는 동기 즉시 비워졌으므로 세션은 종료된 상태)
    console.error("[handleForcedLogout] clearAuthTokens 실패", err);
  }

  // 하드 네비게이션 — React Query 캐시 등 메모리에 남은 이전 사용자 데이터까지 확실히 날린다
  window.location.href = ROUTES.AUTH.SIGNIN;
};
