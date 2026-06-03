/**
 * Firebase 웹 SDK 초기화 (FCM 전용)
 *
 * 브릿지 없는 브라우저 환경에서 실제 FCM 토큰을 발급하기 위한 인프라 계층.
 * 실기기(RN WebView 브릿지 환경)에선 네이티브가 토큰을 발급하므로 이 모듈은 쓰이지 않는다.
 *
 * - getAnalytics는 호출하지 않는다 (푸시만 필요 — 번들 절감).
 * - initializeApp / getMessaging은 모두 lazy 싱글톤으로 최초 호출 시에만 초기화한다.
 * - config 필수값이 비거나 브라우저가 messaging을 미지원하면 null을 반환해(throw 금지)
 *   미설정 dev 환경을 방어한다. (절대 더미값으로 채우지 않는다)
 */

import { initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

const env = import.meta.env;

/** env에서 구성한 Firebase config. 값이 없으면 undefined로 남긴다(더미값 금지). */
const firebaseConfig: FirebaseOptions = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

/** 웹 푸시 인증서(VAPID) 공개키. getToken() 호출에 필수. */
export const getVapidKey = (): string => env.VITE_FIREBASE_VAPID_KEY ?? "";

/** 초기화에 필요한 필수 config가 모두 채워졌는지 검사 */
const hasRequiredConfig = (): boolean =>
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.projectId &&
  !!firebaseConfig.messagingSenderId &&
  !!firebaseConfig.appId;

let firebaseApp: FirebaseApp | null = null;

/** Firebase App lazy 싱글톤. config 미설정 시 null. */
const getFirebaseApp = (): FirebaseApp | null => {
  if (!hasRequiredConfig()) {
    console.warn("[firebase] config 미설정 — 초기화를 skip합니다.");
    return null;
  }
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
  }
  return firebaseApp;
};

let messagingInstance: Messaging | null = null;

/**
 * FCM Messaging 인스턴스를 반환한다.
 *
 * - 브라우저가 messaging을 미지원하거나 config가 비면 null 반환(throw 금지).
 * - 최초 호출 시에만 getMessaging을 실행하는 lazy 싱글톤.
 */
export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (messagingInstance) return messagingInstance;

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    console.warn("[firebase] 현재 브라우저는 FCM(messaging)을 지원하지 않습니다.");
    return null;
  }

  const app = getFirebaseApp();
  if (!app) return null;

  messagingInstance = getMessaging(app);
  return messagingInstance;
};

/**
 * Firebase config를 서비스워커 등록 URL 쿼리스트링으로 직렬화한다.
 *
 * 서비스워커(firebase-messaging-sw.js)는 정적 파일이라 import.meta.env에 접근할 수 없으므로,
 * 등록 시 URL 쿼리로 config를 주입받아 self.location.search에서 파싱한다.
 */
export const buildSwConfigQuery = (): string => {
  const params = new URLSearchParams();
  // undefined 값은 쿼리에서 제외 (더미값 금지)
  Object.entries(firebaseConfig).forEach(([key, value]) => {
    if (value) params.set(key, String(value));
  });
  return params.toString();
};
