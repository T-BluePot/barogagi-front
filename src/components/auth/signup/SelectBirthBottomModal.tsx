import { CommonBottomModal } from "@/components/common/bottom-modal/CommonBottomModal";
import { BirthdayPicker } from "@/components/common/BirthdayPicker";
import type { BirthdayPickerProps } from "@/components/common/BirthdayPicker";

interface SelectBirthBottomModalProps extends BirthdayPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SelectBirthBottomModal = ({
  isOpen,
  onClose,
  ...birthProps
}: SelectBirthBottomModalProps) => {
  return (
    <CommonBottomModal
      title="생년월일을 선택해주세요"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col w-full px-6">
        <BirthdayPicker {...birthProps} />
        <button
          onClick={onClose}
          className="flex h-14 items-center justify-center border-t border-gray-5 cursor-pointer"
        >
          <span className="typo-body text-gray-black">확인</span>
        </button>
      </div>
    </CommonBottomModal>
  );
};
