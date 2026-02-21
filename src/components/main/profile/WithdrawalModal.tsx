import { useEffect, useState } from "react";
import CommonConfirmModalLayout from "@/components/layout/CommonConfirmModalLayout";
import CommonSelectBox from "@/components/common/inputs/CommonSelectBox";
import CommonTextarea from "@/components/common/inputs/CommonTextarea";
import {
  WITHDRAWAL_REASONS,
  WITHDRAWAL_MODAL_TEXT,
  type WithdrawalReason,
} from "@/constants/texts/main/profile/withdrawal";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: WithdrawalReason, detail: string) => void;
}

const WithdrawalModal = ({
  isOpen,
  onClose,
  onConfirm,
}: WithdrawalModalProps) => {
  const [selectedReason, setSelectedReason] = useState<WithdrawalReason | null>(
    null
  );
  const [detail, setDetail] = useState("");

  // 두 단계 애니메이션: shouldRenderLayout(마운트) + showAnimation(CSS 트랜지션)
  const [shouldRenderLayout, setShouldRenderLayout] = useState(isOpen);
  const [showAnimation, setShowAnimation] = useState(false);

  const isOtherReason = selectedReason === "기타";
  const isConfirmDisabled =
    !selectedReason || (isOtherReason && detail.trim() === "");

  useEffect(() => {
    if (isOpen) {
      setShouldRenderLayout(true);
      requestAnimationFrame(() => {
        setShowAnimation(true);
      });
    } else {
      setShowAnimation(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (isConfirmDisabled || !selectedReason) return;
    onConfirm(selectedReason, detail.trim());
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const handleSelectReason = (reason: WithdrawalReason) => {
    setSelectedReason(reason);
    if (reason !== "기타") {
      setDetail("");
    }
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
      {/* 제목 */}
      <h2 className="typo-title text-gray-black mb-2">
        {WITHDRAWAL_MODAL_TEXT.TITLE}
      </h2>

      {/* 안내 문구 */}
      <p className="typo-caption text-gray-50 whitespace-pre-line mb-4">
        {WITHDRAWAL_MODAL_TEXT.CONTENT}
      </p>

      {/* 탈퇴 사유 선택 */}
      <CommonSelectBox
        label={WITHDRAWAL_MODAL_TEXT.REASON_LABEL}
        placeholder={WITHDRAWAL_MODAL_TEXT.REASON_PLACEHOLDER}
        value={selectedReason}
        options={WITHDRAWAL_REASONS}
        onChange={handleSelectReason}
      />

      {/* 기타 사유 입력 (기타 선택 시에만 노출) */}
      {isOtherReason && (
        <CommonTextarea
          value={detail}
          onChange={setDetail}
          placeholder={WITHDRAWAL_MODAL_TEXT.DETAIL_PLACEHOLDER}
          maxLength={500}
          className="mt-4"
        />
      )}
    </CommonConfirmModalLayout>
  );
};

export default WithdrawalModal;
