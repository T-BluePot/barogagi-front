/**
 * API 공통 타입 및 모든 타입 통합 export
 */

/** 공통 API 응답 타입 */
export interface BaseResponse<T = unknown> {
  code: string;
  message: string;
  data: T;
}

/** 에러 응답 타입 */
export interface ErrorResponse {
  code: string;
  message: string;
}

// Auth 관련 타입 re-export
export * from "./authTypes";

// Plan 관련 타입 re-export
export * from "./planTypes";
