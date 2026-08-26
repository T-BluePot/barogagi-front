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

import { getDeviceId } from "@/utils/deviceId";

/** 구버전 앱(BarogagiApp은 있으나 loginWithOAuth 미지원) — 앱 업데이트 유도용 에러 */
export class OAuthBridgeUnsupportedError extends Error {
  constructor() {
    super("최신 버전으로 업데이트한 뒤 다시 시도해주세요.");
    this.name = "OAuthBridgeUnsupportedError";
  }
}

/**
 * authorize URL 에 `deviceId` 쿼리를 붙인다.
 *
 * 서버가 내려주는 authorize URL 은 소셜 제공자가 아니라 **우리 백엔드** 엔드포인트다
 * (예: `https://test.fitpl.xyz/oauth2/authorization/google`). 따라서 여기 붙인 `deviceId` 는
 * 우리 서버가 받고, 구글/카카오/네이버 쪽으로는 넘어가지 않는다.
 *
 * `URL` 파싱이 실패하면(절대 URL 이 아닌 등) 문자열로 직접 붙인다 —
 * 여기서 throw 하면 소셜 로그인 자체가 막히므로 어떤 경우에도 URL 을 돌려준다.
 */
const appendDeviceId = (authorizeUrl: string, deviceId: string): string => {
  try {
    const url = new URL(authorizeUrl);
    url.searchParams.set("deviceId", deviceId);
    return url.toString();
  } catch {
    const separator = authorizeUrl.includes("?") ? "&" : "?";
    return `${authorizeUrl}${separator}deviceId=${encodeURIComponent(deviceId)}`;
  }
};

export const startOAuthLogin = async (
  authorizeUrl: string
): Promise<string | null> => {
  const bridge = window.BarogagiApp;

  // deviceId 주입은 분기 이전에 한다 — 앱(Custom Tab)이든 브라우저(리다이렉트)든
  // 실제로 열리는 URL 은 동일하므로, 한 곳에서 붙여야 경로별 누락이 생기지 않는다.
  const targetUrl = appendDeviceId(authorizeUrl, await getDeviceId());

  // 네이티브 앱 환경: BarogagiApp 존재로 판별
  if (bridge) {
    // 구버전 앱은 loginWithOAuth 미지원 → 브라우저 리다이렉트로 폴백 금지(외부 크롬 → 콜백 유실 재발)
    if (typeof bridge.loginWithOAuth !== "function") {
      throw new OAuthBridgeUnsupportedError();
    }

    const callbackUrl = await bridge.loginWithOAuth(targetUrl);
    if (!callbackUrl) return null; // 사용자가 Custom Tab을 닫음(취소)

    // 커스텀 스킴(barogagiapp://...)에서 쿼리스트링만 추출 — host와 무관, 엔진 의존 없음
    const queryIndex = callbackUrl.indexOf("?");
    return queryIndex >= 0 ? callbackUrl.slice(queryIndex) : "";
  }

  // 진짜 브라우저 환경: 표준 리다이렉트 (페이지가 떠나므로 이후 코드는 실행되지 않음)
  window.location.href = targetUrl;
  return null;
};
