import { API_ERROR_CODE } from "./apiErrorCodes";

/** 서버 전달용 인증 요청 타입 값 정의 */
export const VERIFICATION_REQUEST_TYPE = {
  JOIN_MEMBERSHIP: "JOIN-MEMBERSHIP",
  FIND_ID: "FIND-ID",
  RESET_PASSWORD: "RESET-PASSWORD",
} as const;

/** VERIFICATION_REQUEST_TYPE 값 유니온 타입 */
export type VerificationType =
  (typeof VERIFICATION_REQUEST_TYPE)[keyof typeof VERIFICATION_REQUEST_TYPE];

/**
 * 전화번호 인증 화면에서 쓰는 응답 코드.
 * 서버 공통 오류 코드는 중복 정의하지 않고 `apiErrorCodes.ts`(단일 출처)에서 가져온다.
 */
export const API_CODE = {
  TEL_AVAILABLE: "T200", // 중복 없음
  TEL_DUPLICATED: "S400", // 중복 있음
  INVALID_ACCESS: API_ERROR_CODE.INVALID_ACCESS,
  NEED_INPUT: "C101",
  SERVER_ERROR: API_ERROR_CODE.SERVER_ERROR,
} as const;
