/** 서버 전달용 인증 요청 타입 값 정의 */
export const VERIFICATION_REQUEST_TYPE = {
  JOIN_MEMBERSHIP: "JOIN-MEMBERSHIP",
  FIND_ID: "FIND-ID",
  RESET_PASSWORD: "RESET-PASSWORD",
} as const;

/** VERIFICATION_REQUEST_TYPE 값 유니온 타입 */
export type VerificationType =
  (typeof VERIFICATION_REQUEST_TYPE)[keyof typeof VERIFICATION_REQUEST_TYPE];
