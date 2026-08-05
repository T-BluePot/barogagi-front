/**
 * 앱 외부로 나가는 고정 링크 모음.
 * 서버가 내려줄 필요 없는 값이라 상수로 관리한다.
 */

/**
 * 핏플 Google Play 스토어 페이지.
 * pcampaignid=web_share 는 구글의 유입 추적 파라미터 — 웹 공유를 통한 설치를 집계한다.
 *
 * TODO: iOS 출시 시 App Store 링크 추가 + 플랫폼 분기 필요.
 *   현재는 Android 링크만 있어 iOS 사용자도 Play 스토어로 가게 된다.
 */
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.bluehp.fitpl&pcampaignid=web_share";
