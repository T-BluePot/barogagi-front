import { useNavigate, useLocation, useParams } from "react-router-dom";

import { safeBack } from "@/utils/safeBack";
import { VERIFY_TEXT } from "@/constants/texts/auth/verify";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { PageTitle } from "@/components/auth/common/PageTitle";
import { VerifyCodeForm } from "@/components/auth/verify/VerifyCodeForm";

type LocationState = {
  phone?: string;
  returnTo?: string;
  flow?: string;
};

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flow: paramFlow } = useParams<{ flow?: string }>();
  const state = (location.state as LocationState) ?? {};

  const flow = paramFlow ?? state.flow ?? "signup";

  const handleConfirm = (code: string) => {
    if (!code.trim()) return;

    // TODO: API 검증 성공 후 플로우에 따라 이동
    if (flow === "signup") {
      navigate("/signup/profile");
    } else if (flow === "find-id") {
      navigate("/find", { state: { phone: state.phone } });
    } else if (flow === "reset-password") {
      navigate("/reset-password");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader
        isDarkBg={true}
        onClick={() => safeBack(navigate, `/verify/${flow}`)}
      />
      <div className="flex flex-col w-full px-6">
        <PageTitle title={VERIFY_TEXT.CODE.TITLE} />
        <VerifyCodeForm
          initialSeconds={180}
          onExpired={() => {
            if (state.returnTo) {
              navigate(state.returnTo);
            } else {
              navigate(`/verify/${flow}`);
            }
          }}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
};

export default VerifyCodePage;
