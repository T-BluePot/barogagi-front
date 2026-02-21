import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlanSettingForm } from "@/components/main/plan/PlanSettingForm";
import DeletePlanModal from "@/components/main/plan/create/DeletePlanModal";
import type { PlanData } from "@/components/main/plan/PlanCard";
import PlanCategoryBottomModal from "@/components/main/plan/common/modal/PlanCategoryBottomModal";
import { SelectTimeConfirmModal } from "@/components/main/plan/common/modal/SelectTimeConfirmModal";
import { SelectRegionConfirmModal } from "@/components/main/plan/common/modal/SelectRegionConfirmModal";
import type { TimeValue } from "@/components/main/plan/common/modal/content/SelectTimeConfirmModalContent";
import type { RegionOption } from "@/components/main/plan/common/modal/content/SelectRegionConfirmModalContent";
import Button from "@/components/common/buttons/CommonButton";
import { ROUTES } from "@/constants/routes";

// === type ===
import type { SelectedCategoryItemType } from "@/types/api/scheduleTypes";

// 임시 mock 데이터
const mockItems: PlanData[] = [
  {
    id: "1",
    title: "한강 라면",
    startTime: "11:30",
    endTime: "12:30",
    location: "서울시 종로구",
  },
  {
    id: "2",
    title: "카페 방문",
    startTime: "13:00",
    endTime: "14:00",
    location: "서울시 강남구",
  },
  {
    id: "3",
    emoji: "🎬",
    title: "영화 관람",
    startTime: "15:00",
    endTime: "17:30",
    location: "서울시 마포구",
  },
];

export const PlanSettingPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<PlanData[]>(mockItems);
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

    const formatTime = (t: TimeValue) => {
      let hour = Number(t.hour);
      if (t.period === "오후" && hour < 12) hour += 12;
      if (t.period === "오전" && hour === 12) hour = 0;
      return `${String(hour).padStart(2, "0")}:${t.minute}`;
    };

    setItems((prev) =>
      prev.map((item) =>
        item.id === timeEditTargetId
          ? { ...item, startTime: formatTime(startTime), endTime: formatTime(endTime) }
          : item
      )
    );
    setIsTimeModalOpen(false);
    setTimeEditTargetId(null);
  };

  const handleTimeCancel = () => {
    setIsTimeModalOpen(false);
    setTimeEditTargetId(null);
  };

  // 현재 편집 대상의 기존 시간을 TimeValue로 변환
  const getInitialTimeValue = (
    timeStr?: string
  ): TimeValue | undefined => {
    if (!timeStr) return undefined;
    const [hourStr, minute] = timeStr.split(":");
    let hour = Number(hourStr);
    const period: "오전" | "오후" = hour >= 12 ? "오후" : "오전";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return { period, hour: String(hour).padStart(2, "0"), minute };
  };

  const timeEditTarget = items.find((item) => item.id === timeEditTargetId);

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

    setItems((prev) =>
      prev.map((item) =>
        item.id === regionEditTargetId
          ? { ...item, location: region?.label ?? undefined }
          : item
      )
    );
    setIsRegionModalOpen(false);
    setRegionEditTargetId(null);
  };

  const handleRegionCancel = () => {
    setIsRegionModalOpen(false);
    setRegionEditTargetId(null);
  };

  const regionEditTarget = items.find((item) => item.id === regionEditTargetId);
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
    const newPlan: PlanData = {
      id: String(Date.now()),
      title: selected.option.itemNm,
    };
    setItems((prev) => [...prev, newPlan]);
    handleCategoryModalClose();
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
      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClickConfirm={handleConfirmDelete}
        onClickCancel={handleCancelDelete}
      />
      <SelectTimeConfirmModal
        isOpen={isTimeModalOpen}
        initialStartTime={getInitialTimeValue(timeEditTarget?.startTime)}
        initialEndTime={getInitialTimeValue(timeEditTarget?.endTime)}
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
