import CommonConfirmModal from "@/components/common/modal/common-modal/CommonConfirmModal";
import { SCHEDULE_LIST_TEXT } from "@/constants/texts/main/plan/scheduleList";

interface DeleteScheduleModalProps {
  isOpen: boolean;
  onClickConfirm: () => void;
  onClickCancel: () => void;
}

const DeleteScheduleModal = ({
  isOpen,
  onClickConfirm,
  onClickCancel,
}: DeleteScheduleModalProps) => {
  return (
    <CommonConfirmModal
      isOpen={isOpen}
      modalContent={{
        title: SCHEDULE_LIST_TEXT.DELETE_MODAL.TITLE,
        content: SCHEDULE_LIST_TEXT.DELETE_MODAL.CONTENTS,
      }}
      confirmButtonInfo={{
        label: SCHEDULE_LIST_TEXT.DELETE_MODAL.CONFIRM_LABEL,
        onClick: onClickConfirm,
      }}
      cancelButtonInfo={{
        label: SCHEDULE_LIST_TEXT.DELETE_MODAL.CANCEL_LABEL,
        onClick: onClickCancel,
      }}
    />
  );
};

export default DeleteScheduleModal;
