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
    };
  }
}

const isBridgeAvailable = (): boolean =>
  typeof window !== "undefined" && !!window.BarogagiApp;

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
