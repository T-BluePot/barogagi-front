import { useNavigate } from "react-router-dom";

import { useBlockBackNavigation } from "@/utils/useBlockBackNavigation";
import { COMPLETE_TEXT } from "@/constants/texts/auth/signup/complete";

import Button from "@/components/common/buttons/CommonButton";

const SignupCompletePage = () => {
  const navigate = useNavigate();

  useBlockBackNavigation(() => {
    navigate("/login", { replace: true }); // 뒤로가면 로그인 페이지로 강제 이동

    // 약간의 시간 뒤 현재 페이지 다시 push (앞으로가기 방지용)
    setTimeout(() => {
      history.pushState(null, "", window.location.href);
    }, 100);
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <div className="flex flex-col flex-1 justify-center items-center gap-4">
        <span className="typo-title-01 text-white whitespace-pre-line">
          {COMPLETE_TEXT.TITLE}
        </span>
        <span className="typo-body text-gray-20 whitespace-pre-line">
          {COMPLETE_TEXT.SUB_TITLE}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center w-full mt-auto  gap-4 p-6">
        <Button
          label={COMPLETE_TEXT.BUTTON}
          onClick={() => navigate("/login")}
        />
      </div>
    </div>
  );
};

export default SignupCompletePage;
