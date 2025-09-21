import { useEffect } from "react";
import { usePhoneVerify } from "@/hooks/usePhoneVerify";

type Props = {
  initialPhone?: string;
};

const CodeResendButton = ({ initialPhone = "" }: Props) => {
  const { status, error, formattedTime, resend } = usePhoneVerify();

  useEffect(() => {
    // if initialPhone is provided, auto-send? (opt-in)
  }, [initialPhone]);

  // send is triggered elsewhere; this component focuses on showing timer and offering resend

  return (
    <div className="space-y-4 w-max-content">
      {/* phone input is left to consumer; this component focuses on send/resend status and timer */}
      <div className="flex items-center justify-between">
        <div className="typo-body">
          {status === "sent" ? formattedTime : ""}
        </div>
        <button
          className="text-sm text-lime-400"
          onClick={() => resend(initialPhone)}
          disabled={status !== "sent"}
        >
          재전송
        </button>
      </div>
      {error && <div className="text-alert-red typo-caption">{error}</div>}
    </div>
  );
};

export default CodeResendButton;
