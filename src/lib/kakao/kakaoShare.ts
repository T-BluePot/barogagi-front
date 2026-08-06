/**
 * 카카오톡 공유하기 (Kakao JavaScript SDK)
 *
 * - SDK는 최초 공유 시점에 동적 로드한다(초기 번들·부팅에 영향 없음).
 * - VITE_KAKAO_JS_KEY 가 없으면 로드를 skip 하고 null 을 반환한다 → 호출부에서 버튼 비활성 처리.
 * - 카카오는 "플랫폼 > Web > 사이트 도메인"에 등록되지 않은 도메인의 요청을 차단하므로,
 *   배포 도메인(fitpl.xyz / test.fitpl.xyz / localhost)이 등록돼 있어야 동작한다.
 *
 * ⚠️ RN WebView(앱)에서는 카카오톡이 열리지 않는다 — 실기기에서 확인됨.
 *   SDK 2.7.5 는 Android 에서 아래 URL 로 `location.href` 이동해 카카오톡을 연다:
 *     intent://send?...#Intent;scheme=kakaolink;launchFlags=0x14008000;package=com.kakao.talk;end;
 *   RN 의 `Linking.openURL` 은 내부적으로 `Uri.parse` 를 쓰기 때문에 `intent://` 를 해석하지
 *   못하고 실패하는데, RN 측 위임 코드와 SDK 양쪽이 이 실패를 `catch {}` 로 삼킨다
 *   (SDK: `try { Wr(n) } catch (e) {}`). 그래서 예외도 안 나고 화면도 그대로다 = 무반응.
 *
 *   근본 해결은 앱 측에서 `intent://` 를 `Intent.parseUri(url, URI_INTENT_SCHEME)` 로 처리하는
 *   것이라 스토어 배포가 필요하다(docs/RN_BRIDGE.md §11). 이미 설치된 빌드는 못 고친다.
 *   → 웹은 "앱 전환이 실제로 일어났는지"를 관찰해 실패를 감지하고, 호출부가 링크 복사로
 *     폴백할 수 있게 false 를 돌려준다. 죽은 버튼을 남기지 않는 것이 목적이다.
 */

import { isNativeApp } from "@/utils/bridgeStorage";

const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";
// 위 URL의 실제 파일에서 계산한 해시 (CDN 변조 방지)
const KAKAO_SDK_INTEGRITY =
  "sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6";

interface KakaoLink {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoFeedTemplate {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: KakaoLink;
  };
  buttons?: { title: string; link: KakaoLink }[];
}

interface KakaoTextTemplate {
  objectType: "text";
  text: string;
  link: KakaoLink;
  buttonTitle?: string;
}

type KakaoTemplate = KakaoFeedTemplate | KakaoTextTemplate;

interface KakaoSdk {
  init: (jsKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (template: KakaoTemplate) => void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

/** 앱키가 주입돼 있어야 카카오 공유를 노출한다. */
export const isKakaoShareConfigured = (): boolean =>
  Boolean(import.meta.env.VITE_KAKAO_JS_KEY);

let sdkPromise: Promise<KakaoSdk | null> | null = null;

/** SDK 스크립트를 한 번만 로드하고 init 까지 마친 인스턴스를 돌려준다. */
const loadKakaoSdk = (): Promise<KakaoSdk | null> => {
  if (sdkPromise) return sdkPromise;

  const jsKey = import.meta.env.VITE_KAKAO_JS_KEY;
  if (!jsKey) return Promise.resolve(null);

  sdkPromise = new Promise<KakaoSdk | null>((resolve) => {
    // 이미 로드된 경우(스크립트 중복 삽입 방지)
    if (window.Kakao) {
      resolve(window.Kakao);
      return;
    }

    const script = document.createElement("script");
    script.src = KAKAO_SDK_URL;
    script.integrity = KAKAO_SDK_INTEGRITY;
    script.crossOrigin = "anonymous";
    script.async = true;

    script.onload = () => resolve(window.Kakao ?? null);
    // 네트워크 차단·integrity 불일치 등으로 실패해도 앱이 죽지 않도록 null 로 흡수
    script.onerror = () => {
      sdkPromise = null; // 다음 시도에서 재로드할 수 있게 초기화
      resolve(null);
    };

    document.head.appendChild(script);
  }).then((sdk) => {
    if (!sdk) return null;
    if (!sdk.isInitialized()) sdk.init(jsKey);
    return sdk;
  });

  return sdkPromise;
};

/**
 * 카카오톡으로 전환됐다고 인정할 최대 대기 시간.
 * 전환에 성공하면 WebView 가 백그라운드로 내려가며 즉시 이벤트가 뜬다.
 * 실패했을 때 사용자가 폴백 안내를 받기까지의 체감 지연이기도 해서 짧게 잡는다.
 */
const APP_SWITCH_TIMEOUT_MS = 1200;

/**
 * 카카오톡으로 실제 전환됐는지 관찰한다.
 *
 * SDK 도 RN 도 스킴 실패를 삼키기 때문에 반환값·예외로는 성공 여부를 알 수 없다.
 * 대신 "다른 앱이 앞으로 나왔는가"를 본다 — 전환에 성공하면 WebView 가 가려지면서
 * visibilitychange(hidden) 또는 pagehide 가 뜬다.
 *
 * blur 는 보지 않는다. 키보드 표시·포커스 이동만으로도 떠서 오탐이 난다.
 *
 * @returns 제한 시간 안에 백그라운드로 내려갔으면 true.
 */
const waitForAppSwitch = (): Promise<boolean> =>
  new Promise((resolve) => {
    let settled = false;

    const cleanup = () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      clearTimeout(timer);
    };

    const settle = (switched: boolean) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(switched);
    };

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") settle(true);
    }
    function handlePageHide() {
      settle(true);
    }

    const timer = setTimeout(() => settle(false), APP_SWITCH_TIMEOUT_MS);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
  });

interface ShareToKakaoParams {
  /** 공유할 링크 (서버가 발급한 공유 URL) */
  url: string;
  /** 카드 제목 — 일정 이름 */
  title: string;
  description?: string;
  /** 있으면 feed 템플릿, 없으면 text 템플릿을 쓴다 (feed는 imageUrl이 필수) */
  imageUrl?: string;
  buttonTitle?: string;
}

/**
 * 카카오톡 공유창을 띄운다.
 * @returns 성공 여부. false 면 호출부가 fallback(링크 복사 등)을 안내할 것.
 */
export const shareToKakao = async ({
  url,
  title,
  description = "",
  imageUrl,
  buttonTitle,
}: ShareToKakaoParams): Promise<boolean> => {
  const sdk = await loadKakaoSdk();
  if (!sdk) return false;

  const link: KakaoLink = { mobileWebUrl: url, webUrl: url };

  const template: KakaoTemplate = imageUrl
    ? {
        objectType: "feed",
        content: { title, description, imageUrl, link },
        ...(buttonTitle ? { buttons: [{ title: buttonTitle, link }] } : {}),
      }
    : {
        objectType: "text",
        text: description ? `${title}\n${description}` : title,
        link,
        ...(buttonTitle ? { buttonTitle } : {}),
      };

  try {
    sdk.Share.sendDefault(template);
  } catch {
    // 미등록 도메인 차단 등 SDK 내부 오류
    return false;
  }

  // 브라우저에서는 스킴 전환이 정상 동작하고, PC 는 아예 팝업(로그인/QR)으로 뜬다.
  // 관찰이 오탐만 만들 수 있어 앱(WebView) 환경에서만 전환 성공을 검증한다.
  if (!isNativeApp()) return true;

  return waitForAppSwitch();
};
