/**
 * 메인 홈(Home) 관련 API 요청 함수
 */
import { http, apiKeyHttp } from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  BaseResponse,
  HomeScheduleResponseDTO,
  HotPlaceDTO,
  PopularTagResponseDTO,
  PopularRegionResponseDTO,
  RegionCodeDTO,
} from "../types";

/** 인기 태그 조회 */
export const getPopularTags = async () => {
  const response = await apiKeyHttp.get<PopularTagResponseDTO>(
    ENDPOINTS.HOME.POPULAR_TAGS
  );
  return response.data;
};

/** 인기 지역 조회 */
export const getPopularRegions = async () => {
  const response = await apiKeyHttp.get<PopularRegionResponseDTO>(
    ENDPOINTS.HOME.POPULAR_REGIONS
  );
  return response.data;
};

/**
 * 오늘의 핫플레이스 조회 (한국관광공사 데이터 기반)
 *
 * ⚠️ 반드시 `apiKeyHttp` 를 쓴다 — `http` 로는 API-KEY 가 빠져 실패한다.
 *
 * 현재는 `params` 를 보내지 않아 서버 기본값(서울 종로구)이 온다.
 * 지역 필터로 확장할 때는 `areaCd`/`sigunguCd` 를 **반드시 쌍으로** 넘긴다
 * (단독 전송은 조용히 무시되고, 접두 불일치는 HTTP 404 + `P400` 이다).
 */
export const getHotPlaces = async () => {
  const response = await apiKeyHttp.get<BaseResponse<HotPlaceDTO[] | null>>(
    ENDPOINTS.HOME.HOT_PLACE
  );
  return response.data;
};

/**
 * 공공기관 지역코드 목록 조회 (시/도 · 시군구 전체 252건)
 *
 * ⚠️ `type` 은 필수이고 **`HOT-PLACE` 만 동작한다** — 다른 값은 전부 `C400` 이다(실측).
 *    스웨거에 허용값이 적혀 있지 않으니 이 상수를 임의로 바꾸지 말 것.
 *
 * ⚠️ 반드시 `apiKeyHttp` 를 쓴다 — `http` 로는 API-KEY 가 빠져 실패한다.
 *
 * 회원가입·프로필의 선호 지역 선택과 핫플레이스 지역 필터가 같은 목록을 쓴다.
 */
export const getRegionCodes = async () => {
  const response = await apiKeyHttp.get<BaseResponse<RegionCodeDTO[] | null>>(
    ENDPOINTS.HOME.REGION_CODES,
    { params: { type: "HOT-PLACE" } }
  );
  return response.data;
};

/** 내 일정 정보 (메인화면용) */
export const getMySchedulesSummary = async () => {
  const response = await http.get<HomeScheduleResponseDTO>(
    ENDPOINTS.HOME.MY_SCHEDULES
  );
  return response.data;
};
