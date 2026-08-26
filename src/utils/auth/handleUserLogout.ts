import { logout } from "@/api/queries/authQueries";
import { deleteFcmTokenForThisDevice } from "@/utils/fcm";
import { handleForcedLogout } from "./handleLogout";

/**
 * 사용자가 직접 로그아웃할 때의 처리.
 *
 * 인증이 살아 있는 유일한 시점이므로, 로컬 정리 전에 **서버 정리를 먼저** 끝낸다.
 *
 * 순서:
 *   ① FCM 토큰 삭제 API — 이 기기의 등록만 지운다
 *   ② 로그아웃 API      — 서버가 (membershipNo, deviceId) 의 토큰을 REVOKE
 *   ③ 로컬 정리 + 리다이렉트 (`handleForcedLogout`)
 *
 * ⚠️ ①이 ②보다 **먼저**여야 한다.
 *    로그아웃 API 는 이 기기의 토큰을 REVOKE 하므로, 그 뒤에 FCM 삭제를 부르면
 *    액세스 토큰까지 무효화된 경우 401 로 튕겨 서버에 등록이 남는다.
 *    (백엔드 회의록에는 "로그아웃 API 호출 후 FCM 삭제"로 적혀 있었으나,
 *     액세스 토큰 생존을 전제로 하는 순서라 굳이 위험을 떠안을 이유가 없다)
 *
 * ⚠️ 서버 호출이 실패해도 **로컬 정리는 반드시 진행한다.**
 *    여기서 중단하면 사용자 화면상 로그아웃이 되지 않은 것처럼 보인다.
 *    (FCM 삭제 실패는 `deleteFcmTokenForThisDevice` 내부에서 1회 재시도 후 false 를 돌려주며,
 *     끝내 실패하면 서버에 등록이 남는다 — 다음 로그인 시 재등록으로 정리된다)
 *
 * 이 파일이 `handleLogout.ts` 와 분리돼 있는 이유:
 *   `handleLogout.ts` 는 axios 인터셉터가 import 한다. 거기서 API 계층(`api/queries`)을
 *   함께 import 하면 `client → axiosInterceptors → handleLogout → api/queries → client`
 *   순환이 생긴다. 서버 호출이 필요한 쪽만 이 파일로 떼어 순환을 끊는다.
 */
export const handleUserLogout = async (): Promise<void> => {
  // ① 이 기기의 FCM 등록 삭제 (실패해도 진행 — 내부에서 재시도/로깅 후 false 반환)
  await deleteFcmTokenForThisDevice();

  // ② 서버 세션 종료
  try {
    await logout();
  } catch (err) {
    console.error("[handleUserLogout] 로그아웃 API 실패 — 로컬 정리는 계속", err);
  }

  // ③ 로컬 정리 + 로그인 화면으로
  await handleForcedLogout();
};
