import { useNavigate, useLocation, useParams } from "react-router-dom";

import { VERIFY_TEXT } from "@/constants/texts/auth/verify";

import { PageTitle } from "@/components/auth/common/PageTitle";
import { VerifyCodeForm } from "@/components/auth/verify/VerifyCodeForm";
import {
  FIND_ID_TEXTS,
  FIND_PW_TEXTS,
} from "@/constants/texts/auth/find/findAuth";

type LocationState = {
  phone?: string;
  returnTo?: string;
  flow?: string;
  label?: string;
};

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flow: paramFlow } = useParams<{ flow?: string }>();
  const state = (location.state as LocationState) ?? {};

  const flow = paramFlow ?? state.flow ?? "signup";

  // NOTE: 인증 시 헤더 라벨 설정 주석 처리
  // flow에 따른 헤더 라벨 설정
  // const getHeaderLabel = () => {
  //   if (state.label) return state.label;

  //   switch (flow) {
  //     case "find-id":
  //       return FIND_ID_TEXTS.PAGE_TITLE;
  //     case "reset-password":
  //       return FIND_PW_TEXTS.PAGE_TITLE;
  //     default:
  //       return "인증하기";
  //   }
  // };

  const handleConfirm = (code: string) => {
    if (!code.trim()) return;

    // TODO: API 검증 성공 후 플로우에 따라 이동
    // AuthRoutes가 /auth/* 하위에서 동작하므로 전체 경로 필요
    if (flow === "signup-verify") {
      navigate("/auth/signup/profile");
    } else if (flow === "find-id") {
      navigate("/auth/find/result?tab=id", { state: { phone: state.phone } });
    } else if (flow === "reset-password") {
      navigate("/auth/find/reset-password");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col w-full px-6">
      <PageTitle title={VERIFY_TEXT.CODE.TITLE} />
      <VerifyCodeForm
        initialSeconds={180}
        onExpired={() => {
          if (state.returnTo) {
            navigate(state.returnTo);
          } else {
            navigate(`/auth/verify/${flow}`);
          }
        }}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default VerifyCodePage;
