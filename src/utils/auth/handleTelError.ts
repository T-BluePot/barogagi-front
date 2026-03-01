import toast from "react-hot-toast";
import { API_CODE } from "@/constants/verificationTypes";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type HandleTelErrorParams = {
  code?: string;
  message?: string;
  setMessage: SetState<string>;
  setIsOpen: SetState<boolean>;

  // 핵심: 상태에 저장할 "onClick 액션"을 인자로 받는다
  setTelModalAction: SetState<(() => void) | null>;

  // 상황별로 모달 클릭 액션을 다르게 주고 싶으면 이걸 전달
  action?: () => void;
};

export const handleTelError = ({
  code,
  message,
  setMessage,
  setIsOpen,
  setTelModalAction,
  action,
}: HandleTelErrorParams) => {
  const msg =
    message ?? "전화번호 확인에 실패했습니다.\n잠시 후 다시 시도해주세요.";

  // === S400: 동일한 전화번호로 중복 회원가입 불가 ===
  if (code === API_CODE.TEL_DUPLICATED) {
    setMessage(msg);

    // 모달 확인 클릭 시 실행할 액션 저장 (없으면 null)
    setTelModalAction(() => action ?? null);

    setIsOpen(true);
    return;
  }

  // === C101: 정보 입력 필요(파라미터 누락/빈 값) ===
  if (code === API_CODE.NEED_INPUT) {
    toast("전화번호를 입력해주세요");
    return;
  }

  // === A100: 잘못된 접근(권한/접근 경로 문제 등) ===
  if (code === API_CODE.INVALID_ACCESS) {
    setMessage(msg);
    setTelModalAction(() => action ?? null);
    setIsOpen(true);
    return;
  }

  // === COMMON-500: 서버 오류 ===
  if (code === API_CODE.SERVER_ERROR) {
    toast(msg);
    return;
  }

  // === code가 없거나(네트워크) 명세 밖 코드 ===
  toast(msg);
};
