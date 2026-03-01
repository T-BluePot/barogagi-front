import { useMemo } from "react";

import { normalizeKo } from "@/utils/ko";
import { useDebouncedKeyword } from "@/utils/useDebouncedKeyword";

import { useSearchRegionsQuery } from "@/hooks/queries/useSearchRegionsQuery";
import type { RegionSearchItemType } from "@/types/api/scheduleTypes";

import { SearchInput } from "@/components/common/inputs/SearchInput";
import type { SearchInputProps } from "@/components/common/inputs/SearchInput";
import EmptyStateSection from "../common/EmptyStateSection";

interface RegionSearchContainerProps {
  searchInput: SearchInputProps;
  handleSelectRegion: (item: RegionSearchItemType) => void;
}

const RegionSearchContainer = ({
  searchInput,
  handleSelectRegion,
}: RegionSearchContainerProps) => {
  const normalized = normalizeKo(searchInput.value);

  const debouncedKeyword = useDebouncedKeyword(normalized, {
    minLength: 2,
    delay: 300,
  });

  const { data, isLoading, isError } = useSearchRegionsQuery(debouncedKeyword);

  const regions = useMemo<RegionSearchItemType[]>(() => {
    return data?.data ?? [];
  }, [data]);

  const enabled = debouncedKeyword !== "";
  const isDebouncing = normalized.trim().length >= 2 && debouncedKeyword === "";

  return (
    <div className="flex flex-1 h-full flex-col w-full gap-4">
      <div className="flex-none">
        <SearchInput {...searchInput} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
        {(isDebouncing || enabled) && (
          <ul className="flex flex-col">
            {isDebouncing || isLoading ? (
              <li className="py-6">
                <p className="typo-caption text-gray-50">검색 중…</p>
              </li>
            ) : isError ? (
              <li className="py-6">
                <p className="typo-caption text-gray-50">
                  지역 검색에 실패했습니다. 잠시 후 다시 시도해 주세요.
                </p>
              </li>
            ) : regions.length > 0 ? (
              regions.map((region) => (
                <li
                  key={`${region.regionNum}-${region.regionNm}`}
                  className="flex w-full items-baseline border-b border-gray-10 py-4 hover:bg-gray-10 transition"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectRegion(region)}
                    className="flex w-full typo-caption text-left"
                  >
                    {region.regionNm}
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
