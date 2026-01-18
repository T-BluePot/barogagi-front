/**
 * 일정(Plan) 관련 API 요청 함수
 * http.ts의 axios 인스턴스와 endpoints.ts의 URL 상수를 사용합니다.
 */

import { http } from "../http";
import { ENDPOINTS } from "../endpoints";
import type {
  BaseResponse,
  Plan,
  PlanListParams,
  CreatePlanRequest,
  UpdatePlanRequest,
} from "../types";

/** 일정 목록 조회 */
export const getPlans = async (params?: PlanListParams): Promise<Plan[]> => {
  const response = await http.get<BaseResponse<Plan[]>>(ENDPOINTS.PLAN.LIST, {
    params,
  });
  return response.data.result;
};

/** 일정 상세 조회 */
export const getPlanDetail = async (id: number | string): Promise<Plan> => {
  const response = await http.get<BaseResponse<Plan>>(
    ENDPOINTS.PLAN.DETAIL(id)
  );
  return response.data.result;
};

/** 일정 생성 */
export const createPlan = async (data: CreatePlanRequest): Promise<Plan> => {
  const response = await http.post<BaseResponse<Plan>>(
    ENDPOINTS.PLAN.CREATE,
    data
  );
  return response.data.result;
};

/** 일정 수정 */
export const updatePlan = async (
  id: number | string,
  data: UpdatePlanRequest
): Promise<Plan> => {
  const response = await http.put<BaseResponse<Plan>>(
    ENDPOINTS.PLAN.UPDATE(id),
    data
  );
  return response.data.result;
};

/** 일정 삭제 */
export const deletePlan = async (id: number | string): Promise<void> => {
  await http.delete(ENDPOINTS.PLAN.DELETE(id));
};
