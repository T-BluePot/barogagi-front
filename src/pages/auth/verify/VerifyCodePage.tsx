import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { safeBack } from "@/utils/safeBack";
import { VERIFY_TEXT } from "@/constants/texts/auth/signup/verify";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import Button from "@/components/common/buttons/CommonButton";

type LocationState = {
  phone?: string;
  returnTo?: string;
  flow?: string;
};

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flow: paramFlow } = useParams<{ flow?: string }>();
  const state = (location.state as LocationState) ?? {};

  const flow = paramFlow ?? state.flow ?? "signup";

  const [code, setCode] = useState<string>("");

  const [remainingSeconds, setRemainingSeconds] = useState(180); // 3분 = 180초
  const [formattedTime, setFormattedTime] = useState("03:00");

  // 1초마다 남은 시간 감소
  useEffect(() => {
    if (remainingSeconds <= 0) {
      // 시간 초과 시 실행 - 복귀 경로가 있으면 복귀
      if (state.returnTo) {
        navigate(state.returnTo);
      } else {
        navigate(`/verify/${flow}`);
      }
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 사라질 때 정리
  }, [remainingSeconds, navigate, state.returnTo, flow]);

  // 남은 초를 MM:SS 형식으로 변환
  useEffect(() => {
    const minutes = Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
    setFormattedTime(`${minutes}:${seconds}`);
  }, [remainingSeconds]);

  const handleConfirm = () => {
    if (!code.trim()) return;

    // 실제 검증 API 호출 성공 시 플로우에 따라 이동
    if (flow === "signup") {
      navigate("/signup/profile");
    } else if (flow === "find-id") {
      navigate("/find", { state: { phone: state.phone } });
    } else if (flow === "reset-password") {
      navigate("/reset-password");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader
        isDarkBg={true}
        onClick={() => safeBack(navigate, `/verify/${flow}`)}
      />
      <div className="flex flex-col w-full px-6">
        <PageTitle title={VERIFY_TEXT.CODE.TITLE} />
        <div className="flex flex-col w-full gap-6">
          <div className="flex flex-col w-full">
            <CommonInput
              label={VERIFY_TEXT.CODE.LABEL}
              placeholder={VERIFY_TEXT.CODE.PLACEHOLDER}
              value={code}
              setValue={setCode}
              type="tel"
            />
            <div className="flex w-full px-4 mt-2 text-center items-baseline">
              <span className="typo-body text-alert-red">{formattedTime}</span>
            </div>
          </div>
          <Button
            label={VERIFY_TEXT.CODE.NEXT_BUTTON}
            isDisabled={!code}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyCodePage;
