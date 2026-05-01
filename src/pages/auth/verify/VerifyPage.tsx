import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AxiosError } from "axios";

import { VERIFY_TEXT } from "@/constants/texts/auth/verify";
import { ROUTES } from "@/constants/routes";

import { PageTitle } from "@/components/auth/common/PageTitle";
import { VerifyForm } from "@/components/auth/verify/VerifyForm";
import VerifyErrorModal from "@/components/auth/verify/VerifyErrorModal";
import ErrorModal from "@/components/auth/signup/ErrorModal";

import { checkTel, sendVerification } from "@/api/queries";
import { handleTelError } from "@/utils/auth/handleTelError";
import {
  VERIFICATION_REQUEST_TYPE,
  API_CODE,
} from "@/constants/verificationTypes";

type Flow = "signup-verify" | "find-id" | "reset-password";

type LocationState = { phone?: string };

const FLOW_CONFIG: Record<
  Flow,
  {
    nextPath: string;
    title: string;
    subTitle: string;
    label: string;
    buttonLabel: string;
  }
> = {
  "signup-verify": {
    nextPath: ROUTES.AUTH.VERIFY.SIGNUP,
    title: VERIFY_TEXT.PHONE.TITLE,
    subTitle: VERIFY_TEXT.PHONE.SUB_TITLE,
    label: VERIFY_TEXT.PHONE.LABEL,
    buttonLabel: VERIFY_TEXT.PHONE.NEXT_BUTTON,
  },
  "find-id": {
    nextPath: ROUTES.AUTH.VERIFY.FIND_ID,
    title: "아이디 확인을 위해\n휴대폰 번호를 입력해주세요",
    subTitle: "가입 시 등록한 번호로 인증번호를 보내드려요",
    label: "휴대전화 번호",
    buttonLabel: "본인 인증하기",
  },
  "reset-password": {
    nextPath: ROUTES.AUTH.VERIFY.RESET_PASSWORD,
    title: "비밀번호 재설정을 위해\n휴대폰 번호를 입력해주세요",
    subTitle: "가입 시 등록한 번호로 인증번호를 보내드려요",
    label: "휴대전화 번호",
    buttonLabel: "본인 인증하기",
  },
};

const VerifyPage = () => {
  const { flow } = useParams<{ flow?: Flow }>();
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as LocationState) ?? {};

  useEffect(() => {
    // validate flow
    if (
      !flow ||
      !["signup-verify", "find-id", "reset-password"].includes(flow)
    ) {
      navigate(ROUTES.ROOT, { replace: true });
    }
  }, [flow, navigate]);

  const current = flow
    ? FLOW_CONFIG[flow as Flow]
    : FLOW_CONFIG["signup-verify"];

  // 휴대폰 번호 중복 체크 전용
  const [telErrorMsg, setTelErrorMsg] = useState("");
  const [isTelModalOpen, setIsTelModalOpen] = useState(false);

  // tel 모달 전용: 확인 클릭 시 실행할 후처리
  const [telModalAction, setTelModalAction] = useState<(() => void) | null>(
    null
  );

  const handleTelModalClick = () => {
    setIsTelModalOpen(false);
    setTelErrorMsg("");

    // 닫은 후 실행
    if (telModalAction) telModalAction();

    // 한번 실행 후 초기화
    setTelModalAction(null);
  };

  // VerifyForm 입력 리셋 트리거
  const [resetKey, setResetKey] = useState(0);

  // 인증번호 오류 전용
  const [errorText, setErrorText] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleNext = async (phone: string) => {
    setResetKey(0);
    const tel = phone.trim();
    if (!tel) return;

    // 회원가입 flow 일 경우 휴대폰 번호 중복 확인 로직 실행
    if (flow === "signup-verify") {
      try {
        // T200이면 여기서 그냥 통과(아무 분기 없음)
        await checkTel(tel);
      } catch (error) {
        if (error instanceof AxiosError) {
          const code = error.response?.data?.code as string | undefined;
          const message = error.response?.data?.message as string | undefined;

          handleTelError({
            code,
            message,
            setMessage: setTelErrorMsg,
            setIsOpen: setIsTelModalOpen,
            setTelModalAction,
            action:
              code === API_CODE.TEL_DUPLICATED
                ? () => setResetKey((res) => res + 1)
                : code === API_CODE.INVALID_ACCESS
                  ? () => navigate(ROUTES.ROOT, { replace: true })
                  : undefined,
          });

          return;
        }
      }
    }

    try {
      // 2) 인증번호 전송
      if (flow === "signup-verify") {
        await sendVerification(tel, VERIFICATION_REQUEST_TYPE.JOIN_MEMBERSHIP);
      } else if (flow === "find-id") {
        await sendVerification(tel, VERIFICATION_REQUEST_TYPE.FIND_ID);
      } else if (flow === "reset-password") {
        await sendVerification(tel, VERIFICATION_REQUEST_TYPE.RESET_PASSWORD);
      } else {
        await sendVerification(tel);
      }

      navigate(current.nextPath, { state: { phone: tel } });
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorText(
          error.response?.data?.message ??
            "인증 번호 전송을 실패했습니다. \n잠시 후 다시 시도해주세요."
        );
      } else {
        setErrorText(
          "인증 번호 전송을 실패했습니다. \n잠시 후 다시 시도해주세요."
        );
      }

      setIsErrorModalOpen(true); // 모달 열기
    }
  };

  return (
    <div className="flex flex-col w-full px-6">
      <ErrorModal
        isOpen={isTelModalOpen}
        message={telErrorMsg}
        onClick={handleTelModalClick}
      />
      <VerifyErrorModal
        isOpen={isErrorModalOpen}
        message={errorText}
        onClick={() => setIsErrorModalOpen(false)}
      />
      <PageTitle title={current.title} subTitle={current.subTitle} />
      <VerifyForm
        label={current.label}
        placeholder={"phone number"}
        initialPhone={state.phone}
        buttonLabel={current.buttonLabel}
        onNext={handleNext}
        resetKey={resetKey}
      />
    </div>
  );
};

export default VerifyPage;
