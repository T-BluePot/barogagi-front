import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

// === navigate ===
import { useBlockBackNavigation } from "@/utils/useBlockBackNavigation";
import { ROUTES } from "@/constants/routes";

// === Schema ===
import { ValidationError } from "yup";
import { nicknameSchema } from "@/utils/authSchema";

// === component ===
import ProfileLayout from "@/components/auth/signup/ProfileLayout";
import { PROFILE_TEXT } from "@/constants/texts/auth/signup/profile";
import { getGenderLabel, type GenderType } from "@/constants/userInfo";
import CheckResultModal from "@/components/auth/signup/CheckResultModal";

// === server ===
import { useMutation } from "@tanstack/react-query";
import { checkNickname } from "@/api/queries";
import type { NicknameCheckStatus } from "@/types/signupTypes";

const ProfilePage = () => {
  const navigate = useNavigate();

  useBlockBackNavigation(() => {
    navigate(ROUTES.AUTH.SIGNUP.VERIFY, { replace: true }); // 뒤로가면 인증 페이지로 강제 이동

    // 약간의 시간 뒤 현재 페이지 다시 push (앞으로가기 방지용)
    setTimeout(() => {
      history.pushState(null, "", window.location.href);
    }, 100);
  });

  // === 닉네임 영역 ====
  const [nickname, setNickname] = useState<string>("");
  const [error, setError] = useState("");

  // 중복확인 상태
  const [checkStatus, setCheckStatus] = useState<NicknameCheckStatus>("idle");
  const [checkMessage, setCheckMessage] = useState("");

  // 마지막으로 확인한 닉네임(정합성용)
  const [lastCheckedNickname, setLastCheckedNickname] = useState("");

  const [isNickNameCheckModalOpen, setIsNickNameCheckModalOpen] =
    useState(false);
  const handleCloseNicknameModal = () => setIsNickNameCheckModalOpen(false);

  const handleValidate = async (): Promise<boolean> => {
    setError("");

    try {
      await nicknameSchema.validate(nickname);
      return true; // 유효
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setError(err.message);
      }
      return false; // 무효
    }
  };

  // 닉네임 변경 시 유효성 검사
  useEffect(() => {
    void handleValidate();
  }, [nickname]);

  useEffect(() => {
    // 닉네임이 바뀌면 중복확인 결과 초기화
    setCheckStatus("idle");
    setCheckMessage("");
    setLastCheckedNickname("");
  }, [nickname]);

  const checkNicknameMutation = useMutation({
    mutationFn: (nickname: string) => checkNickname(nickname),
  });

  const onClickCheckNickname = async () => {
    const requestedNickname = nickname.trim();

    if (!requestedNickname) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    const ok = await handleValidate();
    if (!ok) return;

    checkNicknameMutation.mutate(requestedNickname, {
      onSuccess: (res) => {
        // 사용자가 이미 입력을 바꿨으면 이 응답은 무시
        if (nickname.trim() !== requestedNickname) return;

        setLastCheckedNickname(requestedNickname);
        setCheckStatus("valid");
        setCheckMessage(res.message);
        setIsNickNameCheckModalOpen(true);
      },
      onError: (error) => {
        if (nickname.trim() !== requestedNickname) return;

        setLastCheckedNickname(requestedNickname);
        setCheckStatus("duplicate");

        const fallback = "닉네임 중복 확인에 실패했습니다.";

        if (error instanceof AxiosError) {
          setCheckMessage(error.response?.data?.message ?? fallback);
        } else {
          setCheckMessage(fallback);
        }

        setIsNickNameCheckModalOpen(true);
      },
    });
  };

  // === disabled 조건 ===
  // 요청중 상태
  const isPending = checkNicknameMutation.isPending;

  // 공백
  const trimmed = nickname.trim();

  // 마지막 체크값이 실패한 경우
  const isSameAsLastChecked =
    trimmed.length > 0 && nickname === lastCheckedNickname;
  const isDuplicateLocked = checkStatus === "duplicate" && isSameAsLastChecked;

  // disabled 계산
  const isCheckDisabled =
    isPending ||
    trimmed.length === 0 ||
    Boolean(error) ||
    checkStatus === "valid" ||
    isDuplicateLocked;

  // 닉네임 유효성 검사 통과 확인
  const isNicknameVerified =
    checkStatus === "valid" &&
    nickname.length > 0 &&
    nickname === lastCheckedNickname;

  // === 성별 선택 모달 ===
  const [gender, setGender] = useState<GenderType | null>(null);
  const [isGenderModalOpen, setIsGenderModalOpen] = useState<boolean>(false);
  const handleOpenGenderModal = () => setIsGenderModalOpen(true);
  const handleCloseGenderModal = () => setIsGenderModalOpen(false);

  useEffect(() => {
    console.log(gender);
  }, [gender]);

  // === 생년월일 선택 모달 ===
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
    console.log(userBirthYear, userBirthMonth, userBirthDay);
  };

  const formattedBirth =
    userBirthYear && userBirthMonth && userBirthDay
      ? `${userBirthYear}년 ${userBirthMonth}월 ${userBirthDay}일`
      : undefined;

  // === 프로필 설정 스킵 ===
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

  // === 가입 완료 ===

  // bottom 버튼 valid 조건
  const isInvalid = (): boolean => {
    return (
      !trimmed || // 닉네임이 비어있거나
      !!error || // 유효성 검사 에러가 존재하거나
      !isNicknameVerified || // 닉네임 중복 확인을 통과하지 못했거나
      gender === null || // 성별 미선택
      !userBirthYear.trim() || // 생년이 비어있거나
      !userBirthMonth.trim() || // 생월이 비어있거나
      !userBirthDay.trim() || // 생일이 비어있거나
      formattedBirth === undefined // 생년월일 포맷이 없으면
    );
  };

  return (
    <>
      <CheckResultModal
        isOpen={isNickNameCheckModalOpen}
        message={checkMessage}
        onClick={handleCloseNicknameModal}
      />
      <ProfileLayout
        genderProps={{
          isGenderModalOpen,
          handleCloseGenderModal,
          gender,
          setGender,
        }}
        birthProps={{
          isBirthModalOpen,
          handleCloseBirthModal,
          userBirthYear,
          userBirthMonth,
          userBirthDay,
          handleChangeBirth,
        }}
        skipProfileProps={{
          isSkipModalOpen,
          handleOpenSkipModal,
          handleCloseSkipModal,
          handleSkipProfile,
        }}
        pageTitle={{
          title: PROFILE_TEXT.TITLE,
          subTitle: PROFILE_TEXT.SUB_TITLE,
        }}
        handleGoBack={() => navigate(ROUTES.AUTH.SIGNUP.VERIFY)}
        nickname={nickname}
        setNickname={setNickname}
        isNicknameError={!!nickname.length && !!error.length}
        nicknameHelperText={nickname.length ? error : undefined}
        buttonProps={{
          disabled: isCheckDisabled,
          onClick: onClickCheckNickname,
        }}
        genderValue={getGenderLabel(gender)}
        birthValue={formattedBirth}
        handleOpenGenderModal={handleOpenGenderModal}
        handleOpenBirthModal={handleOpenBirthModal}
        isSkipProfile={isSkipProfile}
        isDisabled={isInvalid()}
        handleSubmitProfile={() => navigate(ROUTES.AUTH.SIGNUP.COMPLETE)}
      />
    </>
  );
};

export default ProfilePage;
