import { useNavigate } from "react-router-dom";

const DevNav = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex flex-row w-full gap-6">
      <button onClick={() => navigate("/signup")}>TermsPage</button>
      <button onClick={() => navigate("/login")}>AuthLandingPage</button>
      <button onClick={() => navigate("/login/email")}>EmailLoginPage</button>
      {/* 필요한 라우트 버튼을 추가하세요 */}
    </nav>
  );
};

export default DevNav;
