import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { safeBack } from "@/utils/safeBack";
import { VERIFY_TEXT } from "@/constants/texts/auth/signup/verify";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import Button from "@/components/common/buttons/CommonButton";

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>("");
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
          />
          <Button
            label={VERIFY_TEXT.PHONE.NEXT_BUTTON}
            isDisabled={!code}
            onClick={() => navigate("/signup/verify")}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyCodePage;
