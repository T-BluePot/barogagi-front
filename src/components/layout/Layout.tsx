import type { ReactNode } from "react";
import { BackHeader } from "@/components/common/headers/BackHeader";
import { TitleHeader } from "@/components/common/headers/TitleHeader";
import { CloseHeader } from "@/components/common/headers/CloseHeader";
import { CommonHeader } from "@/components/common/headers/CommonHeader";
import { useHeaderConfig } from "@/hooks/useHeaderConfig";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const headerConfig = useHeaderConfig();
  const navigate = useNavigate();
  const { goBack, goToHome, goToProfile } = useAppNavigation();

  // 뒤로가기 핸들러
  const handleBack = () => {
    // backPath가 설정되어 있으면 해당 경로로 이동
    if (headerConfig.backPath) {
      navigate(headerConfig.backPath);
      return;
    }

    // 기본 뒤로가기 동작
    if (window.history.length > 1) {
      goBack();
    } else {
      goToHome();
    }
  };

  // 닫기 핸들러 (모달이나 특별한 경우)
  const handleClose = () => {
    goToHome();
  };

  // 헤더 렌더링
  const renderHeader = () => {
    switch (headerConfig.type) {
      case "none":
        return null;

      case "back":
        return (
          <BackHeader
            label={headerConfig.label}
            onClick={handleBack}
            isDarkBg={headerConfig.isDarkBg}
          />
        );

      case "title":
        return (
          <TitleHeader
            label={headerConfig.label || ""}
            isDarkBg={headerConfig.isDarkBg}
          />
        );

      case "close":
        return (
          <CloseHeader
            label={headerConfig.label}
            onClick={handleClose}
            isDarkBg={headerConfig.isDarkBg}
          />
        );

      case "common":
        return <CommonHeader onClick={goToProfile} />;

      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        headerConfig.isDarkBg ? "bg-gray-black" : "bg-white"
      }`}
    >
      {renderHeader()}
      <main className="flex-1">{children}</main>
    </div>
  );
};
