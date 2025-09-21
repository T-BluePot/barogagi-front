import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/buttons/CommonButton";
import { CommonInput } from "@/components/auth/common/CommonInput";
import { PageTitle } from "@/components/auth/common/PageTitle";

import { FIND_ID_TEXTS } from "@/constants/texts/auth/find/findAuth";
import { VERIFY_TEXT } from "@/constants/texts/auth/verify";

const IdFindContent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!phoneNumber.trim()) {
      alert("휴대전화 번호를 입력해주세요.");
      return;
    }

    // 아이디 찾기 인증 코드 페이지로 이동
    navigate("/verify/find-id/code", {
      state: { phone: phoneNumber, flow: "find-id" },
    });
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
        />
      </div>
      <Button label="본인 인증하기" onClick={handleSubmit} />
    </div>
  );
};

export default IdFindContent;
