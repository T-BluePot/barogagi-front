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
import type { RegionOption } from "@/components/main/plan/common/modal/content/SelectRegionConfirmModalContent";
import type { TagOption } from "@/components/main/plan/common/modal/content/SelectTagConfirmModalContent";
import { timeValueToHHmm, hhmmToTimeValue } from "@/utils/date";
import type { TimeValue } from "@/utils/date";
import Button from "@/components/common/buttons/CommonButton";
import { ROUTES } from "@/constants/routes";
import { useConfirmModalStore } from "@/stores/confirmModalStore";
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";

// === type ===
import type { SelectedCategoryItemType } from "@/types/api/scheduleTypes";

export const PlanSettingPage = () => {
  const navigate = useNavigate();
  const { openConfirmModal } = useConfirmModalStore();
  const selectedRegions = useRegionSelectionStore((s) => s.selectedRegions);
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

  // === Edit 모드 상태 ===
  const [editTargetId, setEditTargetId] = useState<string | number | null>(
    null
  );
  const [editNote, setEditNote] = useState("");

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

  // SelectLocationPage에서 선택한 지역을 RegionOption 형태로 변환
  const regionOptions: RegionOption[] = selectedRegions.map((r) => ({
    id: String(r.regionNum),
    label: r.regionNm,
  }));

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

  // === PlanCard 클릭 → Edit 모드 ===
  const handleCardClick = (id: string | number) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    setEditTargetId(id);
    setPlanFormDraft({
      planNm: target.title,
      startTime: target.startTime,
      endTime: target.endTime,
      address: target.location,
    });
    setEditNote("");
    setIsPlanFormModalOpen(true);
  };

  const closePlanForm = () => {
    setIsPlanFormModalOpen(false);
    setPlanFormDraft(null);
    setEditTargetId(null);
    setEditNote("");
  };

  const handlePlanFormClose = () => {
    if (planFormDraft && (!planFormDraft.startTime || !planFormDraft.endTime)) {
      openConfirmModal(
        {
          title: "일정 추가를 취소하시겠습니까?",
          content: "시간을 선택하지 않으면 일정이 저장되지 않습니다.",
          confirmLabel: "취소하기",
          cancelLabel: "돌아가기",
        },
        () => {
          // 확인: 일정 추가 취소
          closePlanForm();
        }
      );
      return;
    }

    if (planFormDraft && editTargetId !== null) {
      // Edit 모드: 기존 아이템 업데이트
      setItems((prev) =>
        prev.map((item) =>
          item.id === editTargetId
            ? {
                ...item,
                title: planFormDraft.planNm,
                startTime: planFormDraft.startTime,
                endTime: planFormDraft.endTime,
                location: planFormDraft.address,
              }
            : item
        )
      );
    } else if (planFormDraft) {
      // Create 모드: 새 아이템 추가
      const newPlan: PlanData = {
        id: String(Date.now()),
        title: planFormDraft.planNm,
        startTime: planFormDraft.startTime,
        endTime: planFormDraft.endTime,
        location: planFormDraft.address,
      };
      setItems((prev) => [...prev, newPlan]);
    }

    closePlanForm();
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

  // === 태그 선택 모달 ===
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // TODO: 추후 백엔드 API에서 태그 목록을 가져와서 교체
  const tagOptions: TagOption[] = [
    { id: "1", label: "분위기 좋은" },
    { id: "2", label: "자리가 편한" },
    { id: "3", label: "뷰가 좋은" },
    { id: "4", label: "저렴한" },
    { id: "5", label: "핫플" },
  ];

  const handlePlanFormTagsClick = () => {
    setIsTimeModalOpen(false);
    setTimeEditTargetId(null);
    setIsRegionModalOpen(false);
    setRegionEditTargetId(null);
    setIsTagModalOpen(true);
  };

  const handleTagConfirm = (tags: TagOption[]) => {
    setPlanFormDraft((prev) =>
      prev ? { ...prev, tags: tags.map((t) => t.label) } : null
    );
    setIsTagModalOpen(false);
  };

  const handleTagCancel = () => {
    setIsTagModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-auto p-4">
        <PlanSettingForm
          initialItems={items}
          onAddPlan={handleAddPlan}
          onOrderChange={handleOrderChange}
          onCardClick={handleCardClick}
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
        info={
          editTargetId !== null
            ? {
                mode: "Edit",
                planNm: planFormDraft?.planNm,
                startTime: planFormDraft?.startTime,
                endTime: planFormDraft?.endTime,
                address: planFormDraft?.address,
                note: "메모",
                noteValue: editNote,
                onChangeNote: setEditNote,
                onClickTime: handlePlanFormTimeClick,
                onClickAddress: handlePlanFormAddressClick,
              }
            : {
                mode: "Create",
                planNm: planFormDraft?.planNm,
                startTime: planFormDraft?.startTime,
                endTime: planFormDraft?.endTime,
                address: planFormDraft?.address,
                tags: planFormDraft?.tags,
                onClickTime: handlePlanFormTimeClick,
                onClickAddress: handlePlanFormAddressClick,
                onClickTags: handlePlanFormTagsClick,
              }
        }
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
      <SelectTagConfirmModal
        isOpen={isTagModalOpen}
        tags={tagOptions}
        initialSelectedIds={
          planFormDraft?.tags
            ? tagOptions
                .filter((t) => planFormDraft.tags!.includes(t.label))
                .map((t) => t.id)
            : []
        }
        onConfirm={handleTagConfirm}
        onCancel={handleTagCancel}
      />
    </div>
  );
};
