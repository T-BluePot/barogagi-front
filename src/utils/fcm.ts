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
import { registerPushToken, deletePushToken } from "@/api/queries";
import {
  getDeviceId,
  getDeviceIdRecord,
  issueNativeDeviceId,
  replaceDeviceId,
} from "@/utils/deviceId";
import { getCurrentAppVersion } from "@/utils/appVersion";
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
 * ⚠️ `deviceType` 은 기기 *종류* 가 아니라 **기기 고유 식별자(deviceId)** 를 넣는 자리다.
 *    백엔드 API 문서상 이 필드 설명이 로그인의 `deviceId` 와 똑같이
 *    "기기를 식별할 수 있는 고유 데이터"다. 서버는 이 값으로 회원의 기기들을 구분하고,
 *    로그아웃 시 해당 기기의 토큰만 골라 삭제한다.
 *    → 종전의 `"WEB"` 고정값은 한 회원의 모든 기기를 하나로 뭉쳐 기기 구분을 불가능하게 했다.
 *      (삭제 API 도 같은 필드를 매칭 키로 쓰므로 등록/삭제에 **반드시 같은 값**을 보내야 한다)
 *
 * `appVersion` 은 **설치된 앱(APK) 버전**이다 — 서버가 구버전 사용자를 구분하는 데 쓴다.
 * 따라서 빌드 env(VITE_APP_VERSION)가 아니라 브릿지 실측값을 우선하는
 * `getCurrentAppVersion()` 을 쓴다. #112 가 남겨둔 "서버 측 appVersion 의미 확인" 조건이
 * 백엔드 API 문서("앱 버전 정보를 넘겨주세요 (ex. 1.1)")로 충족되어 여기서 일원화한다.
 * 버전을 알 수 없는 환경(브라우저·구버전 앱)에서는 `undefined` 로 남긴다.
 * `""` 로 채우지 않는다 — CLAUDE.md 의 "absent 필드에 더미값 금지" 규칙이다.
 * 서버도 이 필드를 필수로 두지 않는다(스웨거 `PushTokenRequest` 에 required 배열 없음).
 * axios 가 JSON 직렬화하면서 undefined 키를 빼므로 전송에서도 자연히 생략된다.
 */
const getFcmDeviceInfo = async (): Promise<{
  deviceType: string;
  appVersion: string | undefined;
}> => ({
  deviceType: await getDeviceId(),
  appVersion: (await getCurrentAppVersion()) ?? undefined,
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

  // 호출부가 `void syncFcmToken()` 으로 던져두므로 이 함수는 **reject 하면 안 된다.**
  // getFcmDeviceInfo() 는 getDeviceId() 를 부르는데, 그 안의 getDeviceIdRecord() 는
  // 실패를 캐시하지 않으려고 의도적으로 rethrow 한다 → 여기서 받지 않으면 unhandled rejection.
  let deviceType: string;
  let appVersion: string | undefined;
  try {
    ({ deviceType, appVersion } = await getFcmDeviceInfo());
  } catch (err) {
    console.error("[fcm] 단말 정보 조회 실패 — 서버 등록 skip", err);
    store.setStatus("error");
    return;
  }

  // 종전 버전이 `"WEB"` 으로 등록해 둔 기록이 있으면 **먼저 지운다.**
  // 지우지 않고 새 식별자로 등록하면 같은 FCM 토큰이 옛 행("WEB")과 새 행(deviceId)에
  // 동시에 남아 같은 기기로 푸시가 두 번 간다.
  // 삭제에 실패하면 등록 자체를 건너뛴다 — 옛 행이 살아 있어 푸시는 계속 도달하므로
  // 사용자 피해가 없고, 억지로 등록하면 오히려 중복 발송이 된다. 다음 기회에 다시 시도한다.
  if (await cleanupLegacyRegistration()) {
    console.log("[fcm] 레거시 등록 정리 후 재등록 진행");
  } else if (getLegacyRegisteredToken()) {
    console.warn(
      "[fcm] 레거시 등록 삭제 실패 — 이번 등록은 건너뛴다(중복 발송 방지)"
    );
    store.setStatus("error");
    return;
  }

  // 위에서 reset() 이 일어났을 수 있으므로 **스냅샷이 아니라 현재 상태**를 다시 읽는다.
  const registered = useFcmStore.getState();

  // 토큰·기기식별자·appVersion이 **셋 다** 그대로일 때만 중복 등록 skip.
  // - 토큰이 같아도 앱 버전이 바뀌면 서버가 최신 버전을 알아야 하므로 재등록한다.
  // - 기기 식별자가 바뀌면 서버에는 **다른 기기의 등록**이 남아 있는 상태다. 여기서 skip 하면
  //   서버가 현재 기기를 영영 모르게 되므로 반드시 재등록한다.
  //   (deviceId 는 원칙적으로 불변이지만, 저장소 읽기 실패 시 임시 식별자가 쓰였다가
  //    다음 실행에서 원래 값으로 복귀하는 경로가 있다 — utils/deviceId.ts 참고)
  if (
    registered.registeredToken === token &&
    registered.registeredDeviceId === deviceType &&
    registered.registeredAppVersion === appVersion
  ) {
    console.log("[fcm] 이미 등록된 토큰 — 서버 등록 skip", {
      token,
      deviceType,
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
    store.markRegistered(token, deviceType, appVersion);
    console.log("[fcm] 서버 토큰 등록 완료", { token, deviceType, appVersion });
  } catch (err) {
    console.error("[fcm] 서버 토큰 등록 실패", err);
    store.setStatus("error");
  }
};

/** 삭제 재시도 대기(ms). 로그아웃 흐름을 붙잡지 않도록 짧게 둔다. */
const DELETE_RETRY_DELAY_MS = 300;

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * 삭제 요청을 1회 재시도한다.
 *
 * 삭제에 실패한 채 로그아웃되면 서버에는 **살아 있는 FCM 토큰**이 남는다.
 * 그 상태에서 같은 기기에 다른 계정이 로그인하면 이전 회원의 알림이 그 기기로 간다
 * (401 강제 로그아웃과 동일한 문제). 401 경로는 인증이 이미 끊겨 손쓸 수 없지만,
 * 정상 로그아웃 중의 일시적 네트워크 실패는 재시도로 줄일 수 있다.
 *
 * @returns 삭제 성공 여부. throw 하지 않는다 — 로그아웃/탈퇴 흐름을 막으면 안 된다.
 */
const runDelete = async (
  params: { fcmToken: string; deviceType: string } | undefined,
  label: string
): Promise<boolean> => {
  try {
    await deletePushToken(params);
    console.log(`[fcm] ${label} 완료`, params ?? "(회원 전체)");
    return true;
  } catch (first) {
    console.warn(`[fcm] ${label} 실패 — 1회 재시도`, first);
  }

  await delay(DELETE_RETRY_DELAY_MS);

  try {
    await deletePushToken(params);
    console.log(`[fcm] ${label} 완료(재시도)`, params ?? "(회원 전체)");
    return true;
  } catch (second) {
    console.error(`[fcm] ${label} 재시도 실패 — 서버에 등록이 남는다`, second);
    return false;
  }
};

/**
 * 이 기기에 등록된 FCM 토큰만 서버에서 삭제한다 (로그아웃용).
 *
 * ⚠️ 현재 값이 아니라 **서버에 실제로 등록했던 값**(`registeredToken` /
 *    `registeredDeviceId`)으로 지운다. 토큰이 갱신됐거나 식별자가 바뀐 뒤라면
 *    현재 값으로는 서버의 행을 못 찾는다.
 *
 * ⚠️ 두 값 중 하나라도 비면 **호출하지 않는다.** 서버는 하나만 받으면 회원의
 *    모든 기기 토큰을 지우므로, 다른 기기의 알림까지 끊는 것보다 이 기기 등록이
 *    남는 편이 낫다(다음 로그인 때 재등록으로 정리된다).
 *
 * @returns 삭제 성공 여부. 지울 게 없어 skip 한 경우도 true (남은 등록이 없다는 뜻).
 */
export const deleteFcmTokenForThisDevice = async (): Promise<boolean> => {
  const { registeredToken, registeredDeviceId } = useFcmStore.getState();

  if (!registeredToken || !registeredDeviceId) {
    console.log("[fcm] 서버에 등록된 기록이 없어 기기 토큰 삭제 skip", {
      registeredToken,
      registeredDeviceId,
    });
    return true;
  }

  return runDelete(
    { fcmToken: registeredToken, deviceType: registeredDeviceId },
    "기기 토큰 삭제"
  );
};

/**
 * 회원의 **모든 기기** FCM 토큰을 서버에서 삭제한다 (탈퇴용).
 *
 * 파라미터 없이 호출하면 서버가 전체 삭제로 처리한다.
 * 탈퇴는 계정 자체가 사라지므로 다른 기기 등록도 남기면 안 된다.
 */
export const deleteAllFcmTokens = async (): Promise<boolean> =>
  runDelete(undefined, "회원 전체 토큰 삭제");

/** 재동기화 중복 실행 방지 (visibilitychange 는 연달아 발생할 수 있다) */
let resyncInFlight: Promise<void> | null = null;

/**
 * 종전 버전이 `deviceType` 자리에 넣던 고정값.
 * 기기 식별자가 아니라 "웹 클라이언트"라는 의미였다 — 즉 한 회원의 모든 기기가 이 값 하나로 뭉쳐 있었다.
 */
const LEGACY_DEVICE_TYPE = "WEB";

/**
 * 종전 버전이 남긴 등록이면 그때 등록했던 FCM 토큰을, 아니면 null 을 반환한다.
 *
 * 판정 근거: `registeredDeviceId` 는 이번 버전에서 추가된 필드다.
 * 등록 기록(`registeredToken`)은 있는데 이 값만 비어 있다면 종전 버전이 남긴 등록이다.
 *
 * boolean 이 아니라 토큰을 돌려주는 이유 — 호출부가 판정과 토큰 추출을 각각 하면
 * 같은 판정이 두 곳으로 갈라진다. 한 곳에서 판정하고 필요한 값까지 함께 넘긴다.
 */
const getLegacyRegisteredToken = (): string | null => {
  const { registeredToken, registeredDeviceId } = useFcmStore.getState();
  return registeredToken && !registeredDeviceId ? registeredToken : null;
};

/**
 * 종전 버전이 `"WEB"` 으로 등록해 둔 기록을 정리한다 (배포 1회성 마이그레이션).
 *
 * 이번 버전부터 `deviceType` 자리에 기기 식별자를 보낸다. 그런데 배포만으로는 FCM 토큰이
 * 갱신되지 않으므로, 그냥 새 값으로 등록하면 **같은 토큰이 옛 행(`"WEB"`)과 새 행(deviceId)에
 * 동시에** 남는다 → 같은 기기에 푸시가 두 번 간다.
 *
 * 대상 판별은 `getLegacyRegisteredToken()` 이 한다.
 *
 * ⚠️ 삭제에 실패하면 정리하지 않고 다음 기회로 미룬다.
 *    옛 행은 살아 있어 푸시가 계속 도달하므로 사용자 피해가 없고,
 *    억지로 재등록하면 오히려 중복 발송이 된다.
 *
 * @returns 정리를 수행했는지 여부. true 면 호출부가 새 식별자로 재등록해야 한다.
 */
const cleanupLegacyRegistration = async (): Promise<boolean> => {
  const legacyToken = getLegacyRegisteredToken();
  if (!legacyToken) return false;

  const deleted = await runDelete(
    { fcmToken: legacyToken, deviceType: LEGACY_DEVICE_TYPE },
    "레거시(WEB) 등록 삭제"
  );

  if (!deleted) {
    console.warn("[fcm] 레거시 등록 삭제 실패 — 정리를 다음 기회로 미룬다");
    return false;
  }

  // 서버 등록을 지웠으므로 로컬 기록도 비운다(안 그러면 뒤이은 재등록이 skip 된다)
  useFcmStore.getState().reset();
  console.log("[fcm] 레거시(WEB) 등록 정리 완료", { token: legacyToken });
  return true;
};

/**
 * 기기 식별자를 네이티브 값으로 **승격**한다 (`local` → `native`).
 *
 * 웹이 자체 생성한 UUID(`local`)는 앱을 재설치하면 사라져, 같은 기기가 서버에 새 기기로
 * 등록된다(유령 기기 누적). 네이티브가 주는 값은 기기에 묶여 있어 재설치에도 유지되므로,
 * 네이티브 지원이 생긴 뒤에는 그쪽으로 갈아타는 편이 정확하다.
 *
 * ⚠️ **반드시 옛 등록을 지운 뒤 교체한다.**
 *    deviceId 를 그냥 바꾸면 서버는 새 기기로 인식하는데, 앱 업데이트로는 FCM 토큰이
 *    갱신되지 않으므로 **같은 토큰이 옛/새 기기 행에 동시에** 남는다 → 푸시가 두 번 간다.
 *    삭제에 실패하면 교체하지 않고 다음 기회로 미룬다(중복 발송보다 승격 지연이 낫다).
 *
 * ⚠️ 로그인 상태에서만 호출한다 — 삭제 API 에 인증이 필요하다.
 *
 * @returns 승격을 수행했는지 여부. true 면 호출부가 새 식별자로 재등록해야 한다.
 */
const promoteDeviceIdIfPossible = async (): Promise<boolean> => {
  const record = await getDeviceIdRecord();
  if (record.source === "native") return false; // 이미 정확한 값

  const nativeId = await issueNativeDeviceId();
  // 네이티브 미지원(구버전 앱·브라우저)이거나 값이 같으면 할 일 없음
  if (!nativeId || nativeId === record.id) return false;

  const { registeredToken, registeredDeviceId } = useFcmStore.getState();

  // 서버에 등록된 적이 없으면 지울 것도 없다 → 바로 교체
  if (!registeredToken || !registeredDeviceId) {
    await replaceDeviceId({ id: nativeId, source: "native" });
    console.log("[fcm] 기기 식별자 승격(서버 등록 없음)", {
      old: record.id,
      new: nativeId,
    });
    return true;
  }

  const deleted = await runDelete(
    { fcmToken: registeredToken, deviceType: registeredDeviceId },
    "승격 전 옛 기기 등록 삭제"
  );

  if (!deleted) {
    console.warn("[fcm] 옛 기기 등록 삭제 실패 — 승격을 다음 기회로 미룬다");
    return false;
  }

  await replaceDeviceId({ id: nativeId, source: "native" });
  // 서버 등록을 지웠으므로 로컬 등록 기록도 비운다.
  // 안 그러면 뒤이은 syncFcmToken 이 "이미 등록됨"으로 보고 재등록을 건너뛴다.
  useFcmStore.getState().reset();
  console.log("[fcm] 기기 식별자 승격 완료", {
    old: record.id,
    new: nativeId,
  });
  return true;
};

/**
 * FCM 등록 상태를 서버와 다시 맞춘다. 세 가지를 순서대로 확인한다.
 *
 *   1) **레거시 등록 정리** — 종전 버전이 `"WEB"` 으로 등록해 둔 기록을 지운다
 *      (`cleanupLegacyRegistration`). 배포 직후 1회만 걸린다.
 *   2) **기기 식별자 승격** — `local` UUID 를 쓰고 있는데 네이티브 값을 받을 수 있게 됐다면
 *      정확한 값으로 갈아탄다 (`promoteDeviceIdIfPossible`).
 *   3) **토큰 로테이션** — 아래 설명.
 *
 * 앞 단계가 수행되면 그 자리에서 재등록하므로 뒤 단계는 확인할 필요가 없다.
 *
 * FCM 토큰은 앱 재설치·데이터 삭제·장기 미사용 등으로 언제든 로테이션된다.
 * 실기기에서 그 시점을 알려주는 것은 네이티브의 `onNewToken` 콜백인데, WebView 안의 웹은
 * 그 이벤트를 볼 수 없다. 그래서 **앱이 포그라운드로 돌아올 때마다 직접 대조**한다.
 * (네이티브가 갱신을 통지해 주면 실시간이 되지만, 없어도 이 경로로 복구된다)
 *
 * 이걸 안 하면 로그인 시점에 등록한 토큰이 죽은 뒤로 서버가 계속 그 토큰에 발송하고,
 * 사용자는 다음 로그인까지 알림을 못 받는다.
 *
 * ⚠️ 삭제가 실패해도 새 토큰 등록은 진행한다.
 *    옛 토큰은 이미 죽어 있어 발송돼도 도달하지 않는다 — 남은 행은 쓰레기일 뿐이다.
 *    반면 새 토큰을 등록하지 않으면 알림이 아예 끊긴다. 등록 쪽이 우선이다.
 *
 * 호출 전 로그인 여부를 확인해야 한다(미로그인 시 401). 판정은 훅이 담당한다.
 *
 * 호출부가 `void resyncFcmRegistration()` 으로 던져두므로 **reject 하지 않는다.**
 * (`promoteDeviceIdIfPossible` → `getDeviceIdRecord()` 가 rethrow 할 수 있어 아래에서 받는다)
 */
export const resyncFcmRegistration = async (): Promise<void> => {
  if (resyncInFlight) return resyncInFlight;

  resyncInFlight = (async () => {
    // 1) 레거시("WEB") 등록 정리 — 배포 직후 1회. 지운 뒤 현재 식별자로 다시 등록한다
    if (await cleanupLegacyRegistration()) {
      await syncFcmToken();
      return;
    }

    // 2) 기기 식별자 승격 — 성공하면 새 식별자로 등록하고 끝낸다
    if (await promoteDeviceIdIfPossible()) {
      await syncFcmToken();
      return;
    }

    // 3) 토큰 로테이션 확인
    const { registeredToken, registeredDeviceId } = useFcmStore.getState();
    const currentToken = await issueFcmToken();

    // 발급 실패(권한 거부 등)면 손댈 게 없다. 등록된 것을 지우지도 않는다 —
    // 일시적 실패로 멀쩡한 등록을 날리면 알림만 끊긴다.
    if (!currentToken) return;

    // 등록된 적이 없으면 로테이션이 아니라 최초 등록이다 → syncFcmToken 에 맡긴다
    if (!registeredToken || !registeredDeviceId) {
      await syncFcmToken();
      return;
    }

    if (registeredToken === currentToken) return; // 그대로 — 할 일 없음

    console.log("[fcm] 토큰 로테이션 감지 — 재등록", {
      old: registeredToken,
      new: currentToken,
    });

    // 옛 등록 삭제 → 새 토큰 등록. 삭제 실패해도 등록은 진행한다(위 주석 참고).
    await runDelete(
      { fcmToken: registeredToken, deviceType: registeredDeviceId },
      "로테이션 전 토큰 삭제"
    );
    await syncFcmToken();
  })()
    .catch((err: unknown) => {
      // fire-and-forget 으로 호출되므로 여기서 흡수한다(unhandled rejection 방지)
      console.error("[fcm] 재동기화 실패", err);
    })
    .finally(() => {
      resyncInFlight = null;
    });

  return resyncInFlight;
};
