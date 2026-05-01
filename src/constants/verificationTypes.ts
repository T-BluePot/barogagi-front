/** 서버 전달용 인증 요청 타입 값 정의 */
export const VERIFICATION_REQUEST_TYPE = {
  JOIN_MEMBERSHIP: "JOIN-MEMBERSHIP",
  FIND_ID: "FIND-ID",
  RESET_PASSWORD: "RESET-PASSWORD",
} as const;

/** VERIFICATION_REQUEST_TYPE 값 유니온 타입 */
export type VerificationType =
  (typeof VERIFICATION_REQUEST_TYPE)[keyof typeof VERIFICATION_REQUEST_TYPE];

export const API_CODE = {
  TEL_AVAILABLE: "T200", // 중복 없음
  TEL_DUPLICATED: "S400", // 중복 있음
  INVALID_ACCESS: "A100",
  NEED_INPUT: "C101",
  SERVER_ERROR: "COMMON-500",
} as const;
