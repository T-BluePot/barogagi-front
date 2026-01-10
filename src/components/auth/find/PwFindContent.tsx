import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/buttons/CommonButton";
import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import { ROUTES } from "@/constants/routes";

import { FIND_PW_TEXTS } from "@/constants/texts/auth/find/findAuth";

const PwFindContent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!phoneNumber.trim()) {
      alert("휴대전화 번호를 입력해주세요.");
      return;
    }

    // 비밀번호 재설정 인증 코드 페이지로 이동
    navigate(ROUTES.AUTH.VERIFY.RESET_PASSWORD, {
      state: { phone: phoneNumber, flow: "reset-password" },
    });
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title={FIND_PW_TEXTS.TITLE}
        subTitle={FIND_PW_TEXTS.SUB_TITLE}
      />

      <div className="space-y-4">
        <CommonInput
          label={FIND_PW_TEXTS.LABEL}
          placeholder={FIND_PW_TEXTS.PLACEHOLDER}
          value={phoneNumber}
          setValue={setPhoneNumber}
          type="tel"
        />
      </div>
      <div className="mb-6">
        <Button
          label={FIND_PW_TEXTS.BUTTON}
          isDisabled={!/^\d{10,11}$/.test(phoneNumber)}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default PwFindContent;
