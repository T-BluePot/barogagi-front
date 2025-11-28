import CommonConfirmModal from "@/components/modal/CommonConfirmModal";
import { ROUTES_CREATE_TEXT } from "@/constants/texts/main/plan/routesCreate";

interface DeletePlanModalProps {
  isOpen: boolean;
  onClickConfirm: () => void;
  onClickCancle: () => void;
}

const DeletePlanModal = ({
  isOpen,
  onClickConfirm,
  onClickCancle,
}: DeletePlanModalProps) => {
  return (
    <CommonConfirmModal
      isOpen={isOpen}
      modalContent={{
        title: ROUTES_CREATE_TEXT.POP_MENU.DELETE_MODAL.TITLE,
        content: ROUTES_CREATE_TEXT.POP_MENU.DELETE_MODAL.CONTENT,
      }}
      confirmButtonInfo={{
        label: ROUTES_CREATE_TEXT.POP_MENU.DELETE_MODAL.CONFIRM_LABEL,
        onClick: onClickConfirm,
      }}
      cancelButtonInfo={{
        label: ROUTES_CREATE_TEXT.POP_MENU.DELETE_MODAL.CANCLE_LABEL,
        onClick: onClickCancle,
      }}
    />
  );
};

export default DeletePlanModal;
