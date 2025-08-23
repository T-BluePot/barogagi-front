import { GENDER_LIST } from "@/types/auth/gender";
import type { SelectGenderProps } from "@/types/profileTypes";

import { CommonBottomModal } from "@/components/common/bottom-modal/CommonBottomModal";
import { BottomModalListButton } from "@/components/common/bottom-modal/BottomModalListButton";

export const SelectGenderBottomModal = ({
  isGenderModalOpen,
  handleCloseGenderModal,
  gender,
  setGender,
}: SelectGenderProps) => {
  return (
    <CommonBottomModal
      title="성별을 선택해주세요"
      isOpen={isGenderModalOpen}
      onClose={handleCloseGenderModal}
    >
      {GENDER_LIST.map(({ id, label }) => (
        <BottomModalListButton
          key={id}
          label={label}
          isChecked={gender === id}
          onClickChecked={() => {
            setGender(id);
            handleCloseGenderModal();
          }}
        />
      ))}
    </CommonBottomModal>
  );
};
