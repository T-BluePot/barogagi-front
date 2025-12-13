import { useState } from "react";

export interface TagOption {
  id: string;
  label: string;
}

interface SelectTagConfirmModalContentProps {
  tags: TagOption[];
  initialSelectedIds?: string[];
  maxSelection?: number;
  onChangeTags?: (tags: TagOption[]) => void;
}

export const SelectTagConfirmModalContent = ({
  tags,
  initialSelectedIds = [],
  maxSelection,
  onChangeTags,
}: SelectTagConfirmModalContentProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialSelectedIds)
  );

  const handleToggle = (tag: TagOption) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(tag.id)) {
        next.delete(tag.id);
      } else {
        if (maxSelection && next.size >= maxSelection) {
          return prev; // 최대 선택 수 초과 시 무시
        }
        next.add(tag.id);
      }

      const selectedTags = tags.filter((t) => next.has(t.id));
      onChangeTags?.(selectedTags);
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* 타이틀 */}
      <h2 className="typo-subtitle text-gray-black">태그 선택하기</h2>

      {/* 태그 목록 */}
      <div className="flex flex-wrap gap-2 justify-center px-2">
        {tags.map((tag) => {
          const isSelected = selectedIds.has(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleToggle(tag)}
              className={`px-4 py-2 rounded-full typo-body transition-colors ${
                isSelected
                  ? "bg-main text-gray-black"
                  : "bg-gray-10 text-gray-60"
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectTagConfirmModalContent;
