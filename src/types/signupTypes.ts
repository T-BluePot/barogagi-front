/** 서버 전송 용 회원가입 정보 저장 타입  */
export type SignupPayloadType = {
  userId: string; // required
  password: string; // required
  tel: string; // required
  nickName: string; // required
  email?: string; // optional
  birth?: string; // optional
  gender?: string; // optional
};

/** 필수 필드 타입 */
export type RequiredFields = Pick<
  SignupPayloadType,
  "userId" | "password" | "tel" | "nickName"
>;

export type RequiredFieldKey = keyof RequiredFields;

/** 선택 필드 타입 */
export type OptionalFields = Pick<
  SignupPayloadType,
  "email" | "birth" | "gender"
>;

export type OptionalFieldKey = keyof OptionalFields;

// 회원 가입 정보 관련 에러 타입
export type SignupErrorCode =
  | "MISSING_REQUIRED_FIELDS" // 필수 필드가 존재 x
  | "INVALID_REQUIRED_FIELDS"; // 필수 필드 값 오류

/** 인증번호 확인 - 입력값 (UI → Query) */
export interface VerifyCodeType {
  tel: string;
  authCode: string;
}

/** 닉네임 중복확인 상태 */
export type NicknameCheckStatus = "idle" | "valid" | "duplicate";
