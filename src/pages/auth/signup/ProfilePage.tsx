import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationError } from "yup";

import ProfileLayout from "@/components/auth/signup/ProfileLayout";

import { PROFILE_TEXT } from "@/constants/texts/auth/signup/profile";
import type { GenderType } from "@/types/auth/gender";

import { useBlockBackNavigation } from "@/utils/useBlockBackNavigation";
import { nicknameSchema } from "@/utils/authSchema";
import { getGenderLabel } from "@/types/auth/gender";
import { ROUTES } from "@/constants/routes";

const ProfilePage = () => {
  const navigate = useNavigate();

  useBlockBackNavigation(() => {
    navigate(ROUTES.AUTH.SIGNUP.VERIFY, { replace: true }); // 뒤로가면 인증 페이지로 강제 이동

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

  // 성별 선택 모달
  const [gender, setGender] = useState<GenderType | null>(null);
  const [isGenderModalOpen, setIsGenderModalOpen] = useState<boolean>(false);
  const handleOpenGenderModal = () => setIsGenderModalOpen(true);
  const handleCloseGenderModal = () => setIsGenderModalOpen(false);

  // 생년월일 선택 모달
  const [userBirthYear, setUserBirthYear] = useState("");
  const [userBirthMonth, setUserBirthMonth] = useState("");
  const [userBirthDay, setUserBirthDay] = useState("");

  const [isBirthModalOpen, setIsBirthModalOpen] = useState<boolean>(false);

  const handleOpenBirthModal = () => setIsBirthModalOpen(true);
  const handleCloseBirthModal = () => setIsBirthModalOpen(false);

  // BirthdayPicker에서 전달받은 값을 상태에 반영
  const handleChangeBirth = (value: {
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

  // 프로필 설정 스킵 모달
  const [isSkipProfile, setIsSkipProfile] = useState(false);

  const [isSkipModalOpen, setIsSkipModalOpen] = useState<boolean>(false);
  const handleOpenSkipModal = () => setIsSkipModalOpen(true);
  const handleCloseSkipModal = () => setIsSkipModalOpen(false);
  const handleSkipProfile = () => {
    handleCloseSkipModal(); // 모달 닫기
    navigate(ROUTES.AUTH.SIGNUP.COMPLETE); // 화면 이동
  };

  useEffect(() => {
    if (isSkipModalOpen) {
      setIsSkipProfile(true);
    } else {
      setIsSkipProfile(false);
    }
  }, [isSkipModalOpen]);

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
    <ProfileLayout
      genderProps={{
        isGenderModalOpen: isGenderModalOpen,
        handleCloseGenderModal: handleCloseGenderModal,
        gender: gender,
        setGender: setGender,
      }}
      birthProps={{
        isBirthModalOpen: isBirthModalOpen,
        handleCloseBirthModal: handleCloseBirthModal,
        userBirthYear: userBirthYear,
        userBirthMonth: userBirthMonth,
        userBirthDay: userBirthDay,
        handleChangeBirth: handleChangeBirth,
      }}
      skipProfileProps={{
        isSkipModalOpen: isSkipModalOpen,
        handleOpenSkipModal: handleOpenSkipModal,
        handleCloseSkipModal: handleCloseSkipModal,
        handleSkipProfile: handleSkipProfile,
      }}
      pageTitle={{
        title: PROFILE_TEXT.TITLE,
        subTitle: PROFILE_TEXT.SUB_TITLE,
      }}
      handleGoBack={() => navigate(ROUTES.AUTH.SIGNUP.VERIFY)}
      handleOpenGenderModal={handleOpenGenderModal}
      handleOpenBirthModal={handleOpenBirthModal}
      nickname={nickname}
      setNickname={setNickname}
      isNicknameError={!!nickname.length && !!error.length}
      nicknameHelperText={nickname.length ? error : undefined}
      checkNicknameDuplicate={() => {
        // 닉네임 중복 여부 확인
      }}
      genderValue={getGenderLabel(gender)}
      birthValue={formattedBirth}
      isSkipProfile={isSkipProfile}
      isDisabled={isInvalid()}
      handleSubmitProfile={() => navigate(ROUTES.AUTH.SIGNUP.COMPLETE)}
    />
  );
};

export default ProfilePage;
