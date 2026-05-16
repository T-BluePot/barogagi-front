import { type ReactNode, useState } from "react";

// === Header Component===
import { BackHeader } from "@/components/common/headers/BackHeader";
import { TitleHeader } from "@/components/common/headers/TitleHeader";
import { CloseHeader } from "@/components/common/headers/CloseHeader";
import { CommonHeader } from "@/components/common/headers/CommonHeader";

// === Modal ===
import CommonConfirmModal from "../common/modal/common-modal/CommonConfirmModal";

// === others ===
import { useHeaderConfig } from "@/hooks/useHeaderConfig";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const headerConfig = useHeaderConfig();
  const navigate = useNavigate();
  const { goBack, goToLanding, goToProfile } = useAppNavigation();
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false); // 뒤로가기 로직 전용 모달창
  const [showCloseConfirmModal, setShowCloseConfirmModal] = useState(false); // 창 닫기 로직 전용 모달창

  const executeBack = () => {
    // backPath가 설정되어 있으면 해당 경로로 이동
    if (headerConfig.type === "back" && headerConfig.backPath) {
      navigate(headerConfig.backPath);
      return;
    }

    if (headerConfig.type === "close" && headerConfig.closePath) {
      navigate(headerConfig.closePath);
      return;
    }

    // 기본 뒤로가기 동작
    if (window.history.length > 1) {
      goBack();
    } else {
      goToLanding();
    }
  };

  // 뒤로가기 핸들러
  const handleBack = () => {
    // showBackConfirm이 true면 모달 먼저 띄우기
    if (headerConfig.type === "back" && headerConfig.showBackConfirm) {
      setShowBackConfirmModal(true);
      return;
    }

    // 확인 모달 없이 바로 실행
    executeBack();
  };

  // 모달 확인 버튼 핸들러
  const handleConfirmBack = () => {
    setShowBackConfirmModal(false);
    executeBack();
  };

  // 닫기 핸들러 (모달이나 특별한 경우)
  const handleClose = () => {
    if (headerConfig.type === "close" && headerConfig.showCloseConfirm) {
      setShowCloseConfirmModal(true);
      return;
    }
    executeBack();
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
            isHeaderDark={headerConfig.isHeaderDark}
          />
        );

      case "title":
        return (
          <TitleHeader
            label={headerConfig.label || ""}
            isHeaderDark={headerConfig.isHeaderDark}
          />
        );

      case "close":
        return (
          <CloseHeader
            label={headerConfig.label}
            onClick={handleClose}
            isHeaderDark={headerConfig.isHeaderDark}
          />
        );

      case "common":
        return <CommonHeader onClick={goToProfile} />;

      default:
        return null;
    }
  };

  // 헤더/콘텐츠 배경색 결정
  const isHeaderDark =
    headerConfig && "isHeaderDark" in headerConfig && headerConfig.isHeaderDark;
  const isContentDark =
    headerConfig && "isContentDark" in headerConfig
      ? headerConfig.isContentDark
      : isHeaderDark; // isContentDark 미지정 시 isHeaderDark 따라감

  return (
    <div
      className={`h-screen flex flex-col pt-safe pb-safe ${
        isHeaderDark ? "bg-gray-black" : "bg-white"
      }`}
    >
      {renderHeader()}
      <main
        className={`flex-1 min-h-0 overflow-auto ${
          isContentDark === false && isHeaderDark
            ? "bg-white rounded-t-2xl"
            : ""
        }`}
      >
        {children}
      </main>
      {/* 뒤로가기 확인 모달 */}
      {showBackConfirmModal && (
        <CommonConfirmModal
          isOpen={showBackConfirmModal}
          modalContent={{
            title: "페이지를 나가시겠습니까?",
            content:
              headerConfig.type === "back" && headerConfig.confirmMessage
                ? headerConfig.confirmMessage
                : "지금 나가면 작성한 정보가 모두 사라집니다.\n계속하시겠습니까?",
          }}
          confirmButtonInfo={{
            label: "확인",
            onClick: handleConfirmBack,
          }}
          cancelButtonInfo={{
            label: "취소",
            onClick: () => setShowBackConfirmModal(false),
          }}
        />
      )}
      {/* 창 닫기 확인 모달 */}
      {showCloseConfirmModal && (
        <CommonConfirmModal
          isOpen={showCloseConfirmModal}
          modalContent={{
            title: "일정 생성을 취소하시겠습니까?",
            content:
              headerConfig.type === "close" && headerConfig.confirmMessage
                ? headerConfig.confirmMessage
                : "지금 나가면 생성된 일정이 모두 사라집니다.",
          }}
          confirmButtonInfo={{
            label: "확인",
            onClick: () => {
              setShowCloseConfirmModal(false);
              executeBack();
            },
          }}
          cancelButtonInfo={{
            label: "취소",
            onClick: () => setShowCloseConfirmModal(false),
          }}
        />
      )}
    </div>
  );
};
