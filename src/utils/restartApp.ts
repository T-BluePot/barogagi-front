import { isNativeApp } from "./bridgeStorage";

/**
 * 오류 화면의 복구 액션.
 *
 * - 앱(WebView): `BarogagiApp.exitApp()` → RN 이 앱을 종료한다.
 *   ⚠️ Android 는 종료 후 자동 재실행이 불가하므로 사용자가 직접 다시 열어야 한다
 *   (문구에서 안내한다 — `ERROR_SCREEN_APP_HINT`).
 * - 브라우저: `location.reload()`
 *
 * 앱이지만 브릿지 주입 전일 수 있으므로 `openExternal.ts` 처럼 실체 유무까지 확인하고,
 * 브릿지가 없으면 reload 로 폴백해 사용자가 화면에 갇히지 않게 한다.
 */
export const restartApp = (): void => {
  if (isNativeApp() && window.BarogagiApp) {
    void window.BarogagiApp.exitApp();
    return;
  }
  window.location.reload();
};

/**
 * 앱(WebView) 환경에서는 액션이 "앱 종료"라서 웹의 "다시 시도"(새로고침)와 동작이 다르다.
 * 문구를 환경에 맞게 고르기 위해 화면 쪽에서 사용한다.
 */
export const isAppExitAction = (): boolean =>
  isNativeApp() && !!window.BarogagiApp;
