import type { StateStorage } from "zustand/middleware";

/**
 * RN WebView 브릿지 스토리지
 *
 * - 앱(WebView) 환경: window.BarogagiApp 경유 → 네이티브 스토리지에 위임
 *   - secure:     EncryptedSharedPreferences (토큰 등 민감 데이터)
 *   - persistent: MMKV (영속 데이터)
 *   - session:    in-memory (앱 종료 시 자동 소멸 — 회원가입/일정 생성 draft 등)
 * - 브라우저 환경(직접 접속): persistent/secure → localStorage, session → sessionStorage
 *
 * 브릿지 명세는 docs/RN_BRIDGE.md 참고.
 */

export type StorageNamespace = "secure" | "persistent" | "session";

declare global {
  interface Window {
    // react-native-webview가 항상 주입하는 메시지 채널.
    // 브릿지(BarogagiApp)보다 먼저 동기적으로 존재하므로 "앱(WebView) 환경" 판별에 사용.
    ReactNativeWebView?: {
      postMessage(message: string): void;
    };
    BarogagiApp?: {
      // === Storage ===
      getData(namespace: StorageNamespace, key: string): Promise<string | null>;
      saveData(
        namespace: StorageNamespace,
        key: string,
        value: string
      ): Promise<void>;
      deleteData(namespace: StorageNamespace, key: string): Promise<void>;
      // === 외부 링크 / 앱 종료 ===
      openExternal(url: string): Promise<void>;
      exitApp(): Promise<void>;
      // === 푸시 알림(FCM) ===
      // 네이티브가 발급/캐싱한 FCM 토큰을 반환. 권한 거부·미발급 시 null.
      // RN 측 미구현 단계가 있을 수 있어 optional — 존재 여부를 확인 후 호출한다.
      getFcmToken?(): Promise<string | null>;
      // === OAuth 소셜 로그인 (인앱 Custom Tab) ===
      // authorizeUrl을 InAppBrowser.openAuth로 인앱 Custom Tab에 띄우고(외부 크롬 X),
      // barogagiapp:// 딥링크로 돌아온 콜백 URL 전체를 반환. 사용자가 닫으면 null.
      // ⚠️ 일반 RPC(3초 timeout) 아님 — 사용자가 로그인할 때까지 기다려야 하므로 RN 측 별도 처리.
      // 브릿지 명세는 docs/RN_BRIDGE.md §10 참고.
      loginWithOAuth?(authorizeUrl: string): Promise<string | null>;
    };
  }
}

const isBridgeAvailable = (): boolean =>
  typeof window !== "undefined" && !!window.BarogagiApp;

/**
 * 앱(WebView) 환경 여부.
 * - react-native-webview가 주입하는 window.ReactNativeWebView 존재로 판별
 * - 이 값은 BarogagiApp 브릿지보다 먼저 동기적으로 존재한다
 */
export const isNativeApp = (): boolean =>
  typeof window !== "undefined" && !!window.ReactNativeWebView;

/**
 * RN 브릿지(window.BarogagiApp) 주입을 기다린다.
 *
 * 앱 부팅 직후에는 BarogagiApp 주입이 페이지 스크립트보다 늦을 수 있다.
 * 이때 secure 저장소 접근이 곧바로 브라우저 fallback(localStorage)으로 빠지면,
 * 네이티브 보안 저장소에 저장된 토큰을 읽지 못해 로그인이 풀린다.
 * → 앱 환경에서는 브릿지가 준비될 때까지 짧게 대기한다.
 *
 * - 이미 사용 가능: 즉시 true
 * - 브라우저(앱 아님): 즉시 false (대기 불필요)
 * - 앱이지만 미주입: timeoutMs까지 polling 후 결과 반환
 */
export const waitForBridge = (
  timeoutMs = 2000,
  intervalMs = 50
): Promise<boolean> => {
  if (isBridgeAvailable()) return Promise.resolve(true);
  if (!isNativeApp()) return Promise.resolve(false);

  return new Promise((resolve) => {
    const start = Date.now();
    const timer = setInterval(() => {
      if (isBridgeAvailable()) {
        clearInterval(timer);
        resolve(true);
      } else if (Date.now() - start >= timeoutMs) {
        clearInterval(timer);
        resolve(false);
      }
    }, intervalMs);
  });
};

/** RN 브릿지에 위임하는 zustand storage 어댑터 */
const createBridgeStorage = (namespace: StorageNamespace): StateStorage => ({
  getItem: async (key) => {
    if (!isBridgeAvailable()) return null;
    try {
      return await window.BarogagiApp!.getData(namespace, key);
    } catch (err) {
      console.error(`[bridgeStorage] getItem failed (${namespace}/${key})`, err);
      return null;
    }
  },
  setItem: async (key, value) => {
    if (!isBridgeAvailable()) return;
    try {
      await window.BarogagiApp!.saveData(namespace, key, value);
    } catch (err) {
      console.error(`[bridgeStorage] setItem failed (${namespace}/${key})`, err);
    }
  },
  removeItem: async (key) => {
    if (!isBridgeAvailable()) return;
    try {
      await window.BarogagiApp!.deleteData(namespace, key);
    } catch (err) {
      console.error(
        `[bridgeStorage] removeItem failed (${namespace}/${key})`,
        err
      );
    }
  },
});

/** 브라우저 표준 Storage(localStorage/sessionStorage)를 zustand 어댑터로 래핑 */
const wrapBrowserStorage = (web: Storage): StateStorage => ({
  getItem: (key) => Promise.resolve(web.getItem(key)),
  setItem: (key, value) => Promise.resolve(web.setItem(key, value)),
  removeItem: (key) => Promise.resolve(web.removeItem(key)),
});

/**
 * namespace에 맞는 스토리지를 반환.
 *
 * 사용 예 (zustand persist):
 *   storage: createJSONStorage(() => getPersistStorage("session"))
 */
export const getPersistStorage = (
  namespace: StorageNamespace
): StateStorage => {
  if (isBridgeAvailable()) return createBridgeStorage(namespace);
  // 브라우저 fallback
  // - session   → sessionStorage (탭 종료 시 휘발)
  // - 그 외     → localStorage (브라우저에선 secure도 평문 저장됨에 유의)
  return wrapBrowserStorage(
    namespace === "session" ? sessionStorage : localStorage
  );
};
