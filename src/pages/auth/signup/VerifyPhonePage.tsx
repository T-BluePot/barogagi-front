import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { safeBack } from "@/utils/safeBack";
import { VERIFY_TEXT } from "@/constants/texts/auth/signup/verify";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { PageTitleWithSub } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import Button from "@/components/common/buttons/CommonButton";

const VerifyPhonePage = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState<string>("");

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader
        isDarkBg={true}
        onClick={() => safeBack(navigate, "/signup/credentials")}
      />
      <div className="flex flex-col w-full px-6">
        <PageTitleWithSub
          title={VERIFY_TEXT.PHONE.TITLE}
          subTitle={VERIFY_TEXT.PHONE.SUB_TITLE}
        />
        <div className="flex flex-col gap-6">
          <CommonInput
            label={VERIFY_TEXT.PHONE.LABEL}
            placeholder={VERIFY_TEXT.PHONE.PLACEHOLDER}
            value={phone}
            setValue={setPhone}
            type="tel"
          />
          <Button
            label={VERIFY_TEXT.PHONE.NEXT_BUTTON}
            isDisabled={!phone}
            onClick={() => navigate("/signup/verify/code")}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyPhonePage;
