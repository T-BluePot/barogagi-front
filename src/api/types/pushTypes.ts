/**
 * 푸시 알림(Push) 관련 API 요청 타입 정의
 */

/** FCM 토큰 등록 요청 Request Body 타입 (3필드 모두 필수) */
export interface PushTokenRequestType {
  fcmToken: string;
  /**
   * ⚠️ 기기 *종류* 가 아니라 **기기 고유 식별자(deviceId)** 다.
   *    백엔드 API 문서상 설명이 로그인의 `deviceId` 와 동일하게
   *    "기기를 식별할 수 있는 고유 데이터". 값은 `utils/deviceId.ts` 의 `getDeviceId()`.
   */
  deviceType: string;
  appVersion: string;
}

/**
 * FCM 토큰 삭제 요청 Query Parameter 타입 (기기 단위 삭제용 — 두 값 모두 필수)
 *
 * ⚠️ 두 필드를 굳이 **둘 다 필수**로 둔 이유:
 *    서버는 `fcmToken` / `deviceType` 중 **하나만** 받으면 해당 회원의 **모든 기기**
 *    토큰을 삭제한다. optional 로 열어두면 한쪽이 빠진 채 호출됐을 때
 *    다른 기기의 알림까지 조용히 끊긴다. 전체 삭제는 파라미터 없이 호출하는
 *    별도 경로(`deleteAllFcmTokens`)로만 하도록 타입으로 갈라둔다.
 */
export interface PushTokenDeleteParamsType {
  fcmToken: string;
  deviceType: string;
}
