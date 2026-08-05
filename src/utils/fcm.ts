/**
 * FCM(푸시 알림) 토큰 발급 유틸
 *
 * 이 앱은 RN WebView 하이브리드라 FCM 토큰은 네이티브가 발급해 브릿지로 넘긴다.
 *
 * 토큰 출처 우선순위:
 *   1) RN 브릿지: window.BarogagiApp.getFcmToken() — 실기기 환경
 *   2) 테스트 override: import.meta.env.VITE_FCM_TEST_TOKEN — 브릿지 없는 dev 환경 테스트용
 *   3) Firebase 웹 SDK: getToken() — 브릿지/테스트토큰 둘 다 없는 실제 브라우저 환경
 *
 * 발급된 토큰은 fcmStore에 저장하고, 서버(POST /api/v1/push/token)에 등록한다.
 * 브릿지 명세는 docs/RN_BRIDGE.md 참고.
 */

import { useFcmStore } from "@/stores/fcmStore";
import { registerPushToken } from "@/api/queries";
import { getToken } from "firebase/messaging";
import {
  getFirebaseMessaging,
  getVapidKey,
  buildSwConfigQuery,
} from "@/lib/firebase";

/** 네이티브 브릿지가 FCM 토큰 발급을 지원하는지 (RN 미구현 단계 방어) */
const isBridgeFcmAvailable = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.BarogagiApp?.getFcmToken === "function";

/**
 * Firebase 웹 SDK로 FCM 토큰을 발급한다 (브릿지/테스트토큰 둘 다 없는 실제 브라우저 경로).
 *
 * 어느 단계든 발급 불가 조건이면 throw하지 않고 null을 반환한다:
 *   - messaging 미지원 / config 미설정 → getFirebaseMessaging()이 null
 *   - VAPID 키 미설정 → getToken 불가
 *   - 알림 권한 미허용 / 토큰 발급 실패
 *
 * @returns 발급된 토큰. 발급 불가 시 null.
 */
const issueFirebaseToken = async (): Promise<string | null> => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  const vapidKey = getVapidKey();
  if (!vapidKey) {
    console.warn(
      "[fcm] VITE_FIREBASE_VAPID_KEY 미설정 — Firebase 토큰 발급 skip"
    );
    return null;
  }

  // Notification API 자체가 없는 환경(일부 WebView/구버전) 방어 — 없으면 throw 대신 skip
  if (typeof Notification === "undefined") {
    console.warn(
      "[fcm] Notification API 미지원 환경 — Firebase 토큰 발급 skip"
    );
    return null;
  }

  try {
    // 알림 권한 요청 — 허용되지 않으면 토큰 발급 불가
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("[fcm] 알림 권한 미허용 — Firebase 토큰 발급 skip");
      return null;
    }

    // config 주입 쿼리를 붙여 백그라운드 서비스워커 등록
    const serviceWorkerRegistration = await navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?${buildSwConfigQuery()}`,
      { scope: "/" }
    );
    const firebaseToken = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration,
    });
    console.log("[fcm] Firebase 토큰 발급", {
      source: "firebase",
      token: firebaseToken,
    });
    return firebaseToken;
  } catch (err) {
    console.error("[fcm] Firebase 토큰 발급 실패", err);
    return null;
  }
};

/**
 * FCM 토큰을 발급(획득)한다.
 *
 * 우선순위:
 *   1) 브릿지 환경: 네이티브 토큰만 신뢰. null(권한 거부 등)이면 테스트 토큰으로 대체하지 않음.
 *   2) VITE_FCM_TEST_TOKEN: 테스트 override. 브릿지/권한/SW와 무관하게 그대로 사용.
 *   3) Firebase 웹 SDK: 위 둘이 없을 때만. 권한 요청 + SW 등록 + getToken 수행.
 *
 * @returns 발급된 토큰. 발급 불가 시 null.
 */
export const issueFcmToken = async (): Promise<string | null> => {
  if (isBridgeFcmAvailable()) {
    try {
      const bridgeToken = await window.BarogagiApp!.getFcmToken!();
      console.log("[fcm] 브릿지 토큰 발급", {
        source: "bridge",
        token: bridgeToken,
      });
      return bridgeToken;
    } catch (err) {
      console.error("[fcm] 브릿지 토큰 발급 실패", err);
      return null;
    }
  }

  // 브릿지 없는 환경(브라우저 직접 접속) — 테스트 토큰 override 우선
  const testToken = import.meta.env.VITE_FCM_TEST_TOKEN;
  if (testToken && testToken.length > 0) {
    console.log("[fcm] 테스트 토큰 사용", {
      source: "test-env",
      token: testToken,
    });
    return testToken;
  }

  // 테스트 토큰도 없으면 Firebase 웹 SDK로 실제 발급 시도
  return issueFirebaseToken();
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
 *
 * ⚠️ 같은 env 를 `utils/appVersion.ts` 의 `getCurrentAppVersion()` 도 읽는다(브릿지 우선).
 *    일원화하지 않은 것은 의도다 — 서버가 말하는 appVersion 이 "웹 클라이언트 버전"인지
 *    "설치된 앱 버전"인지 확인되기 전에는 위 정책 주석을 임의로 뒤집을 수 없다.
 *    서버 측 의미가 확정되면 여기서 `getCurrentAppVersion()` 을 호출하도록 합친다(#112).
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

  const { deviceType, appVersion } = getFcmDeviceInfo();

  // 토큰과 appVersion이 **둘 다** 그대로일 때만 중복 등록 skip.
  // 토큰이 같아도 앱 버전이 바뀌면 서버가 최신 버전을 알아야 하므로 재등록한다.
  //
  // ⚠️ 현재 appVersion은 getFcmDeviceInfo()가 정책상 VITE_APP_VERSION을 쓰고 그 env가 미설정이라
  //    항상 빈 문자열이다 → 이 버전 트리거는 실질적으로 아직 발동하지 않는다.
  //    브릿지 실측값(getAppVersion)으로 바꾸려면 서버 측 appVersion 의미 확인이 선행이다
  //    (getFcmDeviceInfo 주석의 정책 참고). 지금은 트리거 경로만 심어 둔다.
  if (
    store.registeredToken === token &&
    store.registeredAppVersion === appVersion
  ) {
    console.log("[fcm] 이미 등록된 토큰 — 서버 등록 skip", {
      token,
      appVersion,
    });
    // setToken 이 status 를 "issued" 로 올려둔 상태다. 서버 등록을 건너뛰는 건
    // 이미 등록돼 있기 때문이므로 "registered" 로 되돌려야 상태가 실제와 맞는다.
    store.setStatus("registered");
    return;
  }

  try {
    store.setStatus("registering");
    await registerPushToken({ fcmToken: token, deviceType, appVersion });
    store.markRegistered(token, appVersion);
    console.log("[fcm] 서버 토큰 등록 완료", { token, deviceType, appVersion });
  } catch (err) {
    console.error("[fcm] 서버 토큰 등록 실패", err);
    store.setStatus("error");
  }
};
