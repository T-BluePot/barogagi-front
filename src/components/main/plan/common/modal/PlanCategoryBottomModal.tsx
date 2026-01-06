import { CommonBottomModal } from "../../../../common/modal/bottom-modal/CommonBottomModal";
import {
  PlanCategoryBottomModalContent,
  type CategoryType,
  type CategoryOption,
} from "./content/PlanCategoryBottomModalContent";

interface PlanCategoryBottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (category: CategoryType, option: CategoryOption) => void;
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
