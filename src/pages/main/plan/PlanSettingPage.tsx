import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlanSettingForm } from "@/components/main/plan/PlanSettingForm";
import DeletePlanModal from "@/components/main/plan/create/DeletePlanModal";
import type { PlanData } from "@/components/main/plan/PlanCard";
import PlanCategoryBottomModal from "@/components/main/plan/common/modal/PlanCategoryBottomModal";
import PlanFormModal from "@/components/main/plan/common/modal/PlanFormModal";
import { SelectTimeConfirmModal } from "@/components/main/plan/common/modal/SelectTimeConfirmModal";
import { SelectRegionConfirmModal } from "@/components/main/plan/common/modal/SelectRegionConfirmModal";
import type { RegionOption } from "@/components/main/plan/common/modal/content/SelectRegionConfirmModalContent";
import { timeValueToHHmm, hhmmToTimeValue } from "@/utils/date";
import type { TimeValue } from "@/utils/date";
import Button from "@/components/common/buttons/CommonButton";
import { ROUTES } from "@/constants/routes";
import { useAlertModalStore } from "@/stores/alertModalStore";

// === type ===
import type { SelectedCategoryItemType } from "@/types/api/scheduleTypes";

export const PlanSettingPage = () => {
  const navigate = useNavigate();
  const { openAlertModal } = useAlertModalStore();
  const [items, setItems] = useState<PlanData[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(
    null
  );

  const handleDeleteClick = (id: string | number) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      setItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleOrderChange = (newItems: PlanData[]) => {
    setItems(newItems);
  };

  const handleAddPlan = () => {
    handleCategoryModalOpen();
  };

  // === PlanForm 모달 (일정 추가 폼) ===
  const DRAFT_ID = "__draft__";
  const [isPlanFormModalOpen, setIsPlanFormModalOpen] = useState(false);
  const [planFormDraft, setPlanFormDraft] = useState<{
    planNm: string;
    startTime?: string;
    endTime?: string;
    address?: string;
    tags?: string[];
  } | null>(null);

  // === 시간 선택 모달 ===
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [timeEditTargetId, setTimeEditTargetId] = useState<
    string | number | null
  >(null);

  const handleTimeClick = (id: string | number) => {
    setTimeEditTargetId(id);
    setIsTimeModalOpen(true);
  };

  const handleTimeConfirm = (startTime: TimeValue, endTime: TimeValue) => {
    if (timeEditTargetId === null) return;

    if (timeEditTargetId === DRAFT_ID) {
      setPlanFormDraft((prev) =>
        prev
          ? {
              ...prev,
              startTime: timeValueToHHmm(startTime),
              endTime: timeValueToHHmm(endTime),
            }
          : null
      );
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === timeEditTargetId
            ? {
                ...item,
                startTime: timeValueToHHmm(startTime),
                endTime: timeValueToHHmm(endTime),
              }
            : item
        )
      );
    }
    setIsTimeModalOpen(false);
    setTimeEditTargetId(null);
  };

  const handleTimeCancel = () => {
    setIsTimeModalOpen(false);
    setTimeEditTargetId(null);
  };

  const timeEditTarget =
    timeEditTargetId === DRAFT_ID
      ? { startTime: planFormDraft?.startTime, endTime: planFormDraft?.endTime }
      : items.find((item) => item.id === timeEditTargetId);

  // === 지역 선택 모달 ===
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [regionEditTargetId, setRegionEditTargetId] = useState<
    string | number | null
  >(null);

  // TODO: 실제 API 연동 시 서버에서 받아온 지역 목록으로 교체
  const regionOptions: RegionOption[] = [
    { id: "1", label: "서울 강남구" },
    { id: "2", label: "서울 종로구" },
    { id: "3", label: "서울 마포구" },
    { id: "4", label: "서울 강동구" },
    { id: "5", label: "부산 해운대구" },
    { id: "6", label: "대구 수성구" },
    { id: "7", label: "인천 연수구" },
  ];

  const handleLocationClick = (id: string | number) => {
    setRegionEditTargetId(id);
    setIsRegionModalOpen(true);
  };

  const handleRegionConfirm = (region: RegionOption | null) => {
    if (regionEditTargetId === null) return;

    if (regionEditTargetId === DRAFT_ID) {
      setPlanFormDraft((prev) =>
        prev ? { ...prev, address: region?.label ?? undefined } : null
      );
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.id === regionEditTargetId
            ? { ...item, location: region?.label ?? undefined }
            : item
        )
      );
    }
    setIsRegionModalOpen(false);
    setRegionEditTargetId(null);
  };

  const handleRegionCancel = () => {
    setIsRegionModalOpen(false);
    setRegionEditTargetId(null);
  };

  const regionEditTarget =
    regionEditTargetId === DRAFT_ID
      ? { location: planFormDraft?.address }
      : items.find((item) => item.id === regionEditTargetId);
  const initialRegionId = regionOptions.find(
    (r) => r.label === regionEditTarget?.location
  )?.id;

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleCategoryModalOpen = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
  };

  const handleCategorySelect = (selected: SelectedCategoryItemType) => {
    setPlanFormDraft({
      planNm: selected.option.itemNm,
    });
    handleCategoryModalClose();
    setIsPlanFormModalOpen(true);
  };

  const handlePlanFormClose = () => {
    if (planFormDraft && (!planFormDraft.startTime || !planFormDraft.endTime)) {
      openAlertModal({
        title: "시간을 선택해주세요",
        content: "일정에 시간을 추가해야 저장할 수 있습니다.",
        buttonLabel: "확인",
      });
      return;
    }

    if (planFormDraft) {
      const newPlan: PlanData = {
        id: String(Date.now()),
        title: planFormDraft.planNm,
        startTime: planFormDraft.startTime,
        endTime: planFormDraft.endTime,
        location: planFormDraft.address,
      };
      setItems((prev) => [...prev, newPlan]);
    }
    setIsPlanFormModalOpen(false);
    setPlanFormDraft(null);
  };

  const handlePlanFormTimeClick = () => {
    setIsRegionModalOpen(false);
    setRegionEditTargetId(null);
    setTimeEditTargetId(DRAFT_ID);
    setIsTimeModalOpen(true);
  };

  const handlePlanFormAddressClick = () => {
    setIsTimeModalOpen(false);
    setTimeEditTargetId(null);
    setRegionEditTargetId(DRAFT_ID);
    setIsRegionModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-auto p-4">
        <PlanSettingForm
          initialItems={items}
          onAddPlan={handleAddPlan}
          onOrderChange={handleOrderChange}
          onDeleteClick={handleDeleteClick}
          onTimeClick={handleTimeClick}
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

      <PlanCategoryBottomModal
        isOpen={isCategoryModalOpen}
        onClose={handleCategoryModalClose}
        onSelectOption={handleCategorySelect}
      />
      <PlanFormModal
        action={{
          isOpen: isPlanFormModalOpen,
          onClose: handlePlanFormClose,
          onConfirm: handlePlanFormClose,
        }}
        info={{
          mode: "Create",
          planNm: planFormDraft?.planNm,
          startTime: planFormDraft?.startTime,
          endTime: planFormDraft?.endTime,
          address: planFormDraft?.address,
          tags: planFormDraft?.tags,
          onClickTime: handlePlanFormTimeClick,
          onClickAddress: handlePlanFormAddressClick,
          onClickTags: () => {
            // TODO: 태그 선택 기능
          },
        }}
      />
      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClickConfirm={handleConfirmDelete}
        onClickCancel={handleCancelDelete}
      />
      <SelectTimeConfirmModal
        isOpen={isTimeModalOpen}
        initialStartTime={
          timeEditTarget?.startTime
            ? hhmmToTimeValue(timeEditTarget.startTime)
            : undefined
        }
        initialEndTime={
          timeEditTarget?.endTime
            ? hhmmToTimeValue(timeEditTarget.endTime)
            : undefined
        }
        onConfirm={handleTimeConfirm}
        onCancel={handleTimeCancel}
      />
      <SelectRegionConfirmModal
        isOpen={isRegionModalOpen}
        regions={regionOptions}
        initialSelectedId={initialRegionId}
        onConfirm={handleRegionConfirm}
        onCancel={handleRegionCancel}
      />
    </div>
  );
};
