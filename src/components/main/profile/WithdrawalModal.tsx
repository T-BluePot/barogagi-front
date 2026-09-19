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

  /** 현재 선택된 사유의 원본 DTO. 서버로 보낼 reasonNo 와 필수 여부 판정에 쓴다 */
  const selectedReasonItem = reasons.find(
    (r: WithdrawalReasonDTO) => r.reasonNm === selectedReason
  );

  /**
   * 사유 텍스트가 필수인지. 서버가 `essentialYn` 으로 알려준다("기타" 등).
   *
   * ⚠️ 이걸 안 보면 확인 버튼이 그냥 눌리고, 서버가 `D402 탈퇴 사유를 입력해주세요` 로
   *    거절한다. 그런데 화면에는 "탈퇴에 실패했습니다" 만 떠서 사용자는 이유를 모른 채
   *    같은 실패를 반복하게 된다 — 사실상 탈퇴가 막힌다. (실측 확인)
   */
  const isDetailRequired = selectedReasonItem?.essentialYn === "Y";

  const isConfirmDisabled =
    !selectedReason || (isDetailRequired && !detail.trim());

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
    if (isConfirmDisabled || !selectedReasonItem) return;
    const trimmed = detail.trim();
    onConfirm(selectedReasonItem.reasonNo, trimmed || undefined);
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
      {/* 제목은 다른 모달과 같은 규격을 쓰도록 공용 컴포넌트에 맡기고,
          본문 자리에 확인 사항 섹션을 넘긴다.
          섹션은 왼쪽 정렬이다 — 모달 컨테이너가 text-center 라 그대로 두면
          불릿이 가운데로 몰려 문장 시작점이 줄마다 어긋난다. */}
      <CommonModalContent title={WITHDRAWAL_MODAL_TEXT.TITLE}>
        {/* -mx-4 로 부모(CommonModalContent)의 mx-4 를 상쇄한다 —
            아래 사유 선택·입력은 mx-4 밖이라, 이게 없으면 이 섹션만 32px 좁게 들어간다 */}
        <section className="-mx-4 mb-4 rounded-lg bg-gray-5 px-3.5 py-3 text-left">
          <h2 className="typo-caption mb-2 font-bold text-gray-black">
            {WITHDRAWAL_MODAL_TEXT.NOTICE_TITLE}
          </h2>
          {/* 항목은 제목(14px)보다 한 단계 작은 12px —
              두 줄씩 넘어가는 문장이라 14px 로는 덩어리져 보인다 */}
          <ul className="flex flex-col gap-1.5">
            {WITHDRAWAL_MODAL_TEXT.NOTICES.map((notice) => (
              <li key={notice} className="flex gap-1.5">
                <span aria-hidden className="typo-description text-gray-30">
                  •
                </span>
                <span className="typo-description text-gray-50">{notice}</span>
              </li>
            ))}
          </ul>
        </section>
      </CommonModalContent>

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

      {/* 확인 버튼이 반응하지 않는 이유를 알려준다 — 안내가 없으면 버튼이 고장 난 것으로 보인다 */}
      {isDetailRequired && !detail.trim() && (
        <p className="typo-caption mt-1.5 text-left text-alert-red">
          {WITHDRAWAL_MODAL_TEXT.DETAIL_REQUIRED}
        </p>
      )}
    </CommonConfirmModalLayout>
  );
};

export default WithdrawalModal;
