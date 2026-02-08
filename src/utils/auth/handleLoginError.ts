import { AxiosError } from "axios";

type SetError = (message: string | null) => void;

type HandleLoginErrorDeps = {
  setError: SetError;
};

export const handleLoginError =
  ({ setError }: HandleLoginErrorDeps) =>
  (error: unknown) => {
    // Axios 에러인 경우
    if (error instanceof AxiosError) {
      const code: string | undefined = error.response?.data?.code;
      const serverMessage: string | undefined = error.response?.data?.message;

      // code별로 "프론트가 통제하는 문구"를 우선 적용
      const messageByCode: Record<string, string> = {
        C101: "아이디와 비밀번호를 입력해주세요.",
        L102: "회원 정보가 존재하지 않습니다.\n아이디를 확인해주세요.",
        L103: "아이디 또는 비밀번호가 올바르지 않습니다.",
        // 환경변수/설정 문제라 사용자에게 너무 자세히 노출하지 않는 게 보통 안전
        A100: "서비스 설정 오류로 로그인할 수 없습니다.\n잠시 후 다시 시도해주세요.",
        "400":
          "로그인 처리 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
      };

      // 매핑된 코드면 해당 멘트 사용
      if (code && messageByCode[code]) {
        setError(messageByCode[code]);
        return;
      }

      // 매핑 없는 코드면 서버 메시지 있으면 사용, 없으면 fallback
      setError(
        serverMessage ?? "로그인에 실패하였습니다.\n잠시 후 다시 시도해주세요."
      );
      return;
    }

    // 일반 Error
    if (error instanceof Error) {
      setError(error.message);
      return;
    }

    setError("알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
  };
