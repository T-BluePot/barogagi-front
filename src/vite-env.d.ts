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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
