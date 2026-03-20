import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
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
import PlanNameInputModal from "@/components/main/plan/common/modal/PlanNameInputModal";
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
    if (storeDraft.planRegistReqDTOList.length === 0) {
      setItems([]);
      return;
    }

    setItems(
      storeDraft.planRegistReqDTOList.map((plan, index) => {
        if (plan.source === "AI") {
          return {
            id: index,
            storeIndex: index,
            source: "AI" as const, // ← as const 추가
            title: categoryMap[plan.categoryNum ?? 0] ?? "일정",
            startTime: plan.startTime,
            endTime: plan.endTime,
            location: selectedRegions.find(
              (r) => r.regionNum === plan.regionRegistReqDTOList?.[0]?.regionNum
            )?.regionNm,
            categoryNum: plan.categoryNum,
            itemNum: plan.itemNum,
            regionRegistReqDTOList: plan.regionRegistReqDTOList,
            planTagRegistReqDTOList: plan.planTagRegistReqDTOList?.map((t) => ({
              tagNum: t.tagNum,
              tagNm: t.tagNm ?? "",
            })),
          };
        }

        if (plan.source === "USER_PLACE") {
          return {
            id: index,
            storeIndex: index,
            source: "USER_PLACE" as const,
            title: plan.planNm,
            startTime: plan.startTime,
            endTime: plan.endTime,
            location: plan.userAddedPlaceDTO?.addressName,
            userAddedPlaceDTO: plan.userAddedPlaceDTO,
          };
        }

        return {
          id: index,
          storeIndex: index,
          source: "USER_CUSTOM" as const,
          title: plan.planNm,
          startTime: plan.startTime,
          endTime: plan.endTime,
        };
      })
    );
  }, [categoryMap, storeDraft.planRegistReqDTOList, selectedRegions]);

  const { setPlanList } = useScheduleDraftStore();

  const handleOrderChange = (newItems: PlanData[]) => {
    const currentPlans =
      useScheduleDraftStore.getState().draft.planRegistReqDTOList;

    // storeIndex로 정확히 plan 꺼내기
    const reorderedPlans = newItems.map(
      (item) => currentPlans[item.storeIndex]
    );

    // duration 계산 및 시간 재계산 로직 동일
    const durations = newItems.map((item) => {
      if (!item.startTime || !item.endTime) return null;
      return hhmmToMinutes(item.endTime) - hhmmToMinutes(item.startTime);
    });

    let cursor = items[0]?.startTime ? hhmmToMinutes(items[0].startTime) : null;

    const updatedPlans = reorderedPlans.map((plan, i) => {
      if (cursor === null || durations[i] === null) return plan;
      const newStart = minutesToHHmm(cursor);
      const newEnd = minutesToHHmm(cursor + durations[i]!);
      cursor += durations[i]!;
      return { ...plan, startTime: newStart, endTime: newEnd };
    }) as PlanDraftType[];

    // items도 storeIndex 재정렬 후 재할당
    const reindexedItems = newItems.map((item, i) => ({
      ...item,
      storeIndex: i,
      startTime: updatedPlans[i].startTime,
      endTime: updatedPlans[i].endTime,
    }));

    setItems(reindexedItems);
    setPlanList(updatedPlans);
  };

  const { handleDeleteClick, deleteModalProps } = usePlanDelete(
    items,
    setItems
  );
  const {
    formHandlers,
    categoryModalProps,
    planNameModalProps,
    planFormModalProps,
    timeModalProps,
    regionModalProps,
    tagModalProps,
  } = usePlanFormModal(items, setItems);

  const handleLocationClick = (id: number) => {
    formHandlers.handleLocationClick(id);
  };

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
          onLocationClick={handleLocationClick}
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
      <PlanNameInputModal {...planNameModalProps} />
      <PlanFormModal {...planFormModalProps} />
      <DeletePlanModal {...deleteModalProps} />
      <SelectTimeConfirmModal {...timeModalProps} />
      <SelectRegionConfirmModal {...regionModalProps} />
      <SelectTagConfirmModal {...tagModalProps} />

      {/* 자식 컴포넌트: 검색 화면 영역 */}
      <Outlet />
    </div>
  );
};
