import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlanSettingForm } from "@/components/main/plan/PlanSettingForm";
import DeletePlanModal from "@/components/main/plan/create/DeletePlanModal";
import type { PlanData } from "@/components/main/plan/PlanCard";
import PlanCategoryBottomModal from "@/components/main/plan/common/modal/PlanCategoryBottomModal";
import PlanFormModal from "@/components/main/plan/common/modal/PlanFormModal";
import { SelectTimeConfirmModal } from "@/components/main/plan/common/modal/SelectTimeConfirmModal";
import { SelectRegionConfirmModal } from "@/components/main/plan/common/modal/SelectRegionConfirmModal";
import { SelectTagConfirmModal } from "@/components/main/plan/common/modal/SelectTagConfirmModal";
import Button from "@/components/common/buttons/CommonButton";
import { ROUTES } from "@/constants/routes";
import { usePlanDelete } from "@/hooks/usePlanDelete";
import { usePlanFormModal } from "@/hooks/usePlanFormModal";

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
  const [items, setItems] = useState<PlanData[]>([]);

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
          onOrderChange={setItems}
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
