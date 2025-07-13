import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { safeBack } from "@/utils/safeBack";
import { VERIFY_TEXT } from "@/constants/texts/auth/signup/verify";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import Button from "@/components/common/buttons/CommonButton";

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>("");

  const [remainingSeconds, setRemainingSeconds] = useState(180); // 3분 = 180초
  const [formattedTime, setFormattedTime] = useState("03:00");

  // 1초마다 남은 시간 감소
  useEffect(() => {
    if (remainingSeconds <= 0) {
      // 시간 초과 시 실행
      navigate("/signup/verify");
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 사라질 때 정리
  }, [remainingSeconds, navigate]);

  // 남은 초를 MM:SS 형식으로 변환
  useEffect(() => {
    const minutes = Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
    setFormattedTime(`${minutes}:${seconds}`);
  }, [remainingSeconds]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader
        isDarkBg={true}
        onClick={() => safeBack(navigate, "/signup/credentials")}
      />
      <div className="flex flex-col w-full px-6">
        <PageTitle title={VERIFY_TEXT.CODE.TITLE} />
        <div className="flex flex-col gap-6">
          <CommonInput
            label={VERIFY_TEXT.CODE.LABEL}
            placeholder={VERIFY_TEXT.CODE.PLACEHOLDER}
            value={code}
            setValue={setCode}
            type="tel"
            error={!!formattedTime}
            helperText={formattedTime}
          />
          <Button
            label={VERIFY_TEXT.CODE.NEXT_BUTTON}
            isDisabled={!code}
            onClick={() => navigate("/signup/profile")}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyCodePage;
