/**
 * 일정(Schedule) 관련 API 요청 함수
 */

import { apiKeyHttp, http } from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  BaseResponse,
  ScheduleRegistReqDTO,
  ScheduleRegistResDTO,
  ScheduleDetailResDTO,
} from "../types";

/** 내 일정 목록 조회 */
export const getScheduleList = async () => {
  const response = await http.get<BaseResponse<ScheduleRegistResDTO[]>>(
    ENDPOINTS.SCHEDULE.LIST
  );
  return response.data;
};

/** 일정 상세 조회 */
export const getScheduleDetail = async (scheduleNum: number) => {
  const response = await apiKeyHttp.get<BaseResponse<ScheduleDetailResDTO>>(
    ENDPOINTS.SCHEDULE.DETAIL,
    {
      params: { scheduleNum },
    }
  );
  return response.data;
};

/** 일정 생성 (AI 생성 등 초기 생성) */
export const createSchedule = async (data: ScheduleRegistReqDTO) => {
  const response = await apiKeyHttp.post<BaseResponse<ScheduleRegistResDTO>>(
    ENDPOINTS.SCHEDULE.CREATE,
    data,
    { timeout: 60000 }
  );
  return response.data;
};

/** 일정 저장 (최종 저장) */
export const saveSchedule = async (data: ScheduleRegistResDTO) => {
  const response = await apiKeyHttp.post<BaseResponse<unknown>>(
    ENDPOINTS.SCHEDULE.SAVE,
    data
  );
  return response.data;
};

/** 일정 수정 */
export const updateSchedule = async (data: ScheduleRegistResDTO) => {
  const response = await http.put<BaseResponse<unknown>>(
    ENDPOINTS.SCHEDULE.UPDATE,
    data
  );
  return response.data;
};

/** 일정 삭제 */
export const deleteSchedule = async (scheduleNum: number) => {
  const response = await http.delete<BaseResponse<unknown>>(
    ENDPOINTS.SCHEDULE.DELETE,
    {
      params: { scheduleNum },
    }
  );
  return response.data;
};
