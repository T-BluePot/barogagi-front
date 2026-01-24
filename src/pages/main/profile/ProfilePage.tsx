import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMe } from "@/api/queries/authQueries";
import { ROUTES } from "@/constants/routes";
import ProfileInfoSection from "@/components/main/profile/ProfileInfoSection";
import ProfileMenuSection from "@/components/main/profile/ProfileMenuSection";
import ProfileMenuItem from "@/components/main/profile/ProfileMenuItem";
import CommonConfirmModal from "@/components/common/modal/common-modal/CommonConfirmModal";
import type { BaseResponse } from "@/api/types";
import type { UserData } from "@/types/profileTypes";

const ProfilePage = () => {
  const navigate = useNavigate();

  // 사용자 정보 조회
  const { data: userResponse } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  const userData = (userResponse as unknown as BaseResponse<UserData>)?.data;

  // 모달 상태
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);

  // 로그아웃 처리
  const handleLogout = async () => {
    // TODO: API 로그아웃 호출 (서버 쿠키 등 정리 필요 시)
    localStorage.removeItem("accessToken");
    navigate(ROUTES.AUTH.SIGNIN, { replace: true });
    setLogoutModalOpen(false);
  };

  // 회원 탈퇴 처리
  const handleWithdraw = async () => {
    // TODO: 회원 탈퇴 API 호출 구현
    localStorage.removeItem("accessToken");
    navigate(ROUTES.AUTH.SIGNIN, { replace: true });
    setWithdrawModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-black text-white overflow-y-auto pb-20">
      {/* 프로필 정보 섹션 */}
      <div className="mt-4">
        <ProfileInfoSection
          nickname={userData?.nickName || "알 수 없는 사용자"}
          userId={userData?.userId || ""}
        />
      </div>

      {/* 계정 관리 메뉴 섹션 */}
      <ProfileMenuSection title="계정 관리">
        <ProfileMenuItem
          label="로그아웃"
          onClick={() => setLogoutModalOpen(true)}
        />
        <ProfileMenuItem
          label="탈퇴하기"
          onClick={() => setWithdrawModalOpen(true)}
        />
      </ProfileMenuSection>

      {/* 로그아웃 확인 모달 */}
      <CommonConfirmModal
        isOpen={isLogoutModalOpen}
        modalContent={{
          title: "정말 로그아웃 하시겠습니까?",
          content: "",
        }}
        confirmButtonInfo={{
          label: "확인",
          onClick: handleLogout,
        }}
        cancelButtonInfo={{
          label: "취소",
          onClick: () => setLogoutModalOpen(false),
        }}
      />

      {/* 회원 탈퇴 확인 모달 */}
      <CommonConfirmModal
        isOpen={isWithdrawModalOpen}
        modalContent={{
          title: "정말 탈퇴하시겠습니까?",
          content: "탈퇴 시 모든 정보가 복구되지 않습니다.",
        }}
        confirmButtonInfo={{
          label: "탈퇴",
          onClick: handleWithdraw,
        }}
        cancelButtonInfo={{
          label: "취소",
          onClick: () => setWithdrawModalOpen(false),
        }}
      />
    </div>
  );
};

export default ProfilePage;
