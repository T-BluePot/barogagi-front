import { useLocation, useNavigate } from "react-router-dom";
import { BackHeader } from "@/components/common/headers/BackHeader";
import IdFindContent from "@/components/auth/find/IdFindContent";
import { safeBack } from "@/utils/safeBack";

const FindIdResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { phone?: string } | null) ?? {};

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader
        isDarkBg={true}
        onClick={() => safeBack(navigate, "/")}
        label={"아이디 찾기"}
      />
      <div className="flex flex-col w-full px-6 py-6">
        <IdFindContent initialPhone={state.phone} />
      </div>
    </div>
  );
};

export default FindIdResultPage;
