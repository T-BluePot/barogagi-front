import { useEffect, useState } from "react";
import CommonConfirmModalLayout from "@/components/common/modal/common-modal/CommonConfirmModalLayout";
import CommonModalContent from "@/components/common/modal/common-modal/CommonModalContent";
import CommonSelectBox from "@/components/common/inputs/CommonSelectBox";
import CommonTextarea from "@/components/common/inputs/CommonTextarea";
import { WITHDRAWAL_MODAL_TEXT } from "@/constants/texts/main/profile/withdrawal";
import { useWithdrawalReasonsQuery } from "@/hooks/queries/useWithdrawalReasonsQuery";
import type { WithdrawalReasonDTO } from "@/api/types";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reasonNo: number, withdrawReason?: string) => void;
}

const WithdrawalModal = ({
  isOpen,
  onClose,
  onConfirm,
}: WithdrawalModalProps) => {
  const { reasons } = useWithdrawalReasonsQuery();

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [detail, setDetail] = useState("");

  // 두 단계 애니메이션: shouldRenderLayout(마운트) + showAnimation(CSS 트랜지션)
  const [shouldRenderLayout, setShouldRenderLayout] = useState(isOpen);
  const [showAnimation, setShowAnimation] = useState(false);

  const isConfirmDisabled = !selectedReason;

  const reasonOptions = reasons.map((r: WithdrawalReasonDTO) => r.reasonNm);

  useEffect(() => {
    if (isOpen) {
      setShouldRenderLayout(true);
      const rafId = requestAnimationFrame(() => {
        setShowAnimation(true);
      });
      return () => cancelAnimationFrame(rafId);
    } else {
      setShowAnimation(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (isConfirmDisabled || !selectedReason) return;
    const matched = reasons.find((r: WithdrawalReasonDTO) => r.reasonNm === selectedReason);
    if (!matched) return;
    const trimmed = detail.trim();
    onConfirm(matched.reasonNo, trimmed || undefined);
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const resetState = () => {
    setSelectedReason(null);
    setDetail("");
  };

  if (!shouldRenderLayout) {
    return null;
  }

  return (
    <CommonConfirmModalLayout
      isVisible={showAnimation}
      contentClassName="overflow-visible"
      confirmButtonInfo={{
        label: WITHDRAWAL_MODAL_TEXT.CONFIRM_LABEL,
        onClick: handleConfirm,
      }}
      cancelButtonInfo={{
        label: WITHDRAWAL_MODAL_TEXT.CANCEL_LABEL,
        onClick: handleCancel,
      }}
      onCloseComplete={() => {
        setShouldRenderLayout(false);
        resetState();
      }}
    >
      {/* 제목·본문은 다른 모달과 같은 규격을 쓰도록 공용 컴포넌트에 맡긴다.
          직접 마크업하던 시절 `typo-title` 을 썼는데 그런 클래스가 없어서
          (`typo-title-01` / `typo-title-02` 만 존재) 제목 굵기가 600 이 아니라
          400 으로 떨어져 있었다. */}
      <CommonModalContent
        title={WITHDRAWAL_MODAL_TEXT.TITLE}
        content={WITHDRAWAL_MODAL_TEXT.CONTENT}
      />

      {/* 탈퇴 사유 선택 */}
      <CommonSelectBox
        label={WITHDRAWAL_MODAL_TEXT.REASON_LABEL}
        placeholder={WITHDRAWAL_MODAL_TEXT.REASON_PLACEHOLDER}
        value={selectedReason}
        options={reasonOptions}
        onChange={setSelectedReason}
      />

      {/* 사유 상세 입력 */}
      <CommonTextarea
        value={detail}
        onChange={setDetail}
        placeholder={WITHDRAWAL_MODAL_TEXT.DETAIL_PLACEHOLDER}
        maxLength={500}
        className="mt-4"
      />
    </CommonConfirmModalLayout>
  );
};

export default WithdrawalModal;
