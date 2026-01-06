import { useNavigate } from "react-router-dom";

const DevNav = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex flex-row w-full gap-6 flex-wrap">
      <button onClick={() => navigate("/auth/signup")}>TermsPage</button>
      <button onClick={() => navigate("/auth")}>AuthLandingPage</button>
      <button onClick={() => navigate("/auth/login")}>EmailLoginPage</button>
      <button onClick={() => navigate("/plan/date")}>SelectDatePage</button>
      {/* 필요한 라우트 버튼을 추가하세요 */}
    </nav>
  );
};

export default DevNav;
