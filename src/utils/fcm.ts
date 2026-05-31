/**
 * FCM(푸시 알림) 토큰 발급 유틸
 *
 * 이 앱은 RN WebView 하이브리드라 FCM 토큰은 네이티브가 발급해 브릿지로 넘긴다.
 *
 * 토큰 출처 우선순위:
 *   1) RN 브릿지: window.BarogagiApp.getFcmToken() — 실기기 환경
 *   2) 브라우저 fallback: import.meta.env.VITE_FCM_TEST_TOKEN — 브릿지 없는 dev 환경 테스트용
 *
 * 서버 등록 API 연동은 다음 단계 — 현재는 발급 + fcmStore 저장까지만 수행한다.
 * 브릿지 명세는 docs/RN_BRIDGE.md 참고.
 */

import { useFcmStore } from "@/stores/fcmStore";

/** 네이티브 브릿지가 FCM 토큰 발급을 지원하는지 (RN 미구현 단계 방어) */
const isBridgeFcmAvailable = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.BarogagiApp?.getFcmToken === "function";

/**
 * FCM 토큰을 발급(획득)한다.
 *
 * - 브릿지 환경: 네이티브 토큰만 신뢰. null(권한 거부 등)이면 테스트 토큰으로 대체하지 않음.
 * - 브라우저 환경: VITE_FCM_TEST_TOKEN을 사용. 비어 있으면 null.
 *
 * @returns 발급된 토큰. 발급 불가 시 null.
 */
export const issueFcmToken = async (): Promise<string | null> => {
  if (isBridgeFcmAvailable()) {
    try {
      return await window.BarogagiApp!.getFcmToken!();
    } catch (err) {
      console.error("[fcm] 브릿지 토큰 발급 실패", err);
      return null;
    }
  }

  // 브릿지 없는 환경(브라우저 직접 접속) — 테스트 토큰 fallback
  const testToken = import.meta.env.VITE_FCM_TEST_TOKEN;
  return testToken && testToken.length > 0 ? testToken : null;
};

/**
 * FCM 토큰을 발급해 fcmStore에 동기화한다.
 * 로그인 완료 직후 fire-and-forget으로 호출한다 (인증된 사용자 대상).
 *
 * 발급 → store 저장까지만 수행하며, 서버 등록은 다음 단계에서 이 함수 안에 추가한다.
 */
export const syncFcmToken = async (): Promise<void> => {
  const store = useFcmStore.getState();
  const token = await issueFcmToken();

  if (!token) {
    store.setStatus("error");
    return;
  }

  store.setToken(token);

  // TODO(다음 단계): 서버 등록 API 연동
  //   - store.registeredToken과 비교해 미등록/토큰 변경 시에만 등록 요청
  //   - 요청 전 store.setStatus("registering"), 성공 시 store.markRegistered(token)
};
