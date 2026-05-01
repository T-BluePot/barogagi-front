import type { SignupErrorCode, RequiredFieldKey } from "@/types/signupTypes";

export class SignupFlowError extends Error {
  public readonly code: SignupErrorCode;
  public readonly missingFields?: RequiredFieldKey[];

  constructor(
    code: SignupErrorCode,
    message: string,
    missingFields?: RequiredFieldKey[]
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
