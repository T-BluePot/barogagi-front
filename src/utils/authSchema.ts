import * as Yup from "yup";

import {
  ID_MESSAGES,
  PASSWORD_MESSAGES,
  PW_CONFIRM_MESSAGES,
} from "@/constants/texts/auth/signup/credentials";

/**
 * 아이디 유효성 검사 스키마
 * 조건:
 * - 영문 소문자로 시작
 * - 영문 소문자 + 숫자만 허용
 * - 길이는 4~16자
 * - 특수문자, 공백 불허
 */

export const idSchema = Yup.string()
  // 1. 영문 소문자로 시작
  .test(
    "must-start-with-letter",
    ID_MESSAGES.MUST_START_WITH_LETTER,
    (v = "") => /^[a-z]/.test(v)
  )
  // 2. 공백 포함 불가
  .test("no-whitespace", ID_MESSAGES.NO_WHITESPACE, (value = "") =>
    value === "" ? true : !/\s/.test(value)
  )
  // 3. 특수문자 포함 불가
  .test("no-special-char", ID_MESSAGES.NO_SPECIAL_CHAR, (value = "") =>
    value === "" ? true : /^[a-z0-9]*$/.test(value)
  )
  // 4. 숫자 반드시 포함
  .test("must-include-number", ID_MESSAGES.INVALID_FORMAT, (v = "") =>
    v === "" ? true : /[0-9]/.test(v)
  )
  // 5. 전체 형식 검사: 영문 소문자 시작 + 영문/숫자 조합 + 길이 4~16자
  .test("valid-format", ID_MESSAGES.INVALID_FORMAT, (v = "") =>
    v === "" ? true : /^[a-z0-9]{4,16}$/.test(v)
  );

/**
 * 비밀번호 유효성 검사 스키마
 * 조건:
 * - 영문 + 숫자 포함 필수
 * - 길이는 8~20자
 * - 특수문자는 !@#$%^&*() 만 허용
 * - 공백 불허
 */
export const passwordSchema = Yup.string()
  // 공백이 포함되어 있으면 에러
  .test(
    "no-whitespace",
    PASSWORD_MESSAGES.NO_WHITESPACE,
    (v = "") => !/\s/.test(v)
  )

  // 허용되지 않은 특수문자가 포함되었으면 에러
  // → !@#$%^&*() 외에는 금지
  .test("allowed-specials", PASSWORD_MESSAGES.ALLOWED_SPECIALS, (v = "") =>
    /^[a-zA-Z0-9!@#$%^&*()]*$/.test(v)
  )

  // 전체 형식 검사:
  // - 영문 + 숫자 포함
  // - 총 8~20자
  // - 허용 문자만 포함되어야 함
  .test("valid-format", PASSWORD_MESSAGES.INVALID_FORMAT, (v = "") =>
    /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()]{8,20}$/.test(v)
  );

/**
 * 비밀번호 확인 유효성 검사 스키마
 */
export const passwordConfirmSchema = (passwordValue: string) =>
  Yup.string().test(
    "match-password",
    PW_CONFIRM_MESSAGES.NO_MATCH,
    (value = "") => {
      if (value === "") return true; // 비어 있으면 검증 통과 (에러 표시 안 함)
      return value === passwordValue;
    }
  );
