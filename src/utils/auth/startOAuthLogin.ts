/**
 * OAuth 소셜 로그인 시작 유틸
 *
 * - 네이티브 앱(WebView): `window.BarogagiApp.loginWithOAuth` 브릿지로 인앱 Custom Tab을 띄운다.
 *   외부 크롬으로 새지 않으므로 `barogagiapp://` 콜백 딥링크가 유실되지 않는다.
 *   네이티브가 돌려준 콜백 URL에서 쿼리스트링만 뽑아, 기존 콜백 페이지가 처리하도록 반환한다.
 * - 브라우저: 표준 웹 리다이렉트(`window.location.href`). 페이지가 떠나므로 반환값은 의미 없음(null).
 *
 * 콜백 URL은 host가 `auth`(barogagiapp://auth/oauth/callback)이든 `oauth`이든 상관없다.
 * 웹은 host를 보지 않고 쿼리스트링(토큰 등)만 읽으므로 백엔드/앱의 host 합의와 무관하게 동작한다.
 */
export const startOAuthLogin = async (
  authorizeUrl: string
): Promise<string | null> => {
  // 네이티브 앱: 인앱 Custom Tab으로 열고 콜백 URL을 받아온다.
  if (typeof window.BarogagiApp?.loginWithOAuth === "function") {
    const callbackUrl = await window.BarogagiApp.loginWithOAuth(authorizeUrl);
    if (!callbackUrl) return null; // 사용자가 Custom Tab을 닫음(취소)

    // 커스텀 스킴(barogagiapp://...)에서 쿼리스트링만 추출 — host와 무관, 엔진 의존 없음
    const queryIndex = callbackUrl.indexOf("?");
    return queryIndex >= 0 ? callbackUrl.slice(queryIndex) : "";
  }

  // 브라우저: 표준 리다이렉트 (페이지가 떠나므로 이후 코드는 실행되지 않음)
  window.location.href = authorizeUrl;
  return null;
};
