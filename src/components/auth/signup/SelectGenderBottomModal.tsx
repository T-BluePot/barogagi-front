import { GENDER_LIST } from "@/types/auth/gender";
import type { GenderType } from "@/types/auth/gender";

import { CommonBottomModal } from "@/components/common/bottom-modal/CommonBottomModal";
import { BottomModalListButton } from "@/components/common/bottom-modal/BottomModalListButton";

interface GenderSelectListProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGender: GenderType | null;
  onSelectGender: (gender: GenderType) => void;
}

export const SelectGenderBottomModal = ({
  isOpen,
  onClose,
  selectedGender,
  onSelectGender,
}: GenderSelectListProps) => {
  return (
    <CommonBottomModal
      title="성별을 선택해주세요"
      isOpen={isOpen}
      onClose={onClose}
    >
      {GENDER_LIST.map(({ id, label }) => (
        <BottomModalListButton
          key={id}
          label={label}
          isChecked={selectedGender === id}
          onClickChecked={() => {
            onSelectGender(id);
            onClose();
          }}
        />
      ))}
    </CommonBottomModal>
  );
};
