/**
 * OAuth 소셜 로그인 시작 유틸
 *
 * 환경은 `window.BarogagiApp` 존재 여부로 판별한다.
 * - 네이티브 앱(WebView, BarogagiApp 존재):
 *   - `loginWithOAuth` 지원: 인앱 Custom Tab(`InAppBrowser.openAuth`)으로 띄운다.
 *     외부 크롬으로 새지 않으므로 `barogagiapp://` 콜백 딥링크가 유실되지 않는다.
 *     네이티브가 돌려준 콜백 URL에서 쿼리스트링만 뽑아 기존 콜백 페이지가 처리하도록 반환한다.
 *   - `loginWithOAuth` 미지원(구버전 앱): 여기서 `window.location.href`로 폴백하면 외부 크롬으로
 *     새서 콜백 유실(회색 화면)이 재발한다. → 폴백하지 않고 명시적으로 실패시켜 앱 업데이트를 유도한다.
 * - 브라우저(BarogagiApp 없음): 표준 웹 리다이렉트(`window.location.href`). 페이지가 떠나므로 반환값은 null.
 *
 * 콜백 URL은 host가 `auth`(barogagiapp://auth/oauth/callback)이든 `oauth`이든 상관없다.
 * 웹은 host를 보지 않고 쿼리스트링(토큰 등)만 읽으므로 백엔드/앱의 host 합의와 무관하게 동작한다.
 */

/** 구버전 앱(BarogagiApp은 있으나 loginWithOAuth 미지원) — 앱 업데이트 유도용 에러 */
export class OAuthBridgeUnsupportedError extends Error {
  constructor() {
    super("최신 버전으로 업데이트한 뒤 다시 시도해주세요.");
    this.name = "OAuthBridgeUnsupportedError";
  }
}

export const startOAuthLogin = async (
  authorizeUrl: string
): Promise<string | null> => {
  const bridge = window.BarogagiApp;

  // 네이티브 앱 환경: BarogagiApp 존재로 판별
  if (bridge) {
    // 구버전 앱은 loginWithOAuth 미지원 → 브라우저 리다이렉트로 폴백 금지(외부 크롬 → 콜백 유실 재발)
    if (typeof bridge.loginWithOAuth !== "function") {
      throw new OAuthBridgeUnsupportedError();
    }

    const callbackUrl = await bridge.loginWithOAuth(authorizeUrl);
    if (!callbackUrl) return null; // 사용자가 Custom Tab을 닫음(취소)

    // 커스텀 스킴(barogagiapp://...)에서 쿼리스트링만 추출 — host와 무관, 엔진 의존 없음
    const queryIndex = callbackUrl.indexOf("?");
    return queryIndex >= 0 ? callbackUrl.slice(queryIndex) : "";
  }

  // 진짜 브라우저 환경: 표준 리다이렉트 (페이지가 떠나므로 이후 코드는 실행되지 않음)
  window.location.href = authorizeUrl;
  return null;
};
