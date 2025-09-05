import { SelectTag } from "@/components/common/tags/SelectTag";
import type { Region } from "@/types/main/plan/region";

interface RegionTagContainerProps {
  regions: Region[];
  selectedRegionNums: number[]; // 선택된 지역 넘버
  handleRemoveRegion: (regionNum: number) => void;
}

// 지역 태그 영역
export const RegionTagContainer = ({
  regions,
  selectedRegionNums,
  handleRemoveRegion,
}: RegionTagContainerProps) => {
  // 사용자가 선택한 지역 태그
  const selectedRegions = regions.filter((region) => {
    return selectedRegionNums.includes(region.REGION_NUM);
  });
  return (
    <div className="flex gap-2 flex-wrap">
      {selectedRegions.map((region) => {
        /* 
        태그 라벨 결정 규칙
          - 태그 이름은 REGION_LEVEL_4가 있으면 그것을 사용, 
            없으면 REGION_LEVEL_3 사용
        **/
        const label =
          region.REGION_LEVEL_4 ||
          region.REGION_LEVEL_3 ||
          region.REGION_LEVEL_2;

        return (
          <SelectTag
            key={region.REGION_NUM}
            label={label}
            onClick={() => handleRemoveRegion(region.REGION_NUM)}
          />
        );
      })}
    </div>
  );
};
