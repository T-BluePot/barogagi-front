/**
 * 일정(Plan) 관련 API 타입 정의
 */

/** 일정 */
export interface Plan {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

/** 일정 목록 조회 파라미터 */
export interface PlanListParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

/** 일정 생성 요청 */
export interface CreatePlanRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

/** 일정 수정 요청 */
export interface UpdatePlanRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}
