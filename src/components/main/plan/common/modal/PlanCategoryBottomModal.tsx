import { CommonBottomModal } from "../../../../common/modal/bottom-modal/CommonBottomModal";
import { PlanCategoryBottomModalContent } from "./content/PlanCategoryBottomModalContent";
import type { SelectedCategoryItemType } from "@/types/api/scheduleTypes";

interface PlanCategoryBottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (selected: SelectedCategoryItemType) => void;
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
