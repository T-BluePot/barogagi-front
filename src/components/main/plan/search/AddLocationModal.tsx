import CommonConfirmModal from "@/components/common/modal/common-modal/CommonConfirmModal";

import { LOCATION_SEARCH_TEXT } from "@/constants/texts/main/plan/locationSearch";

interface AddLocationModalProps {
  isOpen: boolean;
  locationNm: string; // 지역명
  handleConfirm: () => void;
  handleCancel: () => void;
}

const AddLocationModal = ({
  isOpen,
  locationNm,
  handleConfirm,
  handleCancel,
}: AddLocationModalProps) => {
  return (
    <CommonConfirmModal
      isOpen={isOpen}
      modalContent={{
        title: LOCATION_SEARCH_TEXT.ADD_LOCATION_MODAL.TITLE,
        content: locationNm,
      }}
      confirmButtonInfo={{
        label: LOCATION_SEARCH_TEXT.ADD_LOCATION_MODAL.CONFIRM_LABEL,
        onClick: handleConfirm,
      }}
      cancelButtonInfo={{
        label: LOCATION_SEARCH_TEXT.ADD_LOCATION_MODAL.CANCEL_LABEL,
        onClick: handleCancel,
      }}
    />
  );
};

export default AddLocationModal;
