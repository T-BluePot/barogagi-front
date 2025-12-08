import CommonConfirmModal from "@/components/common/modal/common-modal/CommonConfirmModal";
import { LOCATION_SEARCH_TEXT } from "@/constants/texts/main/plan/locationSearch";

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
        title: LOCATION_SEARCH_TEXT.CLEAR_ALL_MODAL.TITLE,
        content: LOCATION_SEARCH_TEXT.CLEAR_ALL_MODAL.CONTENT,
      }}
      confirmButtonInfo={{
        label: LOCATION_SEARCH_TEXT.CLEAR_ALL_MODAL.CONFIRM_LABEL,
        onClick: handleClearAll,
      }}
      cancelButtonInfo={{
        label: LOCATION_SEARCH_TEXT.CLEAR_ALL_MODAL.CANCEL_LABEL,
        onClick: handleCancel,
      }}
    />
  );
};

export default ClearAllModal;
