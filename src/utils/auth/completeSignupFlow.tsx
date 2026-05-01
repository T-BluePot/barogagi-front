import type { SignupPayloadType } from "@/types/signupTypes";
import { ROUTES } from "@/constants/routes";

type CompleteSignupFlowDeps = {
  signup: (payload: SignupPayloadType) => Promise<unknown>;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  openErrorModal: (params: {
    message: string;
    redirectTo?: string;
    replace?: boolean;
  }) => void;
};

export const completeSignupFlow = async (
  payload: SignupPayloadType,
  deps: CompleteSignupFlowDeps
) => {
  const { signup, navigate, openErrorModal } = deps;

  // 안전장치: termsDTO 누락이면 약관 화면으로 돌려보냄
  // (원래는 store/buildPayload 단계에서 걸러져야 함)
  if (!payload.termsDTO || payload.termsDTO.termsAgreeList.length === 0) {
    openErrorModal({
      message: "약관 동의 정보가 없습니다. 약관 동의 화면으로 이동합니다.",
      redirectTo: ROUTES.AUTH.SIGNUP.TERMS,
      replace: true,
    });
    return;
  }

  // 회원가입(termsDTO 포함)
  await signup(payload);

  // 성공 처리
  navigate(ROUTES.AUTH.SIGNUP.COMPLETE, { replace: true });
};
