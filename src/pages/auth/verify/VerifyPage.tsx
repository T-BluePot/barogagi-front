import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { safeBack } from "@/utils/safeBack";
import { VERIFY_TEXT } from "@/constants/texts/auth/signup/verify";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import Button from "@/components/common/buttons/CommonButton";

type Flow = "signup" | "find-id" | "reset-password";

type LocationState = {
  phone?: string;
};

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
  signup: {
    nextPath: "/verify/signup/code",
    title: VERIFY_TEXT.PHONE.TITLE,
    subTitle: VERIFY_TEXT.PHONE.SUB_TITLE,
    label: VERIFY_TEXT.PHONE.LABEL,
    buttonLabel: VERIFY_TEXT.PHONE.NEXT_BUTTON,
  },
  "find-id": {
    nextPath: "/verify/find-id/code",
    title: "아이디 확인을 위해\n휴대폰 번호를 입력해주세요",
    subTitle: "가입 시 등록한 번호로 인증번호를 보내드려요",
    label: "휴대전화 번호",
    buttonLabel: "본인 인증하기",
  },
  "reset-password": {
    nextPath: "/verify/reset-password/code",
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

  const [phone, setPhone] = useState<string>(state.phone ?? "");

  useEffect(() => {
    // validate flow
    if (!flow || !["signup", "find-id", "reset-password"].includes(flow)) {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow]);

  const current = flow ? FLOW_CONFIG[flow as Flow] : FLOW_CONFIG.signup;

  const handleNext = () => {
    if (!phone.trim()) {
      alert("휴대전화 번호를 입력해주세요.");
      return;
    }

    // 실제 구현에서는 여기서 인증 코드 전송 API 호출
    // phone 등 민감 정보는 URL에 두지 않고 state로 전달
    navigate(current.nextPath, { state: { phone } });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader
        isDarkBg={true}
        onClick={() => safeBack(navigate, "/")}
        label={"인증"}
      />
      <div className="flex flex-col w-full px-6">
        <PageTitle title={current.title} subTitle={current.subTitle} />
        <div className="flex flex-col gap-6">
          <CommonInput
            label={current.label}
            placeholder={"010-1234-5678"}
            value={phone}
            setValue={setPhone}
            type="tel"
          />
          <Button
            label={current.buttonLabel}
            isDisabled={!phone}
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
