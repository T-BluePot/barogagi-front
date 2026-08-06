import CommonConfirmModal from "@/components/common/modal/common-modal/CommonConfirmModal";
import { useConfirmModalStore } from "@/stores/confirmModalStore";
import { useNativeBack } from "@/utils/nativeBackHandler";

/**
 * 전역 확인 모달
 * App.tsx에 마운트하여 어디서든 store를 통해 확인 모달을 표시할 수 있습니다.
 */
const GlobalConfirmModal = () => {
  const { isOpen, modalContent, closeConfirmModal, cancelModal, confirmModal } =
    useConfirmModalStore();

  // 하드웨어 백 → 닫기 전용 (onCancel 액션 실행 안 함)
  useNativeBack(isOpen && !!modalContent, closeConfirmModal);

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
        onClick: cancelModal, // 취소 "버튼"만 onCancel 액션 실행
      }}
      onDismiss={closeConfirmModal} // 배경 클릭/하드웨어 백은 닫기만
    />
  );
};

export default GlobalConfirmModal;
