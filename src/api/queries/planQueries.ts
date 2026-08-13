/**
 * 일정(Schedule) 관련 API 요청 함수
 */

import { apiKeyHttp } from "../client";
import { ENDPOINTS } from "../endpoints";
import { getEnvironment } from "../environment";
import { normalizePlanForUpdate } from "@/utils/api/planMapper";
import type {
  BaseResponse,
  ScheduleRegistReqDTO,
  ScheduleRegistResDTO,
  ScheduleDetailResDTO,
  ScheduleListResDTO,
} from "../types";

/** 내 일정 목록 조회 */
export const getScheduleList = async () => {
  const response = await apiKeyHttp.get<BaseResponse<ScheduleListResDTO>>(
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
  // 사용자가 만든 계획은 isUserAdded:"Y"로 정규화해 서버 아이템 조회 실패(S302) 방지
  const payload: ScheduleRegistResDTO = {
    ...data,
    planRegistResDTOList: data.planRegistResDTOList.map(normalizePlanForUpdate),
  };
  const response = await apiKeyHttp.put<BaseResponse<unknown>>(
    ENDPOINTS.SCHEDULE.UPDATE,
    payload
  );
  return response.data;
};

/**
 * 일정 공유 링크 생성 (성공 code "S200")
 *
 * - 로그인 토큰 필요. API-KEY만으로는 401 (실측 확인)
 * - environment 가 서버가 발급할 링크의 도메인을 결정한다 (TEST → test.fitpl.xyz)
 * - 같은 일정을 여러 번 공유하면 **동일 토큰**을 재사용하고 만료일만 갱신된다(백엔드 반영).
 *
 * 응답 data 는 이제 사용자용 페이지 주소다: "https://{도메인}/share/{token}".
 * 로컬 개발에서는 오리진만 localhost 로 바꿔 열도록 toSharePageUrl() 을 거친다.
 */
export const postScheduleShare = async (scheduleNum: number) => {
  const response = await apiKeyHttp.post<BaseResponse<string>>(
    ENDPOINTS.SCHEDULE.SHARE(scheduleNum),
    null,
    {
      params: { environment: getEnvironment() },
    }
  );
  return response.data;
};

/**
 * 공유된 일정 조회 (성공 code "S202")
 *
 * - 비로그인 조회 가능 — API-KEY만 있으면 된다 (실측 확인)
 * - 응답 data 는 기존 일정 상세와 **동일한 구조**라 ScheduleDetailResDTO 를 그대로 재사용한다.
 *   (실측 대조: scheduleNum/scheduleNm/startDate/endDate/radius/planDetailVOList 일치.
 *    응답에 planSource 가 하나 더 있으나 null 이고 기존 타입은 이를 모델링하지 않는다)
 *
 * ⚠️ 만료/없는 링크는 code "SS400" 으로 오며, 백엔드가 실제 HTTP status(404 등)로 내려주도록
 *    바뀌어 axios 가 throw 한다. 만료 판별은 useSharedScheduleQuery 에서 status·code 모두 고려한다.
 */
export const getSharedSchedule = async (shareToken: string) => {
  const response = await apiKeyHttp.get<BaseResponse<ScheduleDetailResDTO>>(
    ENDPOINTS.SCHEDULE.SHARED(shareToken)
  );
  return response.data;
};

/** 일정 삭제 */
export const deleteSchedule = async (scheduleNum: number) => {
  const response = await apiKeyHttp.delete<BaseResponse<unknown>>(
    ENDPOINTS.SCHEDULE.DELETE,
    {
      params: { scheduleNum },
    }
  );
  return response.data;
};
