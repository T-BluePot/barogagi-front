import { useState } from "react";
import { PlanSettingForm } from "@/components/main/plan/PlanSettingForm";
import DeletePlanModal from "@/components/main/plan/create/DeletePlanModal";
import type { PlanData } from "@/components/main/plan/PlanCard";
import PlanCategoryBottomModal from "@/components/common/modal/bottom-modal/PlanCategoryBottomModal";

// 임시 mock 데이터
const mockItems: PlanData[] = [
  {
    id: "1",
    emoji: "🍜",
    title: "한강 라면",
    startTime: "11:30",
    endTime: "12:30",
    location: "서울시 종로구",
  },
  {
    id: "2",
    emoji: "☕",
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
    // TODO: 일정 추가 로직
    console.log("일정 추가");
    handleCategoryModalOpen();
  };

  const handleTimeClick = (id: string | number) => {
    console.log("시간 수정:", id);
  };

  const handleLocationClick = (id: string | number) => {
    console.log("위치 수정:", id);
  };

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleCategoryModalOpen = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
  };

  return (
    <div className="p-4">
      <PlanSettingForm
        initialItems={items}
        onAddPlan={handleAddPlan}
        onOrderChange={handleOrderChange}
        onDeleteClick={handleDeleteClick}
        onTimeClick={handleTimeClick}
        onLocationClick={handleLocationClick}
      />
      <PlanCategoryBottomModal
        isOpen={isCategoryModalOpen}
        onClose={handleCategoryModalClose}
      />
      <DeletePlanModal
        isOpen={isDeleteModalOpen}
        onClickConfirm={handleConfirmDelete}
        onClickCancel={handleCancelDelete}
      />
    </div>
  );
};
