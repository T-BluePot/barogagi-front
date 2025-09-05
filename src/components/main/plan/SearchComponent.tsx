import type { Region } from "@/types/main/plan/region";

import { SearchInput } from "@/components/common/inputs/SearchInput";
import type { SearchInputProps } from "@/components/common/inputs/SearchInput";
import AddCurrentLocationButton from "@/pages/main/plan/AddCurrentLocationButton";

interface SearchComponentProps extends SearchInputProps {
  regions: Region[];
  handleSelectRegion: (regionNum: number) => void;
  handleAddCurrentLocation: () => void;
}

export const SearchComponent = ({
  regions,
  handleSelectRegion,
  handleAddCurrentLocation,
  ...searchInputProps
}: SearchComponentProps) => {
  // 키워드를 포함한 지역만 필터링
  const filtered = regions.filter((region) => {
    const fullName = [
      region.REGION_LEVEL_1,
      region.REGION_LEVEL_2,
      region.REGION_LEVEL_3,
      region.REGION_LEVEL_4,
    ]
      .filter(Boolean) // 빈 문자열 제거
      .join(" "); // 공백으로 연결

    console.log(fullName.includes(searchInputProps.value));

    return fullName.includes(searchInputProps.value);
  });

  return (
    <div className="flex flex-col w-full gap-4">
      <SearchInput {...searchInputProps} />

      <AddCurrentLocationButton
        handleAddCurrentLocation={handleAddCurrentLocation}
      />

      {/* 검색 결과 */}
      {searchInputProps.value && (
        <ul className="flex flex-col items-baseline">
          {filtered.length > 0 ? (
            filtered.map((region) => (
              <li
                key={region.REGION_NUM}
                className="flex w-full items-baseline border-b border-gray-10 py-4 hover:bg-gray-10 transition"
              >
                <button
                  type="button"
                  onClick={() => handleSelectRegion(region.REGION_NUM)}
                  className="flex w-full typo-caption"
                >
                  {[
                    region.REGION_LEVEL_1,
                    region.REGION_LEVEL_2,
                    region.REGION_LEVEL_3,
                    region.REGION_LEVEL_4,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </button>
              </li>
            ))
          ) : (
            <li className="w-full typo-caption py-4 text-gray-60 text-center">
              검색 결과가 없습니다.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
