import { CommonBottomModal } from "@/components/common/modal/bottom-modal/CommonBottomModal";
import { BirthdayPicker } from "@/components/common/BirthdayPicker";

import type { SelectBirthProps } from "@/types/profileTypes";

export const SelectBirthBottomModal = ({
  isBirthModalOpen,
  handleCloseBirthModal,
  userBirthYear,
  userBirthMonth,
  userBirthDay,
  handleChangeBirth,
}: SelectBirthProps) => {
  return (
    <CommonBottomModal
      title="생년월일을 선택해주세요"
      isOpen={isBirthModalOpen}
      onClose={handleCloseBirthModal}
    >
      <div className="flex flex-col w-full px-6">
        <BirthdayPicker
          userBirthYear={userBirthYear}
          userBirthMonth={userBirthMonth}
          userBirthDay={userBirthDay}
          onChange={handleChangeBirth}
        />
        <button
          onClick={handleCloseBirthModal}
          className="flex h-14 items-center justify-center border-t border-gray-5 cursor-pointer"
        >
          <span className="typo-body text-gray-black">확인</span>
        </button>
      </div>
    </CommonBottomModal>
  );
};
