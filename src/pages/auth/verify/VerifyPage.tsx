import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AxiosError } from "axios";

import { VERIFY_TEXT } from "@/constants/texts/auth/verify";
import { ROUTES } from "@/constants/routes";

import { PageTitle } from "@/components/auth/common/PageTitle";
import { VerifyForm } from "@/components/auth/verify/VerifyForm";
import VerifyErrorModal from "@/components/auth/verify/VerifyErrorModal";

import { sendVerification } from "@/api/queries";
import { VERIFICATION_REQUEST_TYPE } from "@/constants/verificationTypes";

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

  const [errorText, setErrorText] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleNext = async (phone: string) => {
    const tel = phone.trim();
    if (!tel) return;

    try {
      if (flow === "signup-verify") {
        await sendVerification(tel, VERIFICATION_REQUEST_TYPE.JOIN_MEMBERSHIP);
      } else {
        await sendVerification(tel); // signup 로직이 아닌 경우 type 미전달
      }

      navigate(current.nextPath, { state: { phone: tel } });
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorText(
          error.response?.data?.message ??
            "인증 번호 전송을 실패했습니다. \n잠시 후 다시 시도해주새요."
        );
      } else {
        setErrorText(
          "인증 번호 전송을 실패했습니다. \n잠시 후 다시 시도해주새요."
        );
      }

      setIsErrorModalOpen(true); // 모달 열기
    }
  };

  return (
    <div className="flex flex-col w-full px-6">
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
      />
    </div>
  );
};

export default VerifyPage;
