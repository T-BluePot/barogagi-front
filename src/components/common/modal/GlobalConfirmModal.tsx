import CommonConfirmModal from "@/components/common/modal/common-modal/CommonConfirmModal";
import { useConfirmModalStore } from "@/stores/confirmModalStore";

/**
 * 전역 확인 모달
 * App.tsx에 마운트하여 어디서든 store를 통해 확인 모달을 표시할 수 있습니다.
 */
const GlobalConfirmModal = () => {
  const { isOpen, modalContent, closeConfirmModal, confirmModal } =
    useConfirmModalStore();

  if (!modalContent) return null;

  return (
    <CommonConfirmModal
      isOpen={isOpen}
      modalContent={{
        title: modalContent.title,
        content: modalContent.content ?? "",
      }}
      confirmButtonInfo={{
        label: modalContent.confirmLabel ?? "확인",
        onClick: confirmModal,
      }}
      cancelButtonInfo={{
        label: modalContent.cancelLabel ?? "취소",
        onClick: closeConfirmModal,
      }}
    />
  );
};

export default GlobalConfirmModal;
