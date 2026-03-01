import { useState, useEffect } from "react";
import { CommonInput } from "../common/CommonInput";
import CommonButton from "@/components/common/buttons/CommonButton";

type VerifyFormPropsType = {
  label: string;
  placeholder?: string;
  initialPhone?: string;
  buttonLabel: string;
  onNext: (phone: string) => void;

  resetKey?: number; // 값이 바뀔 때마다 입력값 리셋
};

export const VerifyForm = ({
  label,
  placeholder = "phone number",
  initialPhone = "",
  buttonLabel,
  onNext,
  resetKey,
}: VerifyFormPropsType) => {
  const [phone, setPhone] = useState(initialPhone);

  // 상위에서 resetKey가 바뀌면 초기값으로 다시 세팅
  useEffect(() => {
    setPhone(initialPhone);
  }, [resetKey, initialPhone]);

  const handleNext = () => {
    if (!phone.trim()) {
      alert("휴대전화 번호를 입력해주세요.");
      return;
    }
    onNext(phone);
  };

  return (
    <div className="flex flex-col gap-6">
      <CommonInput
        label={label}
        placeholder={placeholder}
        value={phone}
        setValue={setPhone}
        type="tel"
      />
      <CommonButton
        label={buttonLabel}
        isDisabled={!phone}
        onClick={handleNext}
      />
    </div>
  );
};
