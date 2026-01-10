import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { safeBack } from "@/utils/safeBack";
import { VERIFY_TEXT } from "@/constants/texts/auth/verify";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { PageTitle } from "@/components/auth/common/PageTitle";
import { VerifyForm } from "@/components/auth/verify/VerifyForm";

type Flow = "signup-verify" | "find-id" | "reset-password";

type LocationState = { phone?: string };

/**
 * flow별 인증 페이지 설정
 * - nextPath: 인증번호 입력 페이지 경로 (/auth prefix 포함해야 함)
 * - AuthRoutes가 /auth/* 하위에서 동작하므로 전체 경로 필요
 */
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
    nextPath: "/auth/verify/signup-verify/code",
    title: VERIFY_TEXT.PHONE.TITLE,
    subTitle: VERIFY_TEXT.PHONE.SUB_TITLE,
    label: VERIFY_TEXT.PHONE.LABEL,
    buttonLabel: VERIFY_TEXT.PHONE.NEXT_BUTTON,
  },
  "find-id": {
    nextPath: "/auth/verify/find-id/code",
    title: "아이디 확인을 위해\n휴대폰 번호를 입력해주세요",
    subTitle: "가입 시 등록한 번호로 인증번호를 보내드려요",
    label: "휴대전화 번호",
    buttonLabel: "본인 인증하기",
  },
  "reset-password": {
    nextPath: "/auth/verify/reset-password/code",
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
      navigate("/", { replace: true });
    }
  }, [flow, navigate]);

  const current = flow
    ? FLOW_CONFIG[flow as Flow]
    : FLOW_CONFIG["signup-verify"];

  const handleNext = (phone: string) => {
    // TODO: 인증코드 전송 API 호출 후 페이지 이동
    navigate(current.nextPath, { state: { phone } });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader
        isDarkBg={true}
        onClick={() => safeBack(navigate, "/")}
        label={"인증하기"}
      />
      <div className="flex flex-col w-full px-6">
        <PageTitle title={current.title} subTitle={current.subTitle} />
        <VerifyForm
          label={current.label}
          placeholder={"phone number"}
          initialPhone={state.phone}
          buttonLabel={current.buttonLabel}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

export default VerifyPage;
