import { useMemo } from "react";

import type { Region } from "@/types/main/plan/region";

import { normalizeKo } from "@/utils/ko";
import { filterRegionsKorean } from "@/utils/regionFilter";
import { useDebouncedKeyword } from "@/utils/useDebouncedKeyword";

import { SearchInput } from "@/components/common/inputs/SearchInput";
import type { SearchInputProps } from "@/components/common/inputs/SearchInput";
import EmptyStateSection from "../common/EmptyStateSection";

interface RegionSearchContainerProps {
  searchInput: SearchInputProps; // 검색어 상태 관리 props
  regions: Region[]; // 전체 지역 데이터
  handleSelectRegion: (regionNum: number) => void; // 지역 선택 시 호출되는 핸들러
}

const RegionSearchContainer = ({
  searchInput,
  regions,
  handleSelectRegion,
}: RegionSearchContainerProps) => {
  // 입력 키워드 정규화 적용
  const keyword = normalizeKo(searchInput.value);
  const hasInput = useDebouncedKeyword({ value: keyword });

  // 필터링(항상 Region[])
  const filtered = useMemo<Region[]>(() => {
    return hasInput ? filterRegionsKorean(regions, keyword) : [];
  }, [regions, hasInput, keyword]);

  return (
    <div className="flex flex-1 h-full flex-col w-full gap-4">
      {/* 헤더는 고정 높이(내용만큼) */}
      <div className="flex-none">
        <SearchInput {...searchInput} />
      </div>

      {/* 검색 결과 컨테이너: 남은 공간 차지 + 내부 스크롤 */}
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
        {/* pb-28: 하단 fixed CTA 높이만큼 여유를 줘서 가려지지 않게 함 */}
        {hasInput && (
          <ul className="flex flex-col">
            {filtered.length > 0 ? (
              filtered.map((region) => (
                <li
                  key={region.REGION_NUM}
                  className="flex w-full items-baseline border-b border-gray-10 py-4 hover:bg-gray-10 transition"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectRegion(region.REGION_NUM)}
                    className="flex w-full typo-caption text-left"
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
              <li>
                <EmptyStateSection />
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RegionSearchContainer;
