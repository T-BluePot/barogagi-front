import { useState, useEffect } from "react";
import type { TagRegistResDTO } from "@/api/types";

interface SelectTagConfirmModalContentProps {
  tags: TagRegistResDTO[];
  initialSelectedIds?: number[];
  maxSelection?: number;
  onChangeTags?: (tags: TagRegistResDTO[]) => void;
}

export const SelectTagConfirmModalContent = ({
  tags,
  initialSelectedIds = [],
  maxSelection,
  onChangeTags,
}: SelectTagConfirmModalContentProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(initialSelectedIds)
  );

  const handleToggle = (tag: TagRegistResDTO) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(tag.tagNum)) {
        next.delete(tag.tagNum);
      } else {
        if (maxSelection && next.size >= maxSelection) return prev;
        next.add(tag.tagNum);
      }

      return next; // onChangeTags 제거
    });
  };

  // selectedIds 바뀔 때마다 onChangeTags 호출
  useEffect(() => {
    const selectedTags = tags.filter((t) => selectedIds.has(t.tagNum));
    onChangeTags?.(selectedTags);
  }, [selectedIds, tags, onChangeTags]);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* 타이틀 */}
      <h2 className="typo-subtitle text-gray-black">태그 선택하기</h2>

      {/* 태그 목록 */}
      <div className="flex flex-wrap gap-2 justify-center px-2">
        {tags.map((tag) => {
          const isSelected = selectedIds.has(tag.tagNum);
          return (
            <button
              key={tag.tagNum}
              type="button"
              onClick={() => handleToggle(tag)}
              className={`px-4 py-2 rounded-full typo-body transition-colors ${
                isSelected
                  ? "bg-main text-gray-black"
                  : "bg-gray-10 text-gray-60"
              }`}
            >
              {tag.tagNm ?? ""}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectTagConfirmModalContent;
