import { ActionBottomModal } from "@/components/common/modal/bottom-modal/ActionBottomModal ";
import { PlanCategoryBottomModalContent } from "./content/PlanCategoryBottomModalContent";
import type { SelectedCategoryItemType } from "@/types/api/scheduleTypes";

interface PlanCategoryBottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (selected: SelectedCategoryItemType) => void;
  onClickAction: () => void;
}

export const PlanCategoryBottomModal = ({
  isOpen,
  onClose,
  onSelectOption,
  onClickAction,
}: PlanCategoryBottomModalProps) => {
  return (
    <ActionBottomModal
      isOpen={isOpen}
      onClose={onClose}
      title="일정 추가하기"
      actionLabel="직접 등록하기"
      onClickAction={onClickAction}
    >
      <PlanCategoryBottomModalContent onSelectOption={onSelectOption} />
    </ActionBottomModal>
  );
};

export default PlanCategoryBottomModal;
