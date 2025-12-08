import CommonConfirmModal from "@/components/common/modal/common-modal/CommonConfirmModal";

export interface ClearAllModalProps {
  isOpen: boolean;
  handleClearAll: () => void;
  handleCancel: () => void;
}

const ClearAllModal = ({
  isOpen,
  handleClearAll,
  handleCancel,
}: ClearAllModalProps) => {
  return (
    <CommonConfirmModal
      isOpen={isOpen}
      modalContent={{
        title: "최근 검색어를 모두 삭제하시겠어요?",
        content: "삭제한 검색어는 복구할 수 없습니다.",
      }}
      confirmButtonInfo={{ label: "삭제", onClick: handleClearAll }}
      cancelButtonInfo={{ label: "취소", onClick: handleCancel }}
    />
  );
};

export default ClearAllModal;
