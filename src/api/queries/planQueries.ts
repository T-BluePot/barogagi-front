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
 * - 호출할 때마다 **새 토큰**이 발급된다 (같은 일정 2회 호출 시 서로 다른 토큰 — 실측 확인)
 *   → 버튼을 누를 때마다 호출하면 토큰이 계속 쌓이므로 호출 시점에 주의할 것.
 *
 * ⚠️ 응답 data 는 **API 엔드포인트 주소**다:
 *      "https://test.fitpl.xyz/api/v1/schedule/share/8OD5dVzR8c1H"
 *    이 주소는 API-KEY 헤더를 요구하므로 브라우저로 열면 500 이 난다(실측).
 *    사용자에게 보낼 링크는 반드시 toSharePageUrl() 로 변환해서 쓸 것.
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
 * ⚠️ 실패해도 HTTP 200 으로 내려온다. (만료/없는 링크 → code "SS400", data null)
 *    반드시 res.code 로 성공/실패를 분기할 것. res.status 로 판단하면 만료 링크가 성공 처리된다.
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
