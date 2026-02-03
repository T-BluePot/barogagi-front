import type { SignupErrorCode } from "@/types/signInTypes";

export class SignupFlowError extends Error {
  public readonly code: SignupErrorCode;
  public readonly missingFields?: Array<
    "userId" | "password" | "tel" | "nickName"
  >;

  constructor(
    code: SignupErrorCode,
    message: string,
    missingFields?: Array<"userId" | "password" | "tel" | "nickName">
  ) {
    super(message);
    this.name = "SignupFlowError";
    this.code = code;
    this.missingFields = missingFields;
  }
}

export const isSignupFlowError = (e: unknown): e is SignupFlowError => {
  return e instanceof SignupFlowError;
};
