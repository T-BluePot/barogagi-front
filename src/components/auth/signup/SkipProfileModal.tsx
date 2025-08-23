import CommonConfirmModal from "@/components/modal/CommonConfirmModal";
import { PROFILE_TEXT } from "@/constants/texts/auth/signup/profile";

import type { SkipProfileProps } from "@/types/profileTypes";

export const SkipProfileModal = ({
  isSkipModalOpen,
  handleCloseSkipModal,
  handleSkipProfile,
}: SkipProfileProps) => {
  return (
    <CommonConfirmModal
      isOpen={isSkipModalOpen}
      cancelButtonInfo={{
        label: PROFILE_TEXT.SKIP_MODAL.CANCEL_LABEL,
        onClick: handleCloseSkipModal,
      }}
      confirmButtonInfo={{
        label: PROFILE_TEXT.SKIP_MODAL.CONFIRM_LABEL,
        onClick: handleSkipProfile,
      }}
      modalContent={{
        title: PROFILE_TEXT.SKIP_MODAL.TITLE,
        content: PROFILE_TEXT.SKIP_MODAL.SUB_TITLE,
      }}
    />
  );
};
