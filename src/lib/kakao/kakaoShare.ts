/**
 * 카카오톡 공유하기 (Kakao JavaScript SDK)
 *
 * - SDK는 최초 공유 시점에 동적 로드한다(초기 번들·부팅에 영향 없음).
 * - VITE_KAKAO_JS_KEY 가 없으면 로드를 skip 하고 null 을 반환한다 → 호출부에서 버튼 비활성 처리.
 * - 카카오는 "플랫폼 > Web > 사이트 도메인"에 등록되지 않은 도메인의 요청을 차단하므로,
 *   배포 도메인(fitpl.xyz / test.fitpl.xyz / localhost)이 등록돼 있어야 동작한다.
 *
 * ⚠️ RN WebView 안에서의 동작은 미검증이다.
 *   카카오 공유는 커스텀 스킴으로 카카오톡 앱을 여는 방식이라 WebView가 막을 수 있다.
 *   (이 앱은 같은 이유로 OAuth 로그인을 네이티브 Custom Tab 브릿지로 전환한 전례가 있다)
 *   실기기에서 확인 후 필요하면 브릿지(openExternal) 경유로 우회할 것.
 */

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
    return true;
  } catch {
    // 미등록 도메인 차단 등 SDK 내부 오류
    return false;
  }
};
