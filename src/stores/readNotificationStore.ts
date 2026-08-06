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
}

export const useReadNotificationStore = create<ReadNotificationState>()(
  persist(
    (set) => ({
      readIds: [],
      markAsRead: (boardNum) =>
        set((state) =>
          // 이미 있으면 그대로 둔다 — 매번 새 배열을 만들면 구독자가 불필요하게 리렌더된다
          state.readIds.includes(boardNum)
            ? state
            : { readIds: [...state.readIds, boardNum] }
        ),
    }),
    {
      name: "read-notifications",
      storage: createJSONStorage(() => getPersistStorage("persistent")),
      /**
       * 저장소에서 되살릴 때 `readIds` 를 반드시 number[] 로 맞춘다.
       *
       * 기본 동작은 저장된 값을 그대로 덮어쓰기 때문에, 저장소가 손상돼
       * `readIds` 가 null 이거나 배열이 아닌 값이면 읽는 쪽에서 `.includes` 를
       * 부르다 렌더가 통째로 죽는다(앱 전체가 오류 화면으로 넘어감).
       * 읽는 곳마다 방어 코드를 흩뿌리는 대신 되살리는 입구 한 곳에서 막는다.
       */
      merge: (persisted, current) => {
        const saved = (persisted as Partial<ReadNotificationState> | null)
          ?.readIds;
        return {
          ...current,
          readIds: Array.isArray(saved)
            ? saved.filter((id): id is number => typeof id === "number")
            : [],
        };
      },
    }
  )
);
