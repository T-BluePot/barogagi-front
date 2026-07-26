import { useQuery } from "@tanstack/react-query";

// === api ===
import { homeKeys } from "@/api/keyFactories";
import { getHotPlaces } from "@/api/queries";
import {
  HOT_PLACE_GC_TIME,
  HOT_PLACE_STALE_TIME,
} from "@/constants/queryTimes";

// === type ===
import type { BaseResponse, HotPlaceDTO } from "@/api/types";

/**
 * 오늘의 핫플레이스 조회 훅
 *
 * 응답이 `data: null` 로 올 수 있어(`popular` 의 `M201` 선례) 배열로 정규화해서 반환한다.
 * 소비처가 `Array.isArray()` 가드를 중복하지 않게 하기 위함이다.
 */
export const useHotPlacesQuery = () => {
  const query = useQuery<BaseResponse<HotPlaceDTO[] | null>>({
    queryKey: homeKeys.hotPlaces(),
    queryFn: getHotPlaces,
    staleTime: HOT_PLACE_STALE_TIME,
    gcTime: HOT_PLACE_GC_TIME,
  });

  return {
    hotPlaces: Array.isArray(query.data?.data) ? query.data.data : [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
