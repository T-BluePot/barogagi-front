import { useState, useEffect } from "react";
import CommonConfirmModalLayout from "@/components/layout/CommonConfirmModalLayout";
import {
  SelectTagConfirmModalContent,
  type TagOption,
} from "./content/SelectTagConfirmModalContent";

interface SelectTagConfirmModalProps {
  isOpen: boolean;
  tags: TagOption[];
  initialSelectedIds?: string[];
  maxSelection?: number;
  onConfirm: (tags: TagOption[]) => void;
  onCancel: () => void;
}

export const SelectTagConfirmModal = ({
  isOpen,
  tags,
  initialSelectedIds = [],
  maxSelection,
  onConfirm,
  onCancel,
}: SelectTagConfirmModalProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const initial = tags.filter((t) => initialSelectedIds.includes(t.id));
      setSelectedTags(initial);
      requestAnimationFrame(() => setShowAnimation(true));
    } else {
      setShowAnimation(false);
    }
  }, [isOpen, tags, initialSelectedIds]);

  const handleConfirm = () => {
    onConfirm(selectedTags);
  };

  if (!shouldRender) return null;

  return (
    <CommonConfirmModalLayout
      isVisible={showAnimation}
      confirmButtonInfo={{ label: "확인", onClick: handleConfirm }}
      cancelButtonInfo={{ label: "취소", onClick: onCancel }}
      onCloseComplete={() => setShouldRender(false)}
    >
      <SelectTagConfirmModalContent
        tags={tags}
        initialSelectedIds={initialSelectedIds}
        maxSelection={maxSelection}
        onChangeTags={setSelectedTags}
      />
    </CommonConfirmModalLayout>
  );
};

export default SelectTagConfirmModal;
