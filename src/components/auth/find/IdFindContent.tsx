import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationError } from "yup";

import Button from "@/components/common/buttons/CommonButton";
import { CommonInput } from "@/components/auth/common/CommonInput";
import { PageTitle } from "@/components/auth/common/PageTitle";
import { ROUTES } from "@/constants/routes";

import { FIND_ID_TEXTS } from "@/constants/texts/auth/find/findAuth";
import { sendVerification } from "@/api/queries";
import { VERIFICATION_REQUEST_TYPE } from "@/constants/verificationTypes";
import { phoneSchema } from "@/utils/authSchema";

const IdFindContent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  // === 유효성 검사 ===
  const handleValidate = async (): Promise<boolean> => {
    const newErrors: { [key: string]: string } = {};

    try {
      await phoneSchema.validate(phoneNumber);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        newErrors.phone = err.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void handleValidate();
    }, 150);

    return () => clearTimeout(timer);
  }, [phoneNumber]);

  // === 제출 ===
  const handleSubmit = async () => {
    const tel = phoneNumber.trim();
    if (!tel) return;

    const isValid = await handleValidate();
    if (!isValid) return;

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

  // === 버튼 비활성화 검증 ===
  const isSubmitDisabled = useMemo(() => {
    if (phoneNumber.trim() === "") return true;
    if (Object.keys(errors).length !== 0) return true;
    if (isLoading) return true;
    return false;
  }, [phoneNumber, errors, isLoading]);

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
          error={phoneNumber !== "" && !!errors.phone}
          helperText={phoneNumber !== "" ? errors.phone : ""}
        />
      </div>
      <div className="mb-6">
        <Button
          label={isLoading ? "전송 중..." : FIND_ID_TEXTS.BUTTON}
          isDisabled={isSubmitDisabled}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default IdFindContent;
