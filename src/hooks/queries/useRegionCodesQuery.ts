import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

// === api ===
import { homeKeys } from "@/api/keyFactories";
import { getRegionCodes } from "@/api/queries";
import {
  REGION_CODE_GC_TIME,
  REGION_CODE_STALE_TIME,
} from "@/constants/queryTimes";
import { groupRegionCodes } from "@/utils/api/homeMapper";

// === type ===
import type { BaseResponse, RegionCodeDTO } from "@/api/types";

/**
 * 공공기관 지역코드 조회 훅 (선호 지역 선택용)
 *
 * 시/도별로 묶어서 반환한다 — 소비처가 매번 그룹핑하지 않게 하기 위함이다.
 * 응답이 `data: null` 로 올 수 있어(`popular` 의 `M201` 선례) 배열로 정규화한다.
 *
 * @param enabled 모달이 열릴 때만 조회한다. 선호 지역은 선택 항목이라
 *                열어보지도 않는 사용자에게 프로필 화면 진입만으로 요청을 보낼 이유가 없다.
 */
export const useRegionCodesQuery = (enabled = true) => {
  const query = useQuery<BaseResponse<RegionCodeDTO[] | null>>({
    queryKey: homeKeys.regionCodes(),
    queryFn: getRegionCodes,
    staleTime: REGION_CODE_STALE_TIME,
    gcTime: REGION_CODE_GC_TIME,
    enabled,
  });

  const codes = useMemo(
    () => (Array.isArray(query.data?.data) ? query.data.data : []),
    [query.data?.data]
  );

  // 252건 순회라 렌더마다 다시 돌 이유가 없다
  const areas = useMemo(() => groupRegionCodes(codes), [codes]);

  return {
    areas,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
