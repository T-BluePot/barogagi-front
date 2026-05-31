/* eslint-disable no-undef */
/**
 * Firebase Cloud Messaging 백그라운드 서비스워커
 *
 * 앱이 백그라운드/종료 상태일 때 수신한 푸시를 시스템 알림으로 표시한다.
 * (포그라운드 onMessage 처리는 앱 측 핸들러가 담당)
 *
 * 정적 파일이라 import.meta.env를 쓸 수 없으므로, Firebase config는
 * 등록 URL 쿼리(self.location.search)로 주입받아 파싱한다.
 * 쿼리 직렬화는 src/lib/firebase.ts의 buildSwConfigQuery()가 담당.
 *
 * NOTE: importScripts URL의 버전(12.14.0)은 설치된 firebase 패키지 버전과 일치해야 한다.
 */

importScripts(
  "https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js"
);

// 등록 URL 쿼리에서 Firebase config 파싱
const params = new URLSearchParams(self.location.search);
const firebaseConfig = {
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
  measurementId: params.get("measurementId"),
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  // 백그라운드 푸시 수신 → 시스템 알림 표시
  //
  // payload.notification이 있으면 FCM SDK가 자동으로 알림을 띄우므로,
  // 여기서 또 showNotification을 호출하면 알림이 2번 뜬다(중복).
  // → notification 페이로드가 없는 data-only 메시지에 한해서만 직접 표시한다.
  messaging.onBackgroundMessage((payload) => {
    if (payload.notification) return;

    const data = payload.data || {};
    self.registration.showNotification(data.title || "알림", {
      body: data.body,
      icon: data.icon || "/vite.svg",
    });
  });
}
