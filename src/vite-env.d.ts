/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_KEY: string;
  /**
   * 서버에 전달하는 배포 환경 값 (LOCAL | TEST | PROD).
   * 서버가 발급할 공유 링크의 도메인을 이 값으로 결정하므로 VITE_API_BASE_URL 이 가리키는
   * 서버와 반드시 일치해야 한다. (예: test.fitpl.xyz 에 붙는 빌드 → TEST)
   * 지정하지 않으면 빌드 모드로 추론한다(PROD 빌드→PROD, 그 외→LOCAL) — TEST 표현 불가.
   */
  readonly VITE_ENVIRONMENT?: "LOCAL" | "TEST" | "PROD";
  /**
   * 카카오 JavaScript 앱키. 카카오톡 공유하기(Kakao.Share) 초기화에 사용한다.
   * 공개용 키이며 보안은 카카오 개발자센터의 "플랫폼 > Web > 사이트 도메인" 등록으로 건다.
   * 미등록 도메인에서의 공유 요청은 카카오가 차단하므로 배포 도메인 등록이 필수.
   * 비어 있으면 SDK 초기화를 skip 하고 카카오 공유 버튼을 비활성 처리한다.
   */
  readonly VITE_KAKAO_JS_KEY?: string;
  /**
   * 브라우저(브릿지 없는) 환경에서 사용할 테스트용 FCM 토큰.
   * RN WebView 브릿지가 없을 때 issueFcmToken()의 fallback 값으로 쓰인다.
   * 실기기(브릿지 환경)에선 무시되고 네이티브가 발급한 토큰이 우선한다.
   */
  readonly VITE_FCM_TEST_TOKEN?: string;
  /**
   * 앱 빌드 버전. FCM 토큰 등록 시 appVersion 필드로 서버에 전송한다.
   * 빌드 시점에 CI/배포 환경에서 주입하는 것을 권장한다.
   */
  readonly VITE_APP_VERSION?: string;
  /**
   * Firebase 웹 SDK config — 브릿지 없는 브라우저 환경에서 실제 FCM 토큰을 발급하기 위함.
   * 실기기(브릿지 환경)에선 네이티브가 토큰을 발급하므로 사용되지 않는다.
   * 필수값(apiKey/projectId/messagingSenderId/appId) 중 하나라도 비면 Firebase 초기화를 skip한다.
   */
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
  /**
   * 웹 푸시 인증서(VAPID) 공개키. getToken() 호출에 필수.
   * 비어 있으면 Firebase 토큰 발급을 skip(null 반환)한다.
   */
  readonly VITE_FIREBASE_VAPID_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
