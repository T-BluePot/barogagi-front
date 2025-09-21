import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FIND_ID_TEXTS } from "@/constants/texts/auth/find/findAuth";
import { FullScreenModal } from "@/components/modal/FullScreenModal";

type FindIdResult = {
  success: boolean;
  userId?: string;
};

const FindIdResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { phone?: string } | null) ?? {};

  // 모의 API 결과 (실제로는 API 호출 결과를 사용)
  const [result, setResult] = useState<FindIdResult | null>(null);

  useEffect(() => {
    // TODO: 실제 API 호출
    // 현재는 모의 데이터로 처리
    const mockResult: FindIdResult = {
      success: false, // 디자인 확인용 - 실패 케이스로 변경
      userId: "barogagi1234",
    };

    console.log("FindIdResultPage - mockResult:", mockResult);
    console.log("FindIdResultPage - phone state:", state.phone);

    setResult(mockResult);
  }, [state.phone]);

  const handleClose = () => {
    navigate("/");
  };

  const handleRetry = () => {
    navigate("/find");
  };

  const handleLogin = () => {
    navigate("/login");
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

  console.log("FindIdResultPage - modalProps:", modalProps);
  console.log("FindIdResultPage - result:", result);

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
