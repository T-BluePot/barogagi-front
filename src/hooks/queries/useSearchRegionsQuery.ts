import { useQuery } from "@tanstack/react-query";

// === api ===
import { commonKeys } from "@/api/keyFactories";
import { searchRegions } from "@/api/queries";

// === type ===
import type { BaseResponse } from "@/api/types";
import type { RegionSearchItemType } from "@/types/api/scheduleTypes";

export const useSearchRegionsQuery = (query: string) => {
  const trimmed = query.trim();

  return useQuery<BaseResponse<RegionSearchItemType[]>>({
    queryKey: commonKeys.regions.search(trimmed),
    queryFn: () => searchRegions(trimmed),
    enabled: trimmed.length > 0, // query(공백 제거 후)가 비어 있으면 호출 X
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: (prev) => prev,
  });
};
