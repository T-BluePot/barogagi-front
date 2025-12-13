import { CommonBottomModal } from "../../../../common/modal/bottom-modal/CommonBottomModal";
import { PlanCategoryBottomModalContent } from "./content/PlanCategoryBottomModalContent";

// content에서 타입 re-export
export type {
  CategoryType,
  CategoryOption,
} from "./content/PlanCategoryBottomModalContent";

interface PlanCategoryBottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (
    category: "식사" | "카페" | "체험" | "놀거리" | "탐방" | "레저",
    option: {
      id: string;
      label: string;
      isRandom?: boolean;
      isCustom?: boolean;
    }
  ) => void;
}

export const PlanCategoryBottomModal = ({
  isOpen,
  onClose,
  onSelectOption,
}: PlanCategoryBottomModalProps) => {
  return (
    <CommonBottomModal isOpen={isOpen} onClose={onClose} title="일정 추가하기">
      <PlanCategoryBottomModalContent onSelectOption={onSelectOption} />
    </CommonBottomModal>
  );
};

export default PlanCategoryBottomModal;
