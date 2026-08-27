/**
 * 푸시 알림(Push) 관련 API 요청 함수
 */

import { http } from "../client";
import { ENDPOINTS } from "../endpoints";

// === request body type ===
import type {
  BaseResponse,
  PushTokenRequestType,
  PushTokenDeleteParamsType,
} from "../types";

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

/**
 * FCM 토큰 삭제 (등록과 같은 경로, DELETE 메서드)
 *
 * - `params` 전달 → 해당 기기의 토큰만 삭제 (로그아웃)
 * - `params` 생략 → **해당 회원의 모든 기기** 토큰 삭제 (탈퇴)
 *
 * ⚠️ 서버는 `fcmToken` / `deviceType` 중 **하나만** 받아도 전체 삭제로 처리한다.
 *    부분 파라미터를 만들지 않도록 `PushTokenDeleteParamsType` 이 두 값을 모두 필수로 두고 있다.
 *    (axios 는 `undefined` 인 param 을 쿼리에서 빼므로, 한쪽이 undefined 면 전체 삭제가 된다)
 *
 * 로그아웃/탈퇴 플로우 중 호출되므로 실패가 전역 오류 화면으로 승격되면 안 된다
 * → `_skipGlobalError`. 실패 처리는 호출부(`utils/fcm.ts`)가 담당한다.
 */
export const deletePushToken = async (params?: PushTokenDeleteParamsType) => {
  const response = await http.delete<BaseResponse<unknown>>(
    ENDPOINTS.PUSH.TOKEN,
    { params, _skipGlobalError: true }
  );
  return response.data;
};
