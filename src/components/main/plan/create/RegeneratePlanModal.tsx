import CommonConfirmModal from "@/components/modal/CommonConfirmModal";

import { ROUTES_CREATE_TEXT } from "@/constants/texts/main/plan/routesCreate";

interface RegeneratePlanModalProps {
  isRegenerateOpen: boolean;
  onRegenerateCancel: () => void;
  onCegenerateConfirm: () => void;
}

export const RegeneratePlanModal = ({
  isRegenerateOpen,
  onRegenerateCancel,
  onCegenerateConfirm,
}: RegeneratePlanModalProps) => {
  return (
    <CommonConfirmModal
      isOpen={isRegenerateOpen}
      cancelButtonInfo={{
        label: ROUTES_CREATE_TEXT.REGENERATE_MODAL.CANCEL_LABEL,
        onClick: onRegenerateCancel,
      }}
      confirmButtonInfo={{
        label: ROUTES_CREATE_TEXT.REGENERATE_MODAL.CONFIRM_LABEL,
        onClick: onCegenerateConfirm,
      }}
      modalContent={{
        title: ROUTES_CREATE_TEXT.REGENERATE_MODAL.TITLE,
        content: ROUTES_CREATE_TEXT.REGENERATE_MODAL.CONTENTS,
      }}
    />
  );
};
