import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePhoneVerify } from "@/hooks/usePhoneVerify";

type Props = {
  initialPhone?: string;
  flow?: "find-id" | "reset-password" | "signup";
  onSuccess?: (result?: any) => void;
  onCancel?: () => void;
};

const VerifyInline = ({
  initialPhone = "",
  flow = "find-id",
  onSuccess,
  onCancel,
}: Props) => {
  const [phone, setPhone] = useState(initialPhone);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const { status, error, formattedTime, sendCode, verifyCode, resend } =
    usePhoneVerify();

  const handleSend = async () => {
    if (!phone.trim()) {
      alert("휴대전화 번호를 입력해주세요.");
      return;
    }

    const ok = await sendCode(phone);
    if (!ok) return;
    // remain inline; user will input code
  };

  const handleConfirm = async () => {
    if (!code.trim()) return;

    const ok = await verifyCode(phone, code);
    if (!ok) return;

    // flow 별 성공 후 동작
    if (onSuccess) {
      onSuccess({ phone });
      return;
    }

    if (flow === "find-id") {
      navigate("/find", { state: { phone } });
    } else if (flow === "reset-password") {
      navigate("/reset-password", { state: { phone } });
    } else if (flow === "signup") {
      navigate("/signup/profile", { state: { phone } });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-lime-400 mb-2">
          휴대전화 번호
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-1234-5678"
          className="w-full bg-transparent border-b border-gray-600 text-white text-lg pb-2 focus:border-lime-400 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={handleSend}
          className="col-span-2 bg-lime-400 text-black font-medium py-3 rounded-full hover:bg-lime-500 transition-colors"
        >
          인증번호 전송
        </button>
        <div className="flex items-center justify-center text-sm text-gray-400">
          {status === "sent" ? formattedTime : ""}
        </div>
      </div>

      {status === "sent" && (
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-lime-400 mb-2">
              인증 번호
            </label>
            <input
              type="tel"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="인증 번호를 입력해주세요"
              className="w-full bg-transparent border-b border-gray-600 text-white text-lg pb-2 focus:border-lime-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => resend(phone)}
              className="text-sm text-lime-400"
            >
              재전송
            </button>

            {onCancel && (
              <button
                onClick={() => onCancel()}
                className="text-sm text-gray-400 ml-2"
              >
                취소
              </button>
            )}

            <button
              onClick={handleConfirm}
              className="ml-auto bg-lime-400 text-black font-medium py-2 px-4 rounded-full hover:bg-lime-500 transition-colors"
            >
              확인
            </button>
          </div>
          {error && <div className="text-alert-red typo-caption">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default VerifyInline;
