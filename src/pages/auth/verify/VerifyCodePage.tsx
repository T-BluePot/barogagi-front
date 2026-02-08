import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import { AxiosError } from "axios";

import { ROUTES } from "@/constants/routes";
import { VERIFY_TEXT } from "@/constants/texts/auth/verify";

import { PageTitle } from "@/components/auth/common/PageTitle";
import { VerifyCodeForm } from "@/components/auth/verify/VerifyCodeForm";
import VerifyErrorModal from "@/components/auth/verify/VerifyErrorModal";

// === server ===
import { verifyVerification } from "@/api/queries";
import { VERIFICATION_REQUEST_TYPE } from "@/constants/verificationTypes";

// === store ===
import { useSignupStore } from "@/stores/signupStore";

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

  //  스토어에서 setDraft 가져오기
  const setDraft = useSignupStore((s) => s.setDraft);

  // === 전화번호 인증 ===
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [isVerifyErrorOpen, setIsVerifyErrorOpen] = useState(false);

  const flow = paramFlow ?? state.flow ?? "signup";

  // state에서 전화번호를 가져옴
  const tel = useMemo(() => state.phone?.trim(), [state.phone]);

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
  const getVerifyPagePath = useCallback(() => {
    switch (flow) {
      case "signup-verify":
        return ROUTES.AUTH.SIGNUP.VERIFY;
      case "find-id":
      case "reset-password":
        return ROUTES.AUTH.FIND_ACCOUNT;
      default:
        return ROUTES.ROOT;
    }
  }, [flow]);

  // tel 값이 없는 경우 이전 페이지로
  useEffect(() => {
    if (!tel) {
      navigate(getVerifyPagePath(), { replace: true });
    }
  }, [tel, navigate, getVerifyPagePath]);

  if (!tel) {
    // tel 없으면 폼 자체를 렌더하지 않음 → handleConfirm이 실행될 경로가 사라짐
    return null;
  }

  const handleConfirm = async (code: string) => {
    const authCode = code.trim();
    if (!authCode) return;

    setIsLoading(true);
    setErrorText("");

    try {
      // flow에 따라 인증 타입 설정
      const getVerificationType = () => {
        switch (flow) {
          case "signup-verify":
            return VERIFICATION_REQUEST_TYPE.JOIN_MEMBERSHIP;
          case "find-id":
            return VERIFICATION_REQUEST_TYPE.FIND_ID;
          case "reset-password":
            return VERIFICATION_REQUEST_TYPE.RESET_PASSWORD;
          default:
            return undefined;
        }
      };
      const type = getVerificationType();

      // tel + authCode로 인증번호 확인 API 호출
      await verifyVerification({ tel, authCode }, type);

      // 성공 시 flow에 따라 다음 단계로 이동
      if (flow === "signup-verify") {
        // signup flow 시 draft.tel 업데이트
        setDraft({ tel });
        navigate(ROUTES.AUTH.SIGNUP.PROFILE, { replace: true });
      } else if (flow === "find-id") {
        navigate(`${ROUTES.AUTH.FIND_RESULT}?tab=id`, {
          state: { phone: tel },
          replace: true,
        });
      } else if (flow === "reset-password") {
        navigate(ROUTES.AUTH.FIND_RESET_PASSWORD, {
          state: { phone: tel },
          replace: true,
        });
      } else {
        navigate(ROUTES.ROOT, { replace: true });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorText(
          error.response?.data?.message ?? "인증 처리에 실패했습니다."
        );
      } else {
        setErrorText("인증 처리에 실패했습니다.");
      }

      setIsVerifyErrorOpen(true); // 모달 열기
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseVerifyErrorModal = () => {
    setIsVerifyErrorOpen(false);
    setErrorText("");
  };

  return (
    <div className="flex flex-col w-full px-6">
      <VerifyErrorModal
        isOpen={isVerifyErrorOpen}
        message={errorText}
        onClick={handleCloseVerifyErrorModal}
      />
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
        buttonProps={{
          label: isLoading ? "처리중" : undefined,
          disabled: isLoading,
          onConfirm: handleConfirm,
        }}
      />
    </div>
  );
};

export default VerifyCodePage;
