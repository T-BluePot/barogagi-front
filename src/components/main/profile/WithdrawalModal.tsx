import { useEffect, useState } from "react";
import CommonConfirmModalLayout from "@/components/layout/CommonConfirmModalLayout";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    setIsDropdownOpen(false);
    if (reason !== "기타") {
      setDetail("");
    }
  };

  const resetState = () => {
    setSelectedReason(null);
    setDetail("");
    setIsDropdownOpen(false);
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

      {/* 탈퇴 사유 드롭다운 */}
      <div className="flex flex-col gap-1 text-left">
        <span className="typo-caption text-main-default">
          {WITHDRAWAL_MODAL_TEXT.REASON_LABEL}
        </span>

        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center justify-between w-full py-3 border-b-2 border-main-default cursor-pointer"
        >
          <span
            className={`typo-subtitle ${
              selectedReason ? "text-gray-black" : "text-gray-40"
            }`}
          >
            {selectedReason ?? WITHDRAWAL_MODAL_TEXT.REASON_PLACEHOLDER}
          </span>
          <svg
            className={`w-5 h-5 text-gray-50 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* 드롭다운 목록 */}
        {isDropdownOpen && (
          <ul className="flex flex-col bg-gray-10 rounded-lg overflow-hidden">
            {WITHDRAWAL_REASONS.map((reason) => (
              <li key={reason}>
                <button
                  type="button"
                  onClick={() => handleSelectReason(reason)}
                  className={`w-full text-left px-4 py-3 typo-body cursor-pointer transition-colors ${
                    selectedReason === reason
                      ? "bg-main-light text-main-default"
                      : "text-gray-black hover:bg-gray-20"
                  }`}
                >
                  {reason}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 기타 사유 입력 (기타 선택 시에만 노출) */}
      {isOtherReason && (
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder={WITHDRAWAL_MODAL_TEXT.DETAIL_PLACEHOLDER}
          maxLength={500}
          className="w-full min-h-40 p-4 mt-4 bg-gray-10 rounded-lg resize-none typo-body text-gray-black placeholder:text-gray-40 focus:outline-none"
        />
      )}
    </CommonConfirmModalLayout>
  );
};

export default WithdrawalModal;
