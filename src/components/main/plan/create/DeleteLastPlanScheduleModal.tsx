import CommonConfirmModal from "@/components/common/modal/common-modal/CommonConfirmModal";
import { ROUTES_CREATE_TEXT } from "@/constants/texts/main/plan/routesCreate";

interface DeleteLastPlanScheduleModalProps {
  isOpen: boolean;
  onClickConfirm: () => void;
  onClickCancel: () => void;
}

const DeleteLastPlanScheduleModal = ({
  isOpen,
  onClickConfirm,
  onClickCancel,
}: DeleteLastPlanScheduleModalProps) => {
  return (
    <CommonConfirmModal
      isOpen={isOpen}
      severity="warning"
      modalContent={{
        title: ROUTES_CREATE_TEXT.POP_MENU.LAST_PLAN_DELETE_MODAL.TITLE,
        content: ROUTES_CREATE_TEXT.POP_MENU.LAST_PLAN_DELETE_MODAL.CONTENT,
      }}
      confirmButtonInfo={{
        label: ROUTES_CREATE_TEXT.POP_MENU.LAST_PLAN_DELETE_MODAL.CONFIRM_LABEL,
        onClick: onClickConfirm,
        variant: "destructive",
      }}
      cancelButtonInfo={{
        label: ROUTES_CREATE_TEXT.POP_MENU.LAST_PLAN_DELETE_MODAL.CANCEL_LABEL,
        onClick: onClickCancel,
      }}
    />
  );
};

export default DeleteLastPlanScheduleModal;
