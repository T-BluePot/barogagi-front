import { useNavigate } from "react-router-dom";
import TextButton from "@/components/common/buttons/TextButton";
import { ROUTES } from "@/constants/routes";

export const EmailLoginButton = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center pt-3">
      <TextButton
        label="이메일로 로그인하기"
        variant="main-underline"
        onClick={() => navigate(ROUTES.AUTH.SIGNIN)}
      />
    </div>
  );
};
