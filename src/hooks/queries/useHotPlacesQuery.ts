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

interface UseHotPlacesQueryOptions {
  /** 선호 지역 시/도 코드. `sigunguCd` 와 **쌍일 때만** 서버가 반영한다 */
  areaCd?: string;
  /** 선호 지역 시·군·구 코드 */
  sigunguCd?: string;
  /**
   * 조회 여부. 선호 지역을 담은 회원 정보가 아직 안 왔으면 `false` 로 막는다.
   * 안 막으면 기본값(종로)으로 한 번 받고 지역값으로 또 받아서, 요청이 두 번 나가고
   * 화면에 종로 목록이 잠깐 스쳤다 바뀐다.
   */
  enabled?: boolean;
}

/**
 * 오늘의 핫플레이스 조회 훅
 *
 * 선호 지역이 있으면 그 지역 기준으로, 없으면 서버 기본값(서울 종로구)으로 조회한다.
 * 응답이 `data: null` 로 올 수 있어(`popular` 의 `M201` 선례) 배열로 정규화해서 반환한다.
 * 소비처가 `Array.isArray()` 가드를 중복하지 않게 하기 위함이다.
 */
export const useHotPlacesQuery = ({
  areaCd,
  sigunguCd,
  enabled = true,
}: UseHotPlacesQueryOptions = {}) => {
  const query = useQuery<BaseResponse<HotPlaceDTO[] | null>>({
    queryKey: homeKeys.hotPlaces(areaCd, sigunguCd),
    queryFn: () => getHotPlaces(areaCd, sigunguCd),
    staleTime: HOT_PLACE_STALE_TIME,
    gcTime: HOT_PLACE_GC_TIME,
    enabled,
  });

  return {
    hotPlaces: Array.isArray(query.data?.data) ? query.data.data : [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
