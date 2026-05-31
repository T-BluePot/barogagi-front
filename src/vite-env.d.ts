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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
