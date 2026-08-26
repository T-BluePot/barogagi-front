import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { withdrawMe } from "@/api/queries/authQueries";
import { useMeQuery } from "@/hooks/queries/useMeQuery";
import { ROUTES } from "@/constants/routes";
import { PROFILE_PAGE_TEXT } from "@/constants/texts/main/profile";
import { WITHDRAWAL_MODAL_TEXT } from "@/constants/texts/main/profile/withdrawal";
import ProfileInfoSection from "@/components/main/profile/ProfileInfoSection";
import ProfileMenuSection from "@/components/main/profile/ProfileMenuSection";
import ProfileMenuItem from "@/components/main/profile/ProfileMenuItem";
import WithdrawalModal from "@/components/main/profile/WithdrawalModal";
import { useConfirmModalStore } from "@/stores/confirmModalStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { clearAuthTokens } from "@/lib/auth/tokenCache";
import { handleUserLogout } from "@/utils/auth/handleUserLogout";
import { deleteAllFcmTokens, syncFcmToken } from "@/utils/fcm";
import { useFcmStore } from "@/stores/fcmStore";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { openConfirmModal } = useConfirmModalStore();
  const { openAlertModal } = useAlertModalStore();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  // 사용자 정보 조회
  const { user: userData } = useMeQuery();

  // 로그아웃 처리
  // 서버 정리(FCM 토큰 삭제 → 로그아웃 API)까지 handleUserLogout 이 담당하고,
  // 마지막에 하드 리다이렉트까지 수행하므로 여기서 navigate 하지 않는다.
  const handleLogout = () => {
    void handleUserLogout();
  };

  /**
   * 탈퇴가 실패했을 때, 미리 지워둔 FCM 등록을 되돌린다.
   *
   * 삭제를 탈퇴보다 먼저 할 수밖에 없어(아래 주석 참고) 탈퇴가 실패하면
   * 계정은 살아 있는데 푸시 등록만 사라진 상태가 된다. 그대로 두면 다음 로그인까지
   * 알림이 끊기므로 즉시 재등록한다.
   *
   * ⚠️ `reset()` 을 먼저 해야 한다. store 에 등록 기록이 남아 있으면
   *    `syncFcmToken()` 이 "이미 등록됨"으로 보고 서버 등록을 skip 한다.
   */
  const restorePushAfterFailedWithdraw = () => {
    useFcmStore.getState().reset();
    void syncFcmToken();
  };

  // 회원 탈퇴 처리
  const handleWithdraw = async (reasonNo: number, withdrawReason?: string) => {
    try {
      // ⚠️ FCM 삭제가 탈퇴보다 **먼저**여야 한다.
      //    탈퇴 후에는 계정 자체가 사라져 삭제 API 를 부를 인증이 없다.
      //    파라미터 없이 호출 = 회원의 **모든 기기** 토큰 삭제 — 계정이 없어지므로
      //    다른 기기에 등록이 남으면 안 된다.
      await deleteAllFcmTokens();

      const response = await withdrawMe({ reasonNo, withdrawReason });

      if (response.code === "D200") {
        useFcmStore.getState().reset();
        void clearAuthTokens();

        setIsWithdrawalModalOpen(false);
        openAlertModal({ title: WITHDRAWAL_MODAL_TEXT.SUCCESS_MESSAGE });
        navigate(ROUTES.AUTH.SIGNIN, { replace: true });
        return;
      }

      restorePushAfterFailedWithdraw();
      openAlertModal({ title: WITHDRAWAL_MODAL_TEXT.FAIL_MESSAGE });
    } catch {
      restorePushAfterFailedWithdraw();
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
    <div className="pb-tabbar flex flex-col w-full h-full bg-white text-gray-black overflow-y-auto">
      {/* 프로필 정보 섹션 */}
      <div className="mt-4">
        <ProfileInfoSection
          nickname={userData?.nickName || PROFILE_PAGE_TEXT.FALLBACK_NICKNAME}
          userId={userData?.userId || ""}
        />
      </div>

      {/* 설정 메뉴 섹션 */}
      <ProfileMenuSection title={PROFILE_PAGE_TEXT.SETTINGS_SECTION.TITLE}>
        <ProfileMenuItem
          label={PROFILE_PAGE_TEXT.SETTINGS_SECTION.NOTIFICATION}
          onClick={() => navigate(ROUTES.MAIN.SETTINGS)}
        />
      </ProfileMenuSection>

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
