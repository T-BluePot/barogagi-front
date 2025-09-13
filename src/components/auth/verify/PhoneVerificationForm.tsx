import { useEffect } from "react";
import { usePhoneVerify } from "@/hooks/usePhoneVerify";

type Props = {
  initialPhone?: string;
  onSent?: (phone: string) => void;
  flow?: string;
};

const PhoneVerificationForm = ({ initialPhone = "", onSent, flow }: Props) => {
  const { status, error, remainingSeconds, formattedTime, sendCode, resend } =
    usePhoneVerify();

  useEffect(() => {
    // if initialPhone is provided, auto-send? (opt-in)
  }, [initialPhone]);

  const handleSend = async (phone: string) => {
    const ok = await sendCode(phone);
    if (ok && onSent) onSent(phone);
  };

  return (
    <div className="space-y-4">
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

export default PhoneVerificationForm;
