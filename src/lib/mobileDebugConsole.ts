/**
 * 모바일 디버그 콘솔(eruda) 초기화
 *
 * 모바일(RN WebView/모바일 브라우저)에는 개발자 콘솔이 없어 console.log를 볼 수 없다.
 * eruda는 화면에 떠 있는 콘솔 패널을 띄워 console 출력·네트워크·DOM 등을 확인하게 해준다.
 *
 * 활성화 조건 (운영 빌드 오염 방지를 위해 제한):
 *   1) 개발 모드(import.meta.env.DEV)
 *   2) URL 쿼리에 ?debug 포함 — 배포된 테스트 빌드에서도 토글 가능
 *
 * eruda는 dynamic import라 비활성 시 번들/실행에 포함되지 않는다.
 */
export const initMobileDebugConsole = async (): Promise<void> => {
  if (typeof window === "undefined") return;

  const enabledByQuery = new URLSearchParams(window.location.search).has("debug");
  if (!import.meta.env.DEV && !enabledByQuery) return;

  try {
    const eruda = (await import("eruda")).default;
    eruda.init();
  } catch (err) {
    console.error("[debug] eruda 초기화 실패", err);
  }
};
