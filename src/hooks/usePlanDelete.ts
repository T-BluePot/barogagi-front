import { useState, type Dispatch, type SetStateAction } from "react";
import type { PlanData } from "@/components/main/plan/PlanCard";
import { useScheduleDraftStore } from "@/stores/scheduleStore";

/**
 * 일정 삭제 모달 상태 관리 훅
 *
 * [흐름]
 * 카드 스와이프 → 삭제 버튼 클릭 → 삭제 확인 모달 표시 → 확인/취소
 *
 * @param setItems - 부모(PlanSettingPage)의 일정 목록 상태 변경 함수
 *
 * @returns
 * - handleDeleteClick : 삭제 버튼 클릭 시 호출 (어떤 카드를 삭제할지 기억)
 * - deleteModalProps  : DeletePlanModal 컴포넌트에 그대로 전달할 props
 */
export const usePlanDelete = (
  setItems: Dispatch<SetStateAction<PlanData[]>>
) => {
  // 삭제 확인 모달 열림 여부
  const [isOpen, setIsOpen] = useState(false);
  // 삭제 대상 카드의 id (null이면 아직 선택 안 됨)
  const [targetId, setTargetId] = useState<number | null>(null);

  const { removePlan } = useScheduleDraftStore();

  /** 카드의 삭제 버튼 클릭 → 대상 id를 저장하고 모달 열기 */
  const handleDeleteClick = (id: number) => {
    setTargetId(id);
    setIsOpen(true);
  };

  /** 모달에서 "확인" → 해당 카드를 목록에서 제거 후 모달 닫기 */
  const handleConfirm = () => {
    if (targetId !== null) {
      removePlan(targetId);
      setItems((prev) => {
        const filtered = prev.filter((item) => item.id !== targetId);
        return filtered.map((item, i) => ({ ...item, id: i })); // ← id 재할당
      });
    }
    setIsOpen(false);
    setTargetId(null);
  };

  /** 모달에서 "취소" → 아무 변경 없이 모달 닫기 */
  const handleCancel = () => {
    setIsOpen(false);
    setTargetId(null);
  };

  return {
    handleDeleteClick,
    /** DeletePlanModal에 스프레드로 전달: <DeletePlanModal {...deleteModalProps} /> */
    deleteModalProps: {
      isOpen,
      onClickConfirm: handleConfirm,
      onClickCancel: handleCancel,
    },
  };
};
