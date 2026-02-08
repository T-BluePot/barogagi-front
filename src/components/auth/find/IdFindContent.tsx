import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/buttons/CommonButton";
import { CommonInput } from "@/components/auth/common/CommonInput";
import { PageTitle } from "@/components/auth/common/PageTitle";
import { ROUTES } from "@/constants/routes";

import { FIND_ID_TEXTS } from "@/constants/texts/auth/find/findAuth";
import { sendVerification } from "@/api/queries";
import { VERIFICATION_REQUEST_TYPE } from "@/constants/verificationTypes";

const IdFindContent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const tel = phoneNumber.trim();
    if (!tel) {
      alert("휴대전화 번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // 인증번호 발송 후 코드 입력 페이지로 이동
      await sendVerification(tel, VERIFICATION_REQUEST_TYPE.FIND_ID);
      navigate(ROUTES.AUTH.VERIFY.FIND_ID, {
        state: { phone: tel, flow: "find-id" },
      });
    } catch {
      alert("인증번호 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title={FIND_ID_TEXTS.TITLE}
        subTitle={FIND_ID_TEXTS.SUB_TITLE}
      />
      <div className="space-y-4">
        <CommonInput
          label={FIND_ID_TEXTS.LABEL}
          placeholder={FIND_ID_TEXTS.PLACEHOLDER}
          value={phoneNumber}
          setValue={setPhoneNumber}
          type="tel"
        />
      </div>
      <div className="mb-6">
        <Button
          label={isLoading ? "전송 중..." : FIND_ID_TEXTS.BUTTON}
          isDisabled={!/^\d{10,11}$/.test(phoneNumber) || isLoading}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default IdFindContent;
