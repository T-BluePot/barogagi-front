import { useState, useEffect, useRef, useCallback } from "react";
import CommonConfirmModalLayout from "@/components/common/modal/common-modal/CommonConfirmModalLayout";
import ScheduleTitleInput from "../ScheduleTitleInput";

export interface PlanNameInputModalProps {
  isOpen: boolean;
  onConfirm: (planNm: string) => void;
  onCancel: () => void;
  initialValue?: string;
}

/**
 * 직접 일정 추가 시 일정명을 입력받는 모달
 * - 확인: planNm을 부모로 전달
 * - 취소 / 배경 클릭: 입력값 버림
 */
const PlanNameInputModal = ({
  isOpen,
  onConfirm,
  onCancel,
  initialValue,
}: PlanNameInputModalProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [showAnimation, setShowAnimation] = useState(false);
  const [planNm, setPlanNm] = useState("");

  const prevIsOpenRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const handleCloseComplete = useCallback(() => {
    setShouldRender(false);
  }, []);

  useEffect(() => {
    const justOpened = isOpen && !prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (justOpened) {
      setPlanNm(initialValue ?? ""); // 수정 모드면 기존 값, 아니면 빈 문자열로 초기화
      setShouldRender(true);
      rafIdRef.current = requestAnimationFrame(() => setShowAnimation(true));
    } else if (!isOpen) {
      setShowAnimation(false);
    }

    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isOpen]);

  const handleConfirm = () => {
    const trimmed = planNm.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
  };

  if (!shouldRender) return null;

  return (
    <CommonConfirmModalLayout
      isVisible={showAnimation}
      confirmButtonInfo={{ label: "확인", onClick: handleConfirm }}
      cancelButtonInfo={{ label: "취소", onClick: onCancel }}
      onCloseComplete={handleCloseComplete}
    >
      <div className="flex flex-col items-center gap-5">
        <h2 className="typo-subtitle text-gray-black">계획명을 작성해주세요</h2>
        <ScheduleTitleInput
          scheduleName={planNm}
          setScheduleName={setPlanNm}
          setEditMode={() => {}}
          placeholder="어떤 계획인가요?"
          size="small"
        />
      </div>
    </CommonConfirmModalLayout>
  );
};

export default PlanNameInputModal;
