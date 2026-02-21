import { useState, type Dispatch, type SetStateAction } from "react";
import type { PlanData } from "@/components/main/plan/PlanCard";

/**
 * 일정 삭제 모달 상태 관리
 * 카드 스와이프 → 삭제 버튼 → 삭제 확인 모달
 */
export const usePlanDelete = (
  setItems: Dispatch<SetStateAction<PlanData[]>>
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | number | null>(null);

  const handleDeleteClick = (id: string | number) => {
    setTargetId(id);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (targetId !== null) {
      setItems((prev) => prev.filter((item) => item.id !== targetId));
    }
    setIsOpen(false);
    setTargetId(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTargetId(null);
  };

  return {
    handleDeleteClick,
    deleteModalProps: {
      isOpen,
      onClickConfirm: handleConfirm,
      onClickCancel: handleCancel,
    },
  };
};
