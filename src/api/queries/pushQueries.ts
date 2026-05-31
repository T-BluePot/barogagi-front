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
 */
export const registerPushToken = async (payload: PushTokenRequestType) => {
  const response = await http.post<BaseResponse<unknown>>(
    ENDPOINTS.PUSH.TOKEN,
    payload
  );
  return response.data;
};
