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
/**
 * 강제 로그아웃 안내를 다음 페이지로 넘기기 위한 표시.
 *
 * 이 함수는 하드 네비게이션으로 끝나므로 메모리 상태(토스트·모달 스토어)가 전부 날아간다.
 * 여기서 토스트를 띄워봐야 페이지가 새로 뜨면서 사라지므로, sessionStorage 에 표시만 남기고
 * 로그인 화면이 뜬 뒤 `useForcedLogoutNotice` 가 읽어서 안내한다.
 */
const FORCED_LOGOUT_NOTICE_KEY = "forcedLogoutNotice";

/**
 * 강제 로그아웃 표시가 있으면 지우고 true 를 반환한다 (1회성).
 *
 * 읽는 즉시 지운다 — 남겨두면 이후 로그인 화면에 올 때마다 같은 안내가 반복된다.
 */
export const consumeForcedLogoutNotice = (): boolean => {
  try {
    if (sessionStorage.getItem(FORCED_LOGOUT_NOTICE_KEY) === null) return false;
    sessionStorage.removeItem(FORCED_LOGOUT_NOTICE_KEY);
    return true;
  } catch {
    // 프라이빗 모드 등에서 sessionStorage 접근이 막힐 수 있다 — 안내 못 해도 흐름은 계속된다
    return false;
  }
};

/**
 * @param options.silent 안내를 남기지 않는다. **사용자가 직접 로그아웃한 경우**에 쓴다 —
 *   본인이 누른 건데 "로그인이 만료되었어요" 가 뜨면 잘못된 안내다.
 */
export const handleForcedLogout = async (options?: {
  silent?: boolean;
}): Promise<void> => {
  if (!options?.silent) {
    try {
      sessionStorage.setItem(FORCED_LOGOUT_NOTICE_KEY, "1");
    } catch {
      // 표시를 못 남겨도 로그아웃 자체는 진행해야 한다
    }
  }

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
