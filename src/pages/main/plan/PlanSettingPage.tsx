import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

// === component ===
import { PlanSettingForm } from "@/components/main/plan/PlanSettingForm";
import DeletePlanModal from "@/components/main/plan/create/DeletePlanModal";
import type { PlanData } from "@/components/main/plan/PlanCard";
import PlanCategoryBottomModal from "@/components/main/plan/common/modal/PlanCategoryBottomModal";
import PlanFormModal from "@/components/main/plan/common/modal/PlanFormModal";
import { SelectTimeConfirmModal } from "@/components/main/plan/common/modal/SelectTimeConfirmModal";
import { SelectRegionConfirmModal } from "@/components/main/plan/common/modal/SelectRegionConfirmModal";
import { SelectTagConfirmModal } from "@/components/main/plan/common/modal/SelectTagConfirmModal";
import Button from "@/components/common/buttons/CommonButton";

// === hooks & utils ===
import { usePlanDelete } from "@/hooks/usePlanDelete";
import { usePlanFormModal } from "@/hooks/usePlanFormModal";
import { hhmmToMinutes, minutesToHHmm } from "@/hooks/usePlanTimeValidation";

// === server ===
import { getScheduleCategories } from "@/api/queries";
import type { ScheduleCategoryResponseType } from "@/api/types";
import type { PlanDraftType } from "@/types/api/scheduleTypes";
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";
import { useScheduleDraftStore } from "@/stores/scheduleStore";

/**
 * PlanSettingPage - 일정 구성 페이지
 *
 * [페이지 흐름]
 * 1. "+ 일정 추가" → 카테고리 선택 → PlanFormModal(Create) → 시간/장소/태그 선택 → 저장
 * 2. 기존 카드 클릭 → PlanFormModal(Edit) → 수정 → 저장
 * 3. 카드 스와이프 → 삭제 확인 → 삭제
 * 4. 드래그 앤 드롭 → 순서 변경
 * 5. "다음" → 스타일 선택 페이지
 *
 * 상태 관리:
 * - usePlanDelete     : 삭제 모달 (hooks/usePlanDelete.ts)
 * - usePlanFormModal  : 일정 폼 + 하위 모달 (hooks/usePlanFormModal.ts)
 */
export const PlanSettingPage = () => {
  const navigate = useNavigate();
  const { draft: storeDraft } = useScheduleDraftStore();

  // 카테고리 맵 상태
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});

  // 마운트 시 카테고리 목록 불러오기
  useEffect(() => {
    getScheduleCategories().then((res) => {
      const map = (res.data ?? []).reduce(
        (acc, cat: ScheduleCategoryResponseType) => {
          acc[cat.categoryNum] = cat.categoryNm;
          return acc;
        },
        {} as Record<number, string>
      );
      setCategoryMap(map);
    });
  }, []);

  // items 초기화 - categoryMap 없을 땐 빈 배열, 준비되면 store에서 파생
  const [items, setItems] = useState<PlanData[]>([]);

  // 지역명 매칭
  const selectedRegions = useRegionSelectionStore((s) => s.selectedRegions);

  useEffect(() => {
    if (storeDraft.planRegistReqDTOList.length === 0) return;

    setItems(
      storeDraft.planRegistReqDTOList.map((plan, index) => ({
        id: index,
        title: categoryMap[plan.categoryNum ?? 0] ?? "일정",
        startTime: plan.startTime,
        endTime: plan.endTime,
        location: plan.regionRegistReqDTOList?.[0]?.regionNum
          ? selectedRegions.find(
              (r) => r.regionNum === plan.regionRegistReqDTOList![0].regionNum
            )?.regionNm
          : undefined,
        categoryNum: plan.categoryNum,
        itemNum: plan.itemNum,
        planTagRegistReqDTOList: plan.planTagRegistReqDTOList,
      }))
    );
  }, [categoryMap]); // categoryMap 준비되면 items 초기화

  const { setPlanList } = useScheduleDraftStore();

  const handleOrderChange = (newItems: PlanData[]) => {
    const currentPlans =
      useScheduleDraftStore.getState().draft.planRegistReqDTOList;

    // 1. 각 카드의 duration 계산
    const durations = newItems.map((item) => {
      if (!item.startTime || !item.endTime) return null;
      return hhmmToMinutes(item.endTime) - hhmmToMinutes(item.startTime);
    });

    // 2. 첫 번째 카드의 시작 시간 기준으로 순서대로 재배치
    let cursor = newItems[0]?.startTime
      ? hhmmToMinutes(newItems[0].startTime)
      : null;

    const reindexed = newItems.map((item, i) => {
      if (cursor === null || durations[i] === null) {
        return { ...item, id: i };
      }
      const newStart = minutesToHHmm(cursor);
      const newEnd = minutesToHHmm(cursor + durations[i]!);
      cursor += durations[i]!;
      return { ...item, id: i, startTime: newStart, endTime: newEnd };
    });

    // 3. store도 같이 업데이트
    const reorderedPlans = newItems.map((item) => currentPlans[item.id]);
    const updatedPlans = reorderedPlans.map((plan, i) => ({
      ...plan,
      startTime: reindexed[i].startTime ?? plan.startTime, // undefined면 기존 값 유지
      endTime: reindexed[i].endTime ?? plan.endTime,
    })) as PlanDraftType[];

    setItems(reindexed);
    setPlanList(updatedPlans);
  };

  const { handleDeleteClick, deleteModalProps } = usePlanDelete(setItems);
  const {
    formHandlers,
    categoryModalProps,
    planFormModalProps,
    timeModalProps,
    regionModalProps,
    tagModalProps,
  } = usePlanFormModal(items, setItems);

  return (
    <div className="flex flex-col w-full h-full">
      {/* 일정 카드 리스트 + 추가 버튼 */}
      <div className="flex-1 overflow-auto p-4">
        <PlanSettingForm
          initialItems={items}
          onAddPlan={formHandlers.handleAddPlan}
          onOrderChange={handleOrderChange}
          onCardClick={formHandlers.handleCardClick}
          onDeleteClick={handleDeleteClick}
          onTimeClick={formHandlers.handleTimeClick}
          onLocationClick={formHandlers.handleLocationClick}
        />
      </div>

      {/* 다음 버튼 */}
      <div className="mt-auto w-full p-6">
        <Button
          label="다음"
          isDisabled={items.length === 0}
          onClick={() => navigate(ROUTES.PLAN.STYLE)}
        />
      </div>

      {/* 모달 영역 */}
      <PlanCategoryBottomModal {...categoryModalProps} />
      <PlanFormModal {...planFormModalProps} />
      <DeletePlanModal {...deleteModalProps} />
      <SelectTimeConfirmModal {...timeModalProps} />
      <SelectRegionConfirmModal {...regionModalProps} />
      <SelectTagConfirmModal {...tagModalProps} />
    </div>
  );
};
