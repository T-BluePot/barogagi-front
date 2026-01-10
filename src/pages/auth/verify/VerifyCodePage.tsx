import { useNavigate, useLocation, useParams } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { VERIFY_TEXT } from "@/constants/texts/auth/verify";

import { PageTitle } from "@/components/auth/common/PageTitle";
import { VerifyCodeForm } from "@/components/auth/verify/VerifyCodeForm";

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

  /**
   * flow에 따라 인증번호 재입력을 위한 VerifyPage 경로 반환
   * - 인증번호 만료 시 휴대폰 번호 입력 페이지로 돌아감
   */
  const getVerifyPagePath = () => {
    switch (flow) {
      case "signup-verify":
        return ROUTES.AUTH.SIGNUP.VERIFY;
      case "find-id":
      case "reset-password":
        // find-id, reset-password는 IdFindContent/PwFindContent에서 시작하므로
        // 계정 찾기 페이지로 돌아감
        return ROUTES.AUTH.FIND_ACCOUNT;
      default:
        return ROUTES.ROOT;
    }
  };

  const handleConfirm = (code: string) => {
    if (!code.trim()) return;

    // TODO: API 검증 성공 후 플로우에 따라 이동
    if (flow === "signup-verify") {
      navigate(ROUTES.AUTH.SIGNUP.PROFILE);
    } else if (flow === "find-id") {
      navigate(`${ROUTES.AUTH.FIND_RESULT}?tab=id`, {
        state: { phone: state.phone },
      });
    } else if (flow === "reset-password") {
      navigate(ROUTES.AUTH.FIND_RESET_PASSWORD);
    } else {
      navigate(ROUTES.ROOT);
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
            // 인증번호 만료 시 휴대폰 번호 입력 페이지로 이동
            navigate(getVerifyPagePath());
          }
        }}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default VerifyCodePage;
