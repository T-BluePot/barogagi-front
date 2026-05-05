import { create } from "zustand";

/**
 * [임시] 디버그용 스토어
 * - forceLoading: true면 모든 쿼리 로딩 상태를 강제로 true 처리
 */
interface DebugStore {
  forceLoading: boolean;
  toggleForceLoading: () => void;
}

export const useDebugStore = create<DebugStore>((set) => ({
  forceLoading: true,
  toggleForceLoading: () => set((s) => ({ forceLoading: !s.forceLoading })),
}));
