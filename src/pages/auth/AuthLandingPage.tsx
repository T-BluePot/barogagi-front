import LoginButtonSection from "@/components/auth/landing/LoginButtonSection";
import FitplLogo from "@/assets/icons/fitpl.svg";
import "@/components/auth/landing/LogoAnimations.css";

const AuthLandingPage = () => {
  // 소셜 로그인 버튼 클릭 핸들러

  return (
    <div className="h-full bg-gray-black flex flex-col items-center justify-between px-6 py-8">
      {/* 로고 및 제목 영역 */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* 상단 라인 - 왼쪽에서 오른쪽으로 */}
        <div className="w-full h-1 mb-6 relative overflow-hidden">
          <div className="w-1/2 h-full bg-main animate-slide-left-to-right"></div>
        </div>

        <div className="flex flex-col justify-center gap-1">
          {/* 메인 로고 */}
          <img src={FitplLogo} alt="Fitpl Logo" />
          {/* 서브 타이틀 */}
          <p className="text-gray-30 typo-subtitle tracking-tight pt-1">
            내 일정에 딱! fit 한 선택
          </p>
        </div>

        {/* 하단 라인 - 오른쪽에서 왼쪽으로 */}
        <div className="w-full h-1 mt-6 relative overflow-hidden">
          <div className="w-1/2 h-full bg-main animate-slide-right-to-left"></div>
        </div>
      </div>

      {/* 소셜 로그인 버튼들 */}
      {/* 하단 링크 */}
      <LoginButtonSection />
    </div>
  );
};

export default AuthLandingPage;
