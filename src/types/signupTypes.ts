import type { GenderType } from "@/constants/userInfo";
import type { TermsDTOType } from "@/api/types";

/** 서버 전송 용 회원가입 정보 저장 타입  */
export type SignupPayloadType = {
  userId: string;
  password: string;
  tel: string;
  nickName: string;
  email?: string;
  birth?: string;
  gender?: GenderType;
  /**
   * 선호 지역 — 시/도 코드 (예: "11")
   * `JoinRequestDTO` 기준 optional. 값 출처는 `GET /home/regions/code`.
   */
  areaCd?: string;
  /**
   * 선호 지역 — 시·군·구 코드 (예: "11110")
   *
   * ⚠️ `areaCd` 와 **반드시 쌍으로** 보낸다. 서버가 한쪽만 오면 200 을 주면서
   *    조용히 버린다(실측). 선호 지역을 아예 안 넣는 경우에만 둘 다 생략한다.
   */
  sigunguCd?: string;
  termsDTO: TermsDTOType;
};

/** 필수 필드 타입 */
export type RequiredFields = Pick<
  SignupPayloadType,
  "userId" | "password" | "tel" | "nickName" | "termsDTO"
>;

export type RequiredFieldKey = keyof RequiredFields;

/** 선택 필드 타입 */
export type OptionalFields = Pick<
  SignupPayloadType,
  "email" | "birth" | "gender" | "areaCd" | "sigunguCd"
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
export type NicknameCheckStatus = "idle" | "valid" | "duplicate" | "error";

/** 회원 가입 에러 상태 */
export type SignupErrorState = {
  isOpen: boolean;
  message: string;
  redirectTo?: string;
  replace?: boolean;
};
