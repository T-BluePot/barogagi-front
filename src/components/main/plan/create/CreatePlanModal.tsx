import CommonConfirmModal from "@/components/modal/CommonConfirmModal";

import { ROUTES_CREATE_TEXT } from "@/constants/texts/main/plan/routesCreate";

interface CreatePlanModalProps {
  isConfirmOpen: boolean;
  onConfirmCancel: () => void;
  onConfirmConfirm: () => void;
}

export const CreatePlanModal = ({
  isConfirmOpen,
  onConfirmCancel,
  onConfirmConfirm,
}: CreatePlanModalProps) => {
  return (
    <CommonConfirmModal
      isOpen={isConfirmOpen}
      cancelButtonInfo={{
        label: ROUTES_CREATE_TEXT.CONFIRM_MODAL.CANCEL_LABEL,
        onClick: onConfirmCancel,
      }}
      confirmButtonInfo={{
        label: ROUTES_CREATE_TEXT.CONFIRM_MODAL.CONFIRM_LABEL,
        onClick: onConfirmConfirm,
      }}
      modalContent={{
        title: ROUTES_CREATE_TEXT.CONFIRM_MODAL.TITLE,
        content: ROUTES_CREATE_TEXT.CONFIRM_MODAL.CONTENTS,
      }}
    />
  );
};
