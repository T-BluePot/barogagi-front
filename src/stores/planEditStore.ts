import { create } from "zustand";
import type {
  EditPlanDraft,
  EditPlanPlace,
} from "@/types/main/plan/bottom-modal/planFromTypes";

interface PlanEditState {
  draft: EditPlanDraft | null; // 현재 편집 중인 드래프트, 없으면 null
  setDraft: (draft: EditPlanDraft) => void; // 드래프트 설정 함수
  clearDraft: () => void; // 드래프트 초기화 함수
  // ----- 드래프르 내부 수정 함수들 -----
  updatePlace: (place: EditPlanPlace) => void;

  /* 필요한 경우: 시간, 제목, 태그 등도 동일한 방식으로 추가 가능
   * updatePlanName, updateTime, updateTags ...
   */
}

export const usePlanEditStore = create<PlanEditState>((set) => ({
  // 일정 편집 드래프트 초기 상태
  draft: null,

  // 드래프트 설정 및 초기화 함수
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),

  // --- 드래프트 내부 수정 함수들 ---
  // 장소 정보 업데이트
  updatePlace: (place) =>
    set((state) => ({
      draft: state.draft
        ? {
            ...state.draft,
            place: {
              ...state.draft.place,
              ...place,
            },
          }
        : null,
    })),
}));
