import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import toast from "react-hot-toast";
import { getFirebaseMessaging } from "@/lib/firebase";

/**
 * FCM 포그라운드 메시지 수신 훅
 *
 * 앱이 포그라운드(화면에 떠 있는 상태)일 때 도착한 푸시는 OS 알림으로 표시되지 않으므로,
 * onMessage로 직접 받아 toast로 사용자에게 보여준다.
 * 백그라운드 푸시는 service worker(firebase-messaging-sw.js)가 처리하므로 여기선 다루지 않는다.
 *
 * - getFirebaseMessaging()이 null이면(미지원 브라우저/ config 미설정) 아무 동작도 하지 않는다.
 * - StrictMode 이중 마운트 및 언마운트 대비: cancelled 플래그로 구독 차단, cleanup에서 unsubscribe 호출.
 * - 앱 생애에 1회만 구독한다(빈 의존성 배열).
 */
export const useFcmForegroundMessage = () => {
  useEffect(() => {
    // 언마운트 이후에 Promise가 늦게 resolve돼도 구독하지 않도록 막는 플래그
    let cancelled = false;
    // onMessage가 반환하는 구독 해제 함수 보관
    let unsubscribe: (() => void) | null = null;

    getFirebaseMessaging().then((messaging) => {
      // 미지원/미설정이거나, 이미 언마운트됐으면 구독하지 않음
      if (!messaging || cancelled) return;

      unsubscribe = onMessage(messaging, (payload) => {
        const { title, body } = payload.notification ?? {};
        // 표시할 내용이 전혀 없으면 무시
        if (!title && !body) return;
        // 제목+본문을 합쳐 한 toast로 표시
        toast([title, body].filter(Boolean).join("\n"));
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);
};
