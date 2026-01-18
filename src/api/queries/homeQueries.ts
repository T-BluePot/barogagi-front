/**
 * 메인 홈(Home) 관련 API 요청 함수
 */
import { http } from "../http";
import { ENDPOINTS } from "../endpoints";
import type { BaseResponse } from "../types";

/** 인기 태그 조회 */
export const getPopularTags = async () => {
  const response = await http.get<BaseResponse<unknown>>(
    ENDPOINTS.HOME.POPULAR_TAGS
  );
  return response.data;
};

/** 인기 지역 조회 */
export const getPopularRegions = async () => {
  const response = await http.get<BaseResponse<unknown>>(
    ENDPOINTS.HOME.POPULAR_REGIONS
  );
  return response.data;
};

/** 내 일정 정보 (메인화면용) */
export const getMySchedulesSummary = async () => {
  const response = await http.get<BaseResponse<unknown>>(
    ENDPOINTS.HOME.MY_SCHEDULES
  );
  return response.data;
};
