import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMe, withdrawMe } from "@/api/queries/authQueries";
import { authKeys } from "@/api/keyFactories";
import { ROUTES } from "@/constants/routes";
import { PROFILE_PAGE_TEXT } from "@/constants/texts/main/profile";
import { WITHDRAWAL_MODAL_TEXT } from "@/constants/texts/main/profile/withdrawal";
import ProfileInfoSection from "@/components/main/profile/ProfileInfoSection";
import ProfileMenuSection from "@/components/main/profile/ProfileMenuSection";
import ProfileMenuItem from "@/components/main/profile/ProfileMenuItem";
import WithdrawalModal from "@/components/main/profile/WithdrawalModal";
import { useConfirmModalStore } from "@/stores/confirmModalStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import type { BaseResponse } from "@/api/types";
import type { UserData } from "@/types/profileTypes";
import { clearAuthTokens } from "@/lib/auth/tokenCache";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { openConfirmModal } = useConfirmModalStore();
  const { openAlertModal } = useAlertModalStore();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  // 사용자 정보 조회
  const { data: userResponse } = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
  });

  const userData = (userResponse as unknown as BaseResponse<UserData>)?.data;

  // 로그아웃 처리
  const handleLogout = () => {
    // TODO: API 로그아웃 호출 (서버 쿠키 등 정리 필요 시)
    void clearAuthTokens();
    navigate(ROUTES.AUTH.SIGNIN, { replace: true });
  };

  // 회원 탈퇴 처리
  const handleWithdraw = async (reasonNo: number, withdrawReason?: string) => {
    try {
      const response = await withdrawMe({ reasonNo, withdrawReason });

      if (response.code === "D200") {
        void clearAuthTokens();

        setIsWithdrawalModalOpen(false);
        openAlertModal({ title: WITHDRAWAL_MODAL_TEXT.SUCCESS_MESSAGE });
        navigate(ROUTES.AUTH.SIGNIN, { replace: true });
      } else {
        openAlertModal({ title: WITHDRAWAL_MODAL_TEXT.FAIL_MESSAGE });
      }
    } catch {
      openAlertModal({ title: WITHDRAWAL_MODAL_TEXT.FAIL_MESSAGE });
    }
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
          onClick={() => setIsWithdrawalModalOpen(true)}
        />
      </ProfileMenuSection>

      {/* 회원 탈퇴 모달 */}
      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        onConfirm={handleWithdraw}
      />
    </div>
  );
};

export default ProfilePage;
