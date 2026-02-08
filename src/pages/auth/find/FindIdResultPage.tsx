import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";

import { ROUTES } from "@/constants/routes";
import { FIND_ID_TEXTS } from "@/constants/texts/auth/find/findAuth";
import { FullScreenModal } from "@/components/common/modal/full-screen-modal/FullScreenModal";
import { findUser } from "@/api/queries";

type FindIdResult = {
  success: boolean;
  userId?: string;
};

const FindIdResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { phone?: string } | null) ?? {};

  const [result, setResult] = useState<FindIdResult | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!state.phone) {
        setResult({ success: false });
        return;
      }

      try {
        const response = await findUser(state.phone);
        const users = response.data as { userId: string }[];
        setResult({
          success: users.length > 0,
          userId: users[0]?.userId,
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          const code = error.response?.data?.code;
          // F201: 해당 전화번호로 가입된 계정이 존재하지 않습니다.
          if (code === "F201") {
            setResult({ success: false });
          } else {
            setResult({ success: false });
          }
        } else {
          setResult({ success: false });
        }
      }
    };

    fetchUserId();
  }, [state.phone]);

  const handleClose = () => {
    navigate(ROUTES.ROOT);
  };

  const handleRetry = () => {
    navigate(ROUTES.AUTH.FIND_ACCOUNT);
  };

  const handleLogin = () => {
    navigate(ROUTES.AUTH.SIGNIN);
  };

  if (!result) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-gray-black items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  // 성공/실패에 따른 props 설정
  const getModalProps = () => {
    if (result.success) {
      // 아이디 찾기 성공
      return {
        title: `${FIND_ID_TEXTS.RESULT.FOUND.TITLE}\n${FIND_ID_TEXTS.RESULT.FOUND.SUFFIX}`,
        content: undefined,
        highlightText: result.userId,
        buttonLabel: FIND_ID_TEXTS.RESULT.FOUND.BUTTON,
        onButtonClick: handleLogin,
      };
    } else {
      // 아이디 찾기 실패
      return {
        title: FIND_ID_TEXTS.RESULT.NOT_FOUND.TITLE,
        content: FIND_ID_TEXTS.RESULT.NOT_FOUND.DESCRIPTION,
        highlightText: undefined,
        buttonLabel: FIND_ID_TEXTS.RESULT.NOT_FOUND.BUTTON,
        onButtonClick: handleRetry,
      };
    }
  };

  const modalProps = getModalProps();

  return (
    <FullScreenModal
      isOpen={true}
      onClose={handleClose}
      title={modalProps.title}
      content={modalProps.content}
      buttonLabel={modalProps.buttonLabel}
      highlightText={modalProps.highlightText}
      onButtonClick={modalProps.onButtonClick}
    />
  );
};

export default FindIdResultPage;
