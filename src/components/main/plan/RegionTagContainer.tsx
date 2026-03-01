import { SelectTag } from "@/components/common/tags/SelectTag";
import type { RegionSearchItemType } from "@/types/api/scheduleTypes";

interface RegionTagContainerProps {
  selectedRegions: RegionSearchItemType[];
  onRemove: (region: RegionSearchItemType) => void;
}

// 지역 태그 영역
export const RegionTagContainer = ({
  selectedRegions,
  onRemove,
}: RegionTagContainerProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {selectedRegions.map((region) => (
        <SelectTag
          key={`${region.regionNum}-${region.regionNm}`}
          label={region.regionNm}
          onClick={() => onRemove(region)}
        />
      ))}
    </div>
  );
};
