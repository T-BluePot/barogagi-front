import { useNavigate } from "react-router-dom";
import TextButton from "@/components/common/buttons/TextButton";
import { ROUTES } from "@/constants/routes";

export const LoginButton = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center pt-3">
      <TextButton
        label="아이디로 로그인하기"
        variant="main-underline"
        onClick={() => navigate(ROUTES.AUTH.SIGNIN)}
      />
    </div>
  );
};
