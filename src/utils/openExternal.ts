/**
 * 외부 URL 열기.
 *
 * - 앱(WebView) 환경: window.BarogagiApp.openExternal 경유 → 시스템 브라우저로 열림
 * - 브라우저 환경: window.open으로 새 탭 (기존 동작 유지)
 *
 * RN WebView는 새 탭 개념이 없어 window.open이 무시되거나 깨짐.
 * 외부 링크는 반드시 이 유틸을 통해 열어야 함.
 */
export const openExternal = (url: string): void => {
  if (window.BarogagiApp) {
    void window.BarogagiApp.openExternal(url);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
};
