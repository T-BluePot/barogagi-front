import { useEffect } from "react";
import { usePhoneVerify } from "@/hooks/usePhoneVerify";
import TextButton from "@/components/common/buttons/TextButton";

type Props = {
  initialPhone?: string;
};

const CodeResendButton = ({ initialPhone = "" }: Props) => {
  const { status, error, formattedTime, resend } = usePhoneVerify();

  useEffect(() => {
    // if initialPhone is provided, auto-send? (opt-in)
  }, [initialPhone]);

  // send is triggered elsewhere; this component focuses on showing timer and offering resend

  const isDisabled = status !== "sent" || !/^\d{10,11}$/.test(initialPhone);

  return (
    <div className="space-y-4 w-max-content">
      {/* phone input is left to consumer; this component focuses on send/resend status and timer */}
      <div className="flex items-center justify-between">
        <div className="typo-body">
          {status === "sent" ? formattedTime : ""}
        </div>
        <TextButton
          label="재전송"
          onClick={() => resend(initialPhone)}
          variant={isDisabled ? "default" : "main"}
          isDisabled={isDisabled}
        />
      </div>
      {error && <div className="text-alert-red typo-caption">{error}</div>}
    </div>
  );
};

export default CodeResendButton;
