import { useBoardListQuery } from "@/hooks/queries/useBoardListQuery";
import { useReadNotificationStore } from "@/stores/readNotificationStore";

/**
 * 안 읽은 공지가 하나라도 있는지 — 헤더 벨 아이콘의 빨간 점 표시에 쓴다.
 *
 * 목록은 알림 화면과 **같은 쿼리 키**라 캐시를 공유한다(알림 화면을 다녀오면 추가 요청 없음).
 * 조회 전/실패 시에는 목록이 비어 있어 자연스럽게 점이 뜨지 않는다 —
 * 확인되지 않은 상태에서 "안 읽음"이라고 단정하지 않기 위함이다.
 *
 * 읽음 목록은 배열째 구독한다. 알림 목록의 각 항목과 달리 이 훅을 쓰는 곳은
 * 헤더 하나뿐이고, 어차피 읽음 목록이 바뀌면 다시 계산해야 한다.
 */
export const useHasUnreadNotice = (): boolean => {
  const { notices } = useBoardListQuery();
  const readIds = useReadNotificationStore((s) => s.readIds);

  return notices.some((notice) => !readIds.includes(notice.boardNum));
};
