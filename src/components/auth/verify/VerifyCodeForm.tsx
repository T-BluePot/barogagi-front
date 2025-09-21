import { useEffect, useState } from "react";
import { VERIFY_TEXT } from "@/constants/texts/auth/verify";
import { CommonInput } from "../common/CommonInput";
import CommonButton from "@/components/common/buttons/CommonButton";
import CodeResendButton from "./CodeResendButton";

type VerifyCodeFormProps = {
  initialSeconds?: number;
  onExpired?: () => void;
  onConfirm: (code: string) => void;
};

export const VerifyCodeForm = ({
  initialSeconds = 180,
  onExpired,
  onConfirm,
}: VerifyCodeFormProps) => {
  const [code, setCode] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [formattedTime, setFormattedTime] = useState(
    `${String(Math.floor(initialSeconds / 60)).padStart(2, "0")}:${String(
      initialSeconds % 60
    ).padStart(2, "0")}`
  );

  // tick timer and handle expiry
  useEffect(() => {
    if (remainingSeconds <= 0) {
      onExpired?.();
      return;
    }
    const id = setInterval(() => setRemainingSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [remainingSeconds, onExpired]);

  // format time
  useEffect(() => {
    const minutes = Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
    setFormattedTime(`${minutes}:${seconds}`);
  }, [remainingSeconds]);

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col w-full">
        <CommonInput
          label={VERIFY_TEXT.CODE.LABEL}
          placeholder={VERIFY_TEXT.CODE.PLACEHOLDER}
          value={code}
          setValue={setCode}
          type="tel"
        />

        {/* <CodeResendButton/> */}
      </div>
      <CommonButton
        label={VERIFY_TEXT.CODE.NEXT_BUTTON}
        isDisabled={!code}
        onClick={() => onConfirm(code)}
      />
    </div>
  );
};
