import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// === schedule types ===
import type {
  ScheduleRegistReqDTO,
  PlanRegistReqDTO,
  UserAddedPlaceDTO,
} from "@/api/types";

import type {
  ScheduleDraftType,
  PlanDraftType,
  AIPlanDraftType,
  UserPlacePlanDraftType,
  UserCustomPlanDraftType,
} from "@/types/api/scheduleTypes";

/** 초기값 */
const initialDraft: ScheduleDraftType = {
  scheduleNm: "",
  startDate: "",
  endDate: "",
  comment: "",
  scheduleTagRegistReqDTOList: [],
  planRegistReqDTOList: [],
};

/**
 * 유니온 PlanDraftType을 source 기준으로 좁히는 런타임 가드
 * - Zustand 업데이트에서 타입 넓어짐(특히 isUserAdded)이 발생하는 것을 방지하기 위해 사용
 */
function assertSource<T extends PlanDraftType["source"]>(
  plan: PlanDraftType,
  source: T
): asserts plan is Extract<PlanDraftType, { source: T }> {
  if (plan.source !== source) {
    throw new Error(`플랜 타입이 ${source}가 아닙니다.`);
  }
}

/** Draft plan → 서버 요청 plan DTO 변환 */
function toPlanReqDTO(plan: PlanDraftType): PlanRegistReqDTO {
  // 공통 필드
  const common: PlanRegistReqDTO = {
    startTime: plan.startTime,
    endTime: plan.endTime,
    itemNum: plan.itemNum,
    isRandomCategory: plan.isRandomCategory,
    regionRegistReqDTOList: plan.regionRegistReqDTOList,
    isUserAdded: plan.isUserAdded,
  };

  // 명세: isRandomCategory="Y"면 categoryNum은 전달하지 않아도 됨
  if (plan.isRandomCategory !== "Y") {
    common.categoryNum = plan.categoryNum;
  }

  // source별 분기
  if (plan.source === "AI") {
    return {
      ...common,
      planTagRegistReqDTOList: plan.planTagRegistReqDTOList,
    };
  }

  if (plan.source === "USER_PLACE") {
    return {
      ...common,
      userAddedPlaceDTO: plan.userAddedPlaceDTO,
    };
  }

  // USER_CUSTOM
  return {
    ...common,
    planNm: plan.planNm,
  };
}

export type ScheduleDraftStore = {
  draft: ScheduleDraftType;
  editingPlanIndex: number | null;

  // 상위(schedule) 필드 누적 업데이트
  setDraft: (
    patch: Partial<Omit<ScheduleDraftType, "planRegistReqDTOList">>
  ) => void;

  // 편집 중인 plan index 관리
  setEditingPlanIndex: (index: number | null) => void;

  // plan 추가
  addAIPlan: (
    seed?: Partial<Omit<AIPlanDraftType, "source" | "isUserAdded">>
  ) => void;
  addUserPlacePlan: (place: UserAddedPlaceDTO) => void;
  addUserCustomPlan: (planNm: string) => void;

  // plan 수정 (source별로 분리: 유니온 타입 넓어짐 방지)
  updateAIPlan: (
    index: number,
    patch: Partial<Omit<AIPlanDraftType, "source" | "isUserAdded">>
  ) => void;

  updateUserPlacePlan: (
    index: number,
    patch: Partial<Omit<UserPlacePlanDraftType, "source" | "isUserAdded">>
  ) => void;

  updateUserCustomPlan: (
    index: number,
    patch: Partial<Omit<UserCustomPlanDraftType, "source" | "isUserAdded">>
  ) => void;

  removePlan: (index: number) => void;

  // 서버 요청 DTO 생성
  buildRequest: () => ScheduleRegistReqDTO;

  // 초기화
  reset: () => void;
};

export const useScheduleDraftStore = create<ScheduleDraftStore>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      editingPlanIndex: null,

      setDraft: (patch) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...patch,
            // 배열은 항상 유지
            scheduleTagRegistReqDTOList:
              patch.scheduleTagRegistReqDTOList ??
              state.draft.scheduleTagRegistReqDTOList,
          },
        })),

      setEditingPlanIndex: (index) => set({ editingPlanIndex: index }),

      addAIPlan: (seed) =>
        set((state) => ({
          draft: {
            ...state.draft,
            planRegistReqDTOList: [
              ...state.draft.planRegistReqDTOList,
              {
                source: "AI",
                isUserAdded: "N",
                startTime: "08:00",
                endTime: "09:00",
                isRandomCategory: "N",
                regionRegistReqDTOList: [],
                planTagRegistReqDTOList: [],
                ...(seed ?? {}),
              },
            ],
          },
        })),

      addUserPlacePlan: (place) =>
        set((state) => ({
          draft: {
            ...state.draft,
            planRegistReqDTOList: [
              ...state.draft.planRegistReqDTOList,
              {
                source: "USER_PLACE",
                isUserAdded: "Y",
                startTime: "08:00",
                endTime: "09:00",
                isRandomCategory: "N",
                userAddedPlaceDTO: place,
              },
            ],
          },
        })),

      addUserCustomPlan: (planNm) =>
        set((state) => ({
          draft: {
            ...state.draft,
            planRegistReqDTOList: [
              ...state.draft.planRegistReqDTOList,
              {
                source: "USER_CUSTOM",
                isUserAdded: "Y",
                startTime: "08:00",
                endTime: "09:00",
                isRandomCategory: "N",
                planNm,
              },
            ],
          },
        })),

      updateAIPlan: (index, patch) =>
        set((state) => {
          const next = [...state.draft.planRegistReqDTOList];
          const cur = next[index];
          if (!cur) return state;

          assertSource(cur, "AI");

          next[index] = {
            ...cur,
            ...patch,
            // 불변 규칙 강제
            source: "AI",
            isUserAdded: "N",
          };

          return { draft: { ...state.draft, planRegistReqDTOList: next } };
        }),

      updateUserPlacePlan: (index, patch) =>
        set((state) => {
          const next = [...state.draft.planRegistReqDTOList];
          const cur = next[index];
          if (!cur) return state;

          assertSource(cur, "USER_PLACE");

          next[index] = {
            ...cur,
            ...patch,
            source: "USER_PLACE",
            isUserAdded: "Y",
          };

          return { draft: { ...state.draft, planRegistReqDTOList: next } };
        }),

      updateUserCustomPlan: (index, patch) =>
        set((state) => {
          const next = [...state.draft.planRegistReqDTOList];
          const cur = next[index];
          if (!cur) return state;

          assertSource(cur, "USER_CUSTOM");

          next[index] = {
            ...cur,
            ...patch,
            source: "USER_CUSTOM",
            isUserAdded: "Y",
          };

          return { draft: { ...state.draft, planRegistReqDTOList: next } };
        }),

      removePlan: (index) =>
        set((state) => ({
          draft: {
            ...state.draft,
            planRegistReqDTOList: state.draft.planRegistReqDTOList.filter(
              (_, i) => i !== index
            ),
          },
        })),

      buildRequest: () => {
        const { draft } = get();

        const scheduleNm = (draft.scheduleNm ?? "").trim();
        const startDate = (draft.startDate ?? "").trim();
        const endDate = (draft.endDate ?? "").trim();
        const comment = (draft.comment ?? "").trim();

        if (!scheduleNm) throw new Error("일정명이 필요합니다.");
        if (!startDate) throw new Error("시작 날짜가 필요합니다.");
        if (!endDate) throw new Error("종료 날짜가 필요합니다.");

        const planReqList = draft.planRegistReqDTOList.map(toPlanReqDTO);

        const req: ScheduleRegistReqDTO = {
          scheduleNm,
          startDate,
          endDate,
          comment: comment ? comment : undefined,
          scheduleTagRegistReqDTOList: draft.scheduleTagRegistReqDTOList,
          planRegistReqDTOList: planReqList,
        };

        return req;
      },

      reset: () => set({ draft: initialDraft, editingPlanIndex: null }),
    }),
    {
      name: "schedule:create:draft",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        draft: state.draft,
        editingPlanIndex: state.editingPlanIndex,
      }),
    }
  )
);
