import { useState } from "react";
import Button from "@/components/common/buttons/CommonButton";
import { CommonInput } from "@/components/auth/common/CommonInput";
import { PageTitle } from "@/components/auth/common/PageTitle";

import { FIND_ID_TEXTS } from "@/constants/texts/auth/find/findAuth";
import { VERIFY_TEXT } from "@/constants/texts/auth/verify";

const IdFindContent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = () => {
    // 아이디 찾기 로직
    console.log("아이디 찾기:", phoneNumber);
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title={FIND_ID_TEXTS.TITLE}
        subTitle={FIND_ID_TEXTS.SUB_TITLE}
      />
      <div className="space-y-4">
        <CommonInput
          label={VERIFY_TEXT.PHONE.LABEL}
          placeholder={VERIFY_TEXT.PHONE.PLACEHOLDER}
          value={phoneNumber}
          setValue={setPhoneNumber}
          type="tel"
          error={phoneNumber !== "" && !!errors.phoneNumber}
          helperText={phoneNumber !== "" ? errors.phoneNumber : ""}
        />
      </div>
      <Button label="본인 인증하기" onClick={handleSubmit} />
    </div>
  );
};

export default IdFindContent;
