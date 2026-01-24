import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMe } from "@/api/queries/authQueries";
import { ROUTES } from "@/constants/routes";
import { PROFILE_PAGE_TEXT } from "@/constants/texts/main/profile";
import ProfileInfoSection from "@/components/main/profile/ProfileInfoSection";
import ProfileMenuSection from "@/components/main/profile/ProfileMenuSection";
import ProfileMenuItem from "@/components/main/profile/ProfileMenuItem";
import { useConfirmModalStore } from "@/stores/confirmModalStore";
import type { BaseResponse } from "@/api/types";
import type { UserData } from "@/types/profileTypes";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { openConfirmModal } = useConfirmModalStore();

  // 사용자 정보 조회
  const { data: userResponse } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  const userData = (userResponse as unknown as BaseResponse<UserData>)?.data;

  // 로그아웃 처리
  const handleLogout = () => {
    // TODO: API 로그아웃 호출 (서버 쿠키 등 정리 필요 시)
    localStorage.removeItem("accessToken");
    navigate(ROUTES.AUTH.SIGNIN, { replace: true });
  };

  // 회원 탈퇴 처리
  const handleWithdraw = () => {
    // TODO: 회원 탈퇴 API 호출 구현
    localStorage.removeItem("accessToken");
    navigate(ROUTES.AUTH.SIGNIN, { replace: true });
  };

  // 로그아웃 모달 열기
  const handleOpenLogoutModal = () => {
    openConfirmModal(
      {
        title: PROFILE_PAGE_TEXT.LOGOUT_MODAL.TITLE,
        content: PROFILE_PAGE_TEXT.LOGOUT_MODAL.CONTENT,
        confirmLabel: PROFILE_PAGE_TEXT.LOGOUT_MODAL.CONFIRM_LABEL,
        cancelLabel: PROFILE_PAGE_TEXT.LOGOUT_MODAL.CANCEL_LABEL,
      },
      handleLogout
    );
  };

  // 탈퇴 모달 열기
  const handleOpenWithdrawModal = () => {
    openConfirmModal(
      {
        title: PROFILE_PAGE_TEXT.WITHDRAW_MODAL.TITLE,
        content: PROFILE_PAGE_TEXT.WITHDRAW_MODAL.CONTENT,
        confirmLabel: PROFILE_PAGE_TEXT.WITHDRAW_MODAL.CONFIRM_LABEL,
        cancelLabel: PROFILE_PAGE_TEXT.WITHDRAW_MODAL.CANCEL_LABEL,
      },
      handleWithdraw
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-black text-white overflow-y-auto pb-20">
      {/* 프로필 정보 섹션 */}
      <div className="mt-4">
        <ProfileInfoSection
          nickname={userData?.nickName || PROFILE_PAGE_TEXT.FALLBACK_NICKNAME}
          userId={userData?.userId || ""}
        />
      </div>

      {/* 계정 관리 메뉴 섹션 */}
      <ProfileMenuSection title={PROFILE_PAGE_TEXT.MENU_SECTION.TITLE}>
        <ProfileMenuItem
          label={PROFILE_PAGE_TEXT.MENU_SECTION.LOGOUT}
          onClick={handleOpenLogoutModal}
        />
        <ProfileMenuItem
          label={PROFILE_PAGE_TEXT.MENU_SECTION.WITHDRAW}
          onClick={handleOpenWithdrawModal}
        />
      </ProfileMenuSection>
    </div>
  );
};

export default ProfilePage;
