import type { SignupPayloadType } from "@/types/signupTypes";
import type { TermsProcessRequestType } from "@/api/types";
import { ROUTES } from "@/constants/routes";
import {
  loadTermsAgreeList,
  clearTermsAgreeList,
} from "@/utils/sessionStorage/termsAgree";

type CompleteSignupFlowDeps = {
  signup: (payload: SignupPayloadType) => Promise<unknown>;
  agreeTerms: (params: {
    userId: string;
    termsAgreeList: TermsProcessRequestType[];
  }) => Promise<unknown>;
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
  const { signup, agreeTerms, navigate, openErrorModal } = deps;

  // 회원가입
  await signup(payload);

  // 약관 동의 내역 로드
  const termsAgreeList = loadTermsAgreeList();
  if (!termsAgreeList || termsAgreeList.length === 0) {
    openErrorModal({
      message: "약관 동의 정보가 없습니다. 약관 동의 화면으로 이동합니다.",
      redirectTo: ROUTES.AUTH.SIGNUP.TERMS,
      replace: true,
    });
    return;
  }

  // 약관 동의 서버 전송
  await agreeTerms({
    userId: payload.userId,
    termsAgreeList,
  });

  // 성공 처리
  clearTermsAgreeList();
  navigate(ROUTES.AUTH.SIGNUP.COMPLETE, { replace: true });
};
