import CommonAlertModal from "@/components/common/modal/common-modal/CommonAlertModal";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useNativeBack } from "@/utils/nativeBackHandler";

/**
 * 전역 알림 모달
 * App.tsx에 마운트하여 어디서든 store를 통해 알림을 표시할 수 있습니다.
 */
const GlobalAlertModal = () => {
  const { isOpen, modalContent, closeAlertModal } = useAlertModalStore();

  // 하드웨어 백 → 알림 닫기
  useNativeBack(isOpen && !!modalContent, closeAlertModal);

  if (!modalContent) return null;

  return (
    <CommonAlertModal
      isOpen={isOpen}
      modalContent={{
        title: modalContent.title,
        content: modalContent.content ?? "",
      }}
      buttonInfo={{
        label: modalContent.buttonLabel ?? "확인",
        onClick: closeAlertModal,
      }}
    />
  );
};

export default GlobalAlertModal;
