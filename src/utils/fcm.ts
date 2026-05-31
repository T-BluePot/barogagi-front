/**
 * FCM(푸시 알림) 토큰 발급 유틸
 *
 * 이 앱은 RN WebView 하이브리드라 FCM 토큰은 네이티브가 발급해 브릿지로 넘긴다.
 *
 * 토큰 출처 우선순위:
 *   1) RN 브릿지: window.BarogagiApp.getFcmToken() — 실기기 환경
 *   2) 브라우저 fallback: import.meta.env.VITE_FCM_TEST_TOKEN — 브릿지 없는 dev 환경 테스트용
 *
 * 발급된 토큰은 fcmStore에 저장하고, 서버(POST /api/v1/push/token)에 등록한다.
 * 브릿지 명세는 docs/RN_BRIDGE.md 참고.
 */

import { useFcmStore } from "@/stores/fcmStore";
import { registerPushToken } from "@/api/queries";

/** 네이티브 브릿지가 FCM 토큰 발급을 지원하는지 (RN 미구현 단계 방어) */
const isBridgeFcmAvailable = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.BarogagiApp?.getFcmToken === "function";

/**
 * FCM 토큰을 발급(획득)한다.
 *
 * - 브릿지 환경: 네이티브 토큰만 신뢰. null(권한 거부 등)이면 테스트 토큰으로 대체하지 않음.
 * - 브라우저 환경: VITE_FCM_TEST_TOKEN을 사용. 비어 있으면 null.
 *
 * @returns 발급된 토큰. 발급 불가 시 null.
 */
export const issueFcmToken = async (): Promise<string | null> => {
  if (isBridgeFcmAvailable()) {
    try {
      return await window.BarogagiApp!.getFcmToken!();
    } catch (err) {
      console.error("[fcm] 브릿지 토큰 발급 실패", err);
      return null;
    }
  }

  // 브릿지 없는 환경(브라우저 직접 접속) — 테스트 토큰 fallback
  const testToken = import.meta.env.VITE_FCM_TEST_TOKEN;
  return testToken && testToken.length > 0 ? testToken : null;
};

/**
 * FCM 토큰 등록에 함께 전송할 단말 정보를 산출한다.
 *
 * 정책상 deviceType/appVersion은 브릿지가 아닌 클라이언트가 자체 결정한다.
 * 이 앱은 웹 클라이언트(WebView/브라우저)이므로 deviceType은 "WEB" 고정.
 * appVersion은 빌드 시 주입되는 VITE_APP_VERSION을 사용한다.
 *
 * NOTE: 서버 스펙상 appVersion은 필수 string이므로 env가 비면 빈 문자열로 전송된다.
 *       정확한 버전 추적을 위해 빌드 시 VITE_APP_VERSION 주입을 권장한다.
 */
const getFcmDeviceInfo = (): { deviceType: string; appVersion: string } => ({
  deviceType: "WEB",
  appVersion: import.meta.env.VITE_APP_VERSION ?? "",
});

/**
 * FCM 토큰을 발급해 fcmStore에 저장하고 서버에 등록한다.
 * 로그인 완료 직후 fire-and-forget으로 호출한다 (인증된 사용자 대상).
 *
 * 등록 실패해도 throw하지 않는다 — 로그인 플로우를 막지 않기 위함.
 */
export const syncFcmToken = async (): Promise<void> => {
  const store = useFcmStore.getState();
  const token = await issueFcmToken();

  if (!token) {
    store.setStatus("error");
    return;
  }

  store.setToken(token);

  // 이미 같은 토큰이 등록돼 있으면 중복 등록 skip
  if (store.registeredToken === token) {
    return;
  }

  const { deviceType, appVersion } = getFcmDeviceInfo();

  try {
    store.setStatus("registering");
    await registerPushToken({ fcmToken: token, deviceType, appVersion });
    store.markRegistered(token);
  } catch (err) {
    console.error("[fcm] 서버 토큰 등록 실패", err);
    store.setStatus("error");
  }
};
