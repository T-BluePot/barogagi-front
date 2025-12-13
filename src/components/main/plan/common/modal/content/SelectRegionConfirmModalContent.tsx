import { useState } from "react";

export interface RegionOption {
  id: string;
  label: string;
}

interface SelectRegionConfirmModalContentProps {
  regions: RegionOption[];
  initialSelectedId?: string;
  onChangeRegion?: (region: RegionOption | null) => void;
}

export const SelectRegionConfirmModalContent = ({
  regions,
  initialSelectedId,
  onChangeRegion,
}: SelectRegionConfirmModalContentProps) => {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialSelectedId
  );

  const handleSelect = (region: RegionOption) => {
    const newSelectedId = selectedId === region.id ? undefined : region.id;
    setSelectedId(newSelectedId);
    onChangeRegion?.(newSelectedId ? region : null);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* 타이틀 */}
      <h2 className="typo-subtitle text-gray-black">지역 선택하기</h2>

      {/* 지역 태그 목록 */}
      <div className="flex flex-wrap gap-2 justify-center px-2">
        {regions.map((region) => {
          const isSelected = selectedId === region.id;
          return (
            <button
              key={region.id}
              type="button"
              onClick={() => handleSelect(region)}
              className={`px-4 py-2 rounded-full typo-body transition-colors ${
                isSelected
                  ? "bg-main text-gray-black"
                  : "bg-gray-10 text-gray-60"
              }`}
            >
              {region.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectRegionConfirmModalContent;
