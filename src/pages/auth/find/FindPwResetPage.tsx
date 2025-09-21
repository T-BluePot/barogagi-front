import { useLocation, useNavigate } from "react-router-dom";
import { BackHeader } from "@/components/common/headers/BackHeader";
import { safeBack } from "@/utils/safeBack";

const FindPwResetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader
        isDarkBg={true}
        onClick={() => safeBack(navigate, "/")}
        label={"비밀번호 재설정"}
      />
      <div className="flex flex-col w-full px-6 py-6"></div>
    </div>
  );
};

export default FindPwResetPage;
