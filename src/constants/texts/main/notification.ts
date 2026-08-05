/**
 * 알림 화면 텍스트 상수
 */

/**
 * 알림 분류 탭.
 *
 * ⚠️ **지금은 화면에 안 보인다.** 항목이 하나뿐이라 `NotificationPage` 가 렌더를 건너뛴다.
 *    서버에 알림 내역 API 가 생기면(다가오는 일정 알림 등) 여기에 한 줄 추가하는 것만으로
 *    필터 칩 줄이 자동으로 나타난다. 구조를 미리 잡아둔 이유다.
 */
export const NOTIFICATION_TABS = [
  { key: "notice", label: "공지" },
] as const;

export type NotificationTabKey = (typeof NOTIFICATION_TABS)[number]["key"];

export const NOTIFICATION_TEXT = {
  IMPORTANT_BADGE: "중요",
  UNREAD_LABEL: "읽지 않음",
  EMPTY: "받은 알림이 없어요",
  ERROR: "알림을 불러오지 못했어요.\n잠시 후 다시 시도해주세요.",
  DETAIL_ERROR: "내용을 불러오지 못했어요.",
} as const;
