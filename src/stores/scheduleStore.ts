import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getPersistStorage } from "@/utils/bridgeStorage";

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
  ages: [],
  people: 0, // 필수값 아님 — 0이면 미선택(서버 전송 시 제외)
  purpose: "",
  scheduleTagRegistReqDTOList: [],
  scheduleRegionRegistReqDTOList: [],
  planRegistReqDTOList: [],
};

/**
 * 유니온 PlanDraftType을 source 기준으로 좁히는 런타임 가드
 * - Zustand 업데이트에서 타입 넓어짐(특히 isUserAdded)이 발생하는 것을 방지하기 위해 사용
 */
function isSource<T extends PlanDraftType["source"]>(
  plan: PlanDraftType,
  source: T
): plan is Extract<PlanDraftType, { source: T }> {
  return plan.source === source;
}

/** Draft plan → 서버 요청 plan DTO 변환 */
function toPlanReqDTO(plan: PlanDraftType): PlanRegistReqDTO {
  // 공통 필드 (base에 있는 것만)
  const common = {
    startTime: plan.startTime,
    endTime: plan.endTime,
  };

  if (plan.source === "AI") {
    const aiPlan: PlanRegistReqDTO = {
      ...common,
      isUserAdded: plan.isUserAdded,
      itemNum: plan.itemNum,
      isRandomCategory: plan.isRandomCategory,
      regionRegistReqDTOList: (plan.regionRegistReqDTOList ?? []).map((r) => ({
        regionNum: r.regionNum,
      })),
      planTagRegistReqDTOList: plan.planTagRegistReqDTOList ?? [],
    };

    // 명세: isRandomCategory="Y"면 categoryNum은 전달하지 않아도 됨
    if (plan.isRandomCategory !== "Y") {
      aiPlan.categoryNum = plan.categoryNum;
    }

    return aiPlan;
  }

  if (plan.source === "USER_PLACE") {
    return {
      ...common,
      isUserAdded: plan.isUserAdded,
      isRandomCategory: "N",
      planNm: plan.planNm,
      userAddedPlaceDTO: plan.userAddedPlaceDTO,
    };
  }

  // USER_CUSTOM
  return {
    ...common,
    isUserAdded: plan.isUserAdded,
    isRandomCategory: "N",
    planNm: plan.planNm,
  };
}

/** 참고사항(연령대/인원수/목적)과 자유 코멘트를 하나의 comment 문자열로 집계 */
function buildComment(draft: ScheduleDraftType): string | undefined {
  const parts: string[] = [];
  if (draft.ages && draft.ages.length > 0) {
    parts.push(`연령대: ${draft.ages.join(", ")}`);
  }
  if (draft.people && draft.people > 0) {
    parts.push(`인원수: ${draft.people}명`);
  }
  const purpose = draft.purpose?.trim();
  if (purpose) parts.push(`목적: ${purpose}`);
  const note = draft.comment?.trim();
  if (note) parts.push(note);
  return parts.length > 0 ? parts.join(" / ") : undefined;
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
  addUserPlacePlan: (
    seed: Pick<UserPlacePlanDraftType, "planNm" | "startTime" | "endTime"> & {
      userAddedPlaceDTO: UserAddedPlaceDTO;
    }
  ) => void;
  addUserCustomPlan: (
    seed: Pick<UserCustomPlanDraftType, "planNm" | "startTime" | "endTime">
  ) => void;

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

  convertToUserPlacePlan: (
    index: number,
    data: Pick<UserPlacePlanDraftType, "planNm" | "startTime" | "endTime"> & {
      userAddedPlaceDTO: UserAddedPlaceDTO;
    }
  ) => void;

  removePlan: (index: number) => void;

  // plan 목록 교체 (드래그 앤 드롭 순서 변경용)
  setPlanList: (plans: PlanDraftType[]) => void;

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
            scheduleRegionRegistReqDTOList:
              patch.scheduleRegionRegistReqDTOList ??
              state.draft.scheduleRegionRegistReqDTOList,
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

      addUserPlacePlan: (seed) =>
        set((state) => ({
          draft: {
            ...state.draft,
            planRegistReqDTOList: [
              ...state.draft.planRegistReqDTOList,
              {
                source: "USER_PLACE",
                isUserAdded: "Y",
                isRandomCategory: "N",
                ...seed,
              },
            ],
          },
        })),

      addUserCustomPlan: (seed) =>
        set((state) => ({
          draft: {
            ...state.draft,
            planRegistReqDTOList: [
              ...state.draft.planRegistReqDTOList,
              {
                source: "USER_CUSTOM",
                isUserAdded: "Y",
                isRandomCategory: "N",
                ...seed,
              },
            ],
          },
        })),

      updateAIPlan: (index, patch) =>
        set((state) => {
          const next = [...state.draft.planRegistReqDTOList];
          const cur = next[index];
          if (!cur || !isSource(cur, "AI")) return state;

          next[index] = {
            ...cur,
            ...patch,
            source: "AI",
            isUserAdded: "N",
          };

          return { draft: { ...state.draft, planRegistReqDTOList: next } };
        }),

      updateUserPlacePlan: (index, patch) =>
        set((state) => {
          const next = [...state.draft.planRegistReqDTOList];
          const cur = next[index];
          if (!cur || !isSource(cur, "USER_PLACE")) return state;

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
          if (!cur || !isSource(cur, "USER_CUSTOM")) return state;

          next[index] = {
            ...cur,
            ...patch,
            source: "USER_CUSTOM",
            isUserAdded: "Y",
          };

          return { draft: { ...state.draft, planRegistReqDTOList: next } };
        }),
      convertToUserPlacePlan: (
        index: number,
        data: Pick<
          UserPlacePlanDraftType,
          "planNm" | "startTime" | "endTime"
        > & {
          userAddedPlaceDTO: UserAddedPlaceDTO;
        }
      ) =>
        set((state) => {
          const next = [...state.draft.planRegistReqDTOList];
          const cur = next[index];
          if (!cur) return state;

          next[index] = {
            source: "USER_PLACE",
            isUserAdded: "Y",
            isRandomCategory: "N",
            planNm: data.planNm,
            startTime: data.startTime,
            endTime: data.endTime,
            userAddedPlaceDTO: data.userAddedPlaceDTO,
          };

          return { draft: { ...state.draft, planRegistReqDTOList: next } };
        }),

      removePlan: (index) =>
        set((state) => {
          const nextPlans = state.draft.planRegistReqDTOList.filter(
            (_, i) => i !== index
          );

          let nextEditingIndex = state.editingPlanIndex;
          if (nextEditingIndex !== null) {
            if (nextEditingIndex === index) nextEditingIndex = null;
            else if (nextEditingIndex > index) nextEditingIndex -= 1;
          }

          return {
            draft: {
              ...state.draft,
              planRegistReqDTOList: nextPlans,
            },
            editingPlanIndex: nextEditingIndex,
          };
        }),

      setPlanList: (plans) =>
        set((state) => ({
          draft: { ...state.draft, planRegistReqDTOList: plans },
        })),

      buildRequest: () => {
        const { draft } = get();

        const scheduleNm = draft.scheduleNm ?? "";
        const startDate = draft.startDate ?? "";
        const endDate = draft.endDate ?? "";

        if (!scheduleNm) throw new Error("일정명이 필요합니다.");
        if (!startDate) throw new Error("시작 날짜가 필요합니다.");
        if (!endDate) throw new Error("종료 날짜가 필요합니다.");

        const planReqList = draft.planRegistReqDTOList.map(toPlanReqDTO);

        const req: ScheduleRegistReqDTO = {
          scheduleNm,
          startDate,
          endDate,
          comment: buildComment(draft),
          scheduleTagRegistReqDTOList: draft.scheduleTagRegistReqDTOList,
          scheduleRegionRegistReqDTOList: draft.scheduleRegionRegistReqDTOList,
          planRegistReqDTOList: planReqList,
        };

        return req;
      },

      reset: () => set({ draft: initialDraft, editingPlanIndex: null }),
    }),
    {
      name: "schedule:create:draft",
      storage: createJSONStorage(() => getPersistStorage("session")),
      partialize: (state) => ({
        draft: state.draft,
        editingPlanIndex: state.editingPlanIndex,
      }),
    }
  )
);

// store 파일 맨 아래에 추가
if (import.meta.env.DEV) {
  useScheduleDraftStore.subscribe((state) => {
    console.log("[ScheduleDraftStore]", state.draft);
  });
}
