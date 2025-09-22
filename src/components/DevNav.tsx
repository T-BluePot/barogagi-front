import { useNavigate } from "react-router-dom";

const DevNav = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex flex-row w-full gap-6 flex-wrap">
      <button onClick={() => navigate("/signup")}>TermsPage</button>
      <button onClick={() => navigate("/")}>AuthLandingPage</button>
      <button onClick={() => navigate("/login")}>EmailLoginPage</button>
      <button onClick={() => navigate("/plan/date")}>SelectDatePage</button>
      {/* 필요한 라우트 버튼을 추가하세요 */}
    </nav>
  );
};

export default DevNav;
