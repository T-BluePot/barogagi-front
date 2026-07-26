/**
 * 푸시 알림(Push) 관련 API 요청 함수
 */

import { http } from "../client";
import { ENDPOINTS } from "../endpoints";

// === request body type ===
import type { BaseResponse, PushTokenRequestType } from "../types";

/**
 * FCM 토큰 등록
 * 인증된 사용자 대상이므로 accessToken이 자동 주입되는 http 인스턴스를 사용한다.
 *
 * 실패를 의도적으로 삼키는 fire-and-forget 요청이다(utils/fcm.ts).
 * 로그인 직후 호출되므로 전역 오류 화면으로 승격되면 로그인 플로우가 막힌다.
 * → `_skipGlobalError` 로 승격에서 제외한다.
 */
export const registerPushToken = async (payload: PushTokenRequestType) => {
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.PUSH.TOKEN,
    payload,
    { _skipGlobalError: true }
  );
  return response.data;
};
