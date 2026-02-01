import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getMe, updateMe } from "@/api/queries/authQueries";
import { authKeys } from "@/api/keyFactories";
import { ROUTES } from "@/constants/routes";
import { PROFILE_EDIT_TEXT } from "@/constants/texts/main/profile";
import type { BaseResponse } from "@/api/types";
import { getGenderLabel, type GenderType } from "@/constants/userInfo";

import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import { SelectTriggerButton } from "@/components/auth/common/SelectTriggerButton";
import { SelectGenderBottomModal } from "@/components/auth/signup/SelectGenderBottomModal";
import { SelectBirthBottomModal } from "@/components/auth/signup/SelectBirthBottomModal";
import Button from "@/components/common/buttons/CommonButton";
import { useAlertModalStore } from "@/stores/alertModalStore";

// TODO: 공통 타입으로 분리 (현재 ProfilePage에서도 사용)
interface UserDataResponse {
  userId: string;
  nickName: string;
  gender?: string;
  birth?: string; // "YYYYMMDD" 형식
}

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openAlertModal } = useAlertModalStore();

  // 사용자 정보 조회
  const { data: userResponse, isLoading } = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
  });

  const userData = (userResponse as unknown as BaseResponse<UserDataResponse>)
    ?.data;

  // 프로필 수정 mutation
  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
      navigate(ROUTES.MAIN.PROFILE, { replace: true });
    },
    onError: () => {
      openAlertModal({
        title: PROFILE_EDIT_TEXT.ERROR_MODAL.TITLE,
        content: PROFILE_EDIT_TEXT.ERROR_MODAL.CONTENT,
        buttonLabel: PROFILE_EDIT_TEXT.ERROR_MODAL.BUTTON_LABEL,
      });
    },
  });

  // Form State
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<GenderType | null>(null);
  const [userBirthYear, setUserBirthYear] = useState("");
  const [userBirthMonth, setUserBirthMonth] = useState("");
  const [userBirthDay, setUserBirthDay] = useState("");

  // Modal State
  const [isGenderModalOpen, setGenderModalOpen] = useState(false);
  const [isBirthModalOpen, setBirthModalOpen] = useState(false);

  // 초기 데이터 세팅
  useEffect(() => {
    if (userData) {
      setNickname(userData.nickName || "");
      setGender((userData.gender as GenderType) || null);

      // 생년월일 파싱: "YYYYMMDD" 형식
      if (userData.birth && userData.birth.length === 8) {
        setUserBirthYear(userData.birth.slice(0, 4));
        setUserBirthMonth(userData.birth.slice(4, 6));
        setUserBirthDay(userData.birth.slice(6, 8));
      }
    }
  }, [userData]);

  // 성별 모달 핸들러
  const handleOpenGenderModal = () => setGenderModalOpen(true);
  const handleCloseGenderModal = () => setGenderModalOpen(false);

  // 생년월일 모달 핸들러
  const handleOpenBirthModal = () => setBirthModalOpen(true);
  const handleCloseBirthModal = () => setBirthModalOpen(false);

  // 생년월일 변경 핸들러
  const handleChangeBirth = (value: {
    userBirthYear: string;
    userBirthMonth: string;
    userBirthDay: string;
  }) => {
    setUserBirthYear(value.userBirthYear);
    setUserBirthMonth(value.userBirthMonth);
    setUserBirthDay(value.userBirthDay);
  };

  // 생년월일 표시 문자열
  const birthDisplayValue =
    userBirthYear && userBirthMonth && userBirthDay
      ? `${userBirthYear}년 ${userBirthMonth}월 ${userBirthDay}일`
      : undefined;

  // 성별 표시 문자열
  const genderDisplayValue = getGenderLabel(gender);

  // 완료 버튼 비활성화 조건: 닉네임이 비어있을 때
  const isDisabled = !nickname.trim();

  // 프로필 수정 제출
  const handleSubmitProfile = () => {
    const birth =
      userBirthYear && userBirthMonth && userBirthDay
        ? `${userBirthYear}${userBirthMonth}${userBirthDay}`
        : undefined;

    updateMutation.mutate({
      nickName: nickname.trim(),
      gender: gender ?? undefined,
      birth,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full bg-gray-black text-white items-center justify-center">
        <span className="typo-body text-gray-50">
          {PROFILE_EDIT_TEXT.LOADING}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-gray-black text-white">
      {/* 성별 선택 모달 */}
      <SelectGenderBottomModal
        isGenderModalOpen={isGenderModalOpen}
        handleCloseGenderModal={handleCloseGenderModal}
        gender={gender}
        setGender={setGender}
      />

      {/* 생년월일 선택 모달 */}
      <SelectBirthBottomModal
        isBirthModalOpen={isBirthModalOpen}
        handleCloseBirthModal={handleCloseBirthModal}
        userBirthYear={userBirthYear}
        userBirthMonth={userBirthMonth}
        userBirthDay={userBirthDay}
        handleChangeBirth={handleChangeBirth}
      />

      {/* 화면 레이아웃 */}
      <div className="flex flex-col w-full px-6 flex-1">
        <PageTitle type="auth" title={PROFILE_EDIT_TEXT.TITLE} />

        <div className="flex flex-col w-full gap-4">
          <CommonInput
            label={PROFILE_EDIT_TEXT.NICKNAME.LABEL}
            placeholder={PROFILE_EDIT_TEXT.NICKNAME.PLACEHOLDER}
            value={nickname}
            setValue={setNickname}
          />
          <SelectTriggerButton
            label={PROFILE_EDIT_TEXT.SELECT.GENDER_LABEL}
            onClick={handleOpenGenderModal}
            value={genderDisplayValue}
          />
          <SelectTriggerButton
            label={PROFILE_EDIT_TEXT.SELECT.BIRTH_LABEL}
            onClick={handleOpenBirthModal}
            value={birthDisplayValue}
          />
        </div>
      </div>

      {/* 완료 버튼 */}
      <div className="p-6">
        <Button
          label={PROFILE_EDIT_TEXT.SUBMIT_BUTTON}
          isDisabled={isDisabled || updateMutation.isPending}
          onClick={handleSubmitProfile}
        />
      </div>
    </div>
  );
};

export default ProfileEditPage;
