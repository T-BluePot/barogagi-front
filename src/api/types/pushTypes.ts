/**
 * 푸시 알림(Push) 관련 API 요청 타입 정의
 */

/** FCM 토큰 등록 요청 Request Body 타입 (3필드 모두 필수) */
export interface PushTokenRequestType {
  fcmToken: string;
  deviceType: string;
  appVersion: string;
}
