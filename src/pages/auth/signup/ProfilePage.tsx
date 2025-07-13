import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ValidationError } from "yup";

import { useBlockBackNavigation } from "@/utils/useBlockBackNavigation";
import { nicknameSchema } from "@/utils/authSchema";
import type { GenderType } from "@/types/auth/gender";
import { getGenderLabel } from "@/types/auth/gender";
import { PROFILE_TEXT } from "@/constants/texts/auth/signup/profile";

import { SelectGenderBottomModal } from "@/components/auth/signup/SelectGenderBottomModal";
import { SelectBirthBottomModal } from "@/components/auth/signup/SelectBirthBottomModal";
import CommonConfirmModal from "@/components/modal/CommonConfirmModal";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { PageTitleWithSub } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import { SelectTriggerButton } from "@/components/auth/common/SelectTriggerButton";
import { CheckBoxButton } from "@/components/auth/common/CheckBoxButton";
import Button from "@/components/common/buttons/CommonButton";

const ProfilePage = () => {
  const navigate = useNavigate();

  useBlockBackNavigation(() => {
    navigate("/signup/verify", { replace: true }); // 뒤로가면 로그인 페이지로 강제 이동

    // 약간의 시간 뒤 현재 페이지 다시 push (앞으로가기 방지용)
    setTimeout(() => {
      history.pushState(null, "", window.location.href);
    }, 100);
  });

  const [nickname, setNickname] = useState<string>("");
  const [error, setError] = useState("");

  const handleValidate = async () => {
    setError("");
    try {
      await nicknameSchema.validate(nickname);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    handleValidate();
  }, [nickname]);

  const [gender, setGender] = useState<GenderType | null>(null);
  const [openGenderModal, setOpenGenderModal] = useState<boolean>(false);
  const handleCloseGenderModal = () => setOpenGenderModal(false);

  const [userBirthYear, setUserBirthYear] = useState("");
  const [userBirthMonth, setUserBirthMonth] = useState("");
  const [userBirthDay, setUserBirthDay] = useState("");

  const [openBirthModal, setOpenBirthModal] = useState<boolean>(false);
  const handleCloseBirthModal = () => setOpenBirthModal(false);

  // BirthdayPicker에서 전달받은 값을 상태에 반영
  const handleChange = (value: {
    userBirthYear: string;
    userBirthMonth: string;
    userBirthDay: string;
  }) => {
    setUserBirthYear(value.userBirthYear);
    setUserBirthMonth(value.userBirthMonth);
    setUserBirthDay(value.userBirthDay);
  };

  const formattedBirth =
    userBirthYear && userBirthMonth && userBirthDay
      ? `${userBirthYear}년 ${userBirthMonth}월 ${userBirthDay}일`
      : undefined;

  const [skipProfile, setSkipProfile] = useState<boolean>(false);
  const [openSkipModal, setOpenSkipModal] = useState<boolean>(false);

  const closeSkipModal = () => setOpenSkipModal(false);

  const isInvalid = (): boolean => {
    return (
      !nickname.trim() || // 닉네임이 비어있거나
      !!error || // 유효성 검사 에러가 존재하거나
      gender === null || // 성별 미선택
      !userBirthYear.trim() || // 생년이 비어있거나
      !userBirthMonth.trim() || // 생월이 비어있거나
      !userBirthDay.trim() || // 생일이 비어있거나
      formattedBirth === undefined // 생년월일 포맷이 없으면
    );
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <SelectGenderBottomModal
        isOpen={openGenderModal}
        onClose={handleCloseGenderModal}
        selectedGender={gender}
        onSelectGender={setGender}
      />
      <SelectBirthBottomModal
        isOpen={openBirthModal}
        onClose={handleCloseBirthModal}
        userBirthYear={userBirthYear}
        userBirthMonth={userBirthMonth}
        userBirthDay={userBirthDay}
        onChange={handleChange}
      />
      <CommonConfirmModal
        isOpen={openSkipModal}
        cancelButtonInfo={{
          label: PROFILE_TEXT.SKIP_MODAL.CANCEL_LABEL,
          onClick: closeSkipModal,
        }}
        confirmButtonInfo={{
          label: PROFILE_TEXT.SKIP_MODAL.CONFIRM_LABEL,
          onClick: () => {
            setSkipProfile(true);
            navigate("/signup/complete");
          },
        }}
        modalContent={{
          title: PROFILE_TEXT.SKIP_MODAL.TITLE,
          content: PROFILE_TEXT.SKIP_MODAL.SUB_TITLE,
        }}
      />
      <BackHeader isDarkBg={true} onClick={() => navigate("/signup/verify")} />
      <div className="flex flex-col w-full px-6">
        <PageTitleWithSub
          title={PROFILE_TEXT.TITLE}
          subTitle={PROFILE_TEXT.SUB_TITLE}
        />
        <div className="flex flex-col w-full gap-4">
          <CommonInput
            label={PROFILE_TEXT.NICKNAME.LABEL}
            placeholder={PROFILE_TEXT.NICKNAME.PLACEHOLDER}
            value={nickname}
            setValue={setNickname}
            withButton={true}
            error={!!nickname.length && !!error.length}
            helperText={nickname.length ? error : undefined}
            onClickButton={() => {
              // 닉네임 중복 확인 로직
            }}
          />
          <SelectTriggerButton
            label={PROFILE_TEXT.SELECT.GENDER_LABEL}
            onClick={() => setOpenGenderModal(true)}
            value={getGenderLabel(gender)}
          />
          <SelectTriggerButton
            label={PROFILE_TEXT.SELECT.BIRTH_LABEL}
            onClick={() => setOpenBirthModal(true)}
            value={formattedBirth}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full mt-auto  gap-4 p-6">
        <CheckBoxButton
          label={PROFILE_TEXT.CHECK_LABEL}
          labelColor="gray"
          gap="tight"
          isChecked={skipProfile}
          onCheckedChange={() => {
            setOpenSkipModal(true);
          }}
        />
        <Button
          label={PROFILE_TEXT.NEXT_BUTTON}
          isDisabled={isInvalid()}
          onClick={() => navigate("/signup/complete")}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
