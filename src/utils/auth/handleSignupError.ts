import { AxiosError } from "axios";
import type { SignupErrorState } from "@/types/signupTypes";
import { ROUTES } from "@/constants/routes";

type OpenErrorModal = (params: Omit<SignupErrorState, "isOpen">) => void;

type HandleSignupErrorDeps = {
  openErrorModal: OpenErrorModal;
};

export const handleSignupError =
  ({ openErrorModal }: HandleSignupErrorDeps) =>
  (error: unknown) => {
    if (error instanceof AxiosError) {
      const code = error.response?.data?.code;
      const message =
        error.response?.data?.message ?? "회원가입에 실패했습니다.";

      // 400: 기본 오류 발생
      if (code === "400") {
        openErrorModal({
          message,
        });
        return;
      }

      // S102: 적합한 아이디, 비밀번호, 닉네임이 아닙니다.
      if (code === "S102") {
        openErrorModal({
          message,
          redirectTo: ROUTES.AUTH.SIGNUP.CREDENTIALS,
        });
        return;
      }

      // U300: 해당 아이디 사용이 불가능합니다.
      if (code === "U300") {
        openErrorModal({
          message,
          redirectTo: ROUTES.AUTH.SIGNUP.CREDENTIALS,
        });
        return;
      }

      // 그 외 code: 일단 현재 페이지 유지 + 메시지만 안내
      openErrorModal({
        message,
      });
      return;
    }

    // 일반 Error
    if (error instanceof Error) {
      openErrorModal({
        message: error.message,
      });
      return;
    }

    openErrorModal({
      message: "알 수 없는 오류가 발생했습니다.",
    });
  };
