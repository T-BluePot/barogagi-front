import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { getPersistStorage } from "@/utils/bridgeStorage";

/**
 * 읽은 알림 기록 (기기 로컬)
 *
 * ⚠️ 서버에 읽음 상태 개념이 없어서 기기에 저장한다. 따라서:
 * - 기기를 바꾸거나 앱을 지우면 전부 "안 읽음"으로 돌아온다
 * - 여러 기기에서 동기화되지 않는다
 * 서버에 알림 내역·읽음 API 가 생기면 이 store 는 걷어낸다.
 *
 * `persistent` 네임스페이스를 쓴다(앱=MMKV / 브라우저=localStorage).
 * `session` 이면 앱을 닫을 때마다 초기화돼 매번 빨간 점이 다시 뜬다.
 */
interface ReadNotificationState {
  /** 읽은 공지의 boardNum 목록 */
  readIds: number[];
  markAsRead: (boardNum: number) => void;
  isRead: (boardNum: number) => boolean;
}

export const useReadNotificationStore = create<ReadNotificationState>()(
  persist(
    (set, get) => ({
      readIds: [],
      markAsRead: (boardNum) =>
        set((state) =>
          // 이미 있으면 그대로 둔다 — 매번 새 배열을 만들면 구독자가 불필요하게 리렌더된다
          state.readIds.includes(boardNum)
            ? state
            : { readIds: [...state.readIds, boardNum] }
        ),
      isRead: (boardNum) => get().readIds.includes(boardNum),
    }),
    {
      name: "read-notifications",
      storage: createJSONStorage(() => getPersistStorage("persistent")),
    }
  )
);
