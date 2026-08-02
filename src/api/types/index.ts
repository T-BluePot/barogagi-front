/**
 * API 공통 타입 및 모든 타입 통합 export
 */

/** 공통 API 응답 타입 */
export interface BaseResponse<T = unknown> {
  code: string;
  message: string;
  data: T;
}

/**
 * 서버 에러 응답 봉투.
 * - 컨트롤러 도달   : `{ code, message, data }`
 * - 전역 에러 핸들러 : `{ resultCode, message }`  ← data 필드 없음
 *
 * 두 형태가 HTTP status 와 무관하게 섞여 오므로 두 키를 모두 optional 로 둔다.
 * 코드를 읽을 때는 `readApiErrorCode`(`@/utils/api/classifyApiError`)를 쓴다.
 */
export interface ApiErrorEnvelope {
  code?: string;
  resultCode?: string;
  message?: string;
  data?: null;
}

// Auth 관련 타입 re-export
export * from "./authTypes";

// Plan 관련 타입 re-export
export * from "./planTypes";

// Home 관련 타입 re-export
export * from "./homeTypes";

// Push 관련 타입 re-export
export * from "./pushTypes";

// Settings 관련 타입 re-export
export * from "./settingsTypes";
