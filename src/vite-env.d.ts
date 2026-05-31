/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_KEY: string;
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
