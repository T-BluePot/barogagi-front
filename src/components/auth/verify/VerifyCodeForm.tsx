import { useEffect, useState } from "react";
import { VERIFY_TEXT } from "@/constants/texts/auth/verify";
import { CommonInput } from "../common/CommonInput";
import Button from "@/components/common/buttons/CommonButton";
import CodeResendButton from "@/components/auth/verify/CodeResendButton";

type VerifyCodeButtonProps = {
  label?: string;
  disabled?: boolean; // 선택값 (외부 조건)
  onConfirm: (code: string) => void;
};

type VerifyCodeFormProps = {
  initialSeconds?: number;
  onExpired?: () => void;
  buttonProps: VerifyCodeButtonProps;
};

export const VerifyCodeForm = ({
  initialSeconds = 180,
  onExpired,
  buttonProps,
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

  // button props
  const buttonLabel = buttonProps?.label ?? VERIFY_TEXT.CODE.NEXT_BUTTON;
  const isDisabled = !code || buttonProps?.disabled === true;

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
        <div className="flex mt-2">
          <div className="flex grow text-center items-baseline">
            <span className="typo-body text-alert-red">{formattedTime}</span>
          </div>
          <CodeResendButton />
        </div>
      </div>
      <div className="mb-6">
        <Button
          label={buttonLabel}
          isDisabled={isDisabled}
          onClick={() => buttonProps.onConfirm(code)}
        />
      </div>
    </div>
  );
};
