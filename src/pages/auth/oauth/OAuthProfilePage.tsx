import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ValidationError } from "yup";

import { ROUTES } from "@/constants/routes";
import { nicknameSchema } from "@/utils/authSchema";
import { checkNickname, updateMe } from "@/api/queries";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { getGenderLabel, type GenderType } from "@/constants/userInfo";

import ProfileLayout from "@/components/auth/signup/ProfileLayout";
import CheckResultModal from "@/components/auth/signup/CheckResultModal";

import type { NicknameCheckStatus } from "@/types/signupTypes";
import type { PreferredRegion } from "@/types/regionCode";
import { formatPreferredRegion } from "@/utils/api/homeMapper";

/**
 * OAuth 신규 회원 프로필 설정 페이지
 * 소셜 로그인 후 닉네임이 없는 신규 회원이 프로필을 설정하는 페이지입니다.
 * 기존 회원가입 프로필 페이지(ProfileLayout)를 재사용하되,
 * 회원가입 대신 회원 정보 수정 API(updateMe)를 호출합니다.
 */
const OAuthProfilePage = () => {
  const navigate = useNavigate();
  const openAlertModal = useAlertModalStore((s) => s.openAlertModal);

  // === 닉네임 입력 ===
  const [nickName, setNickname] = useState("");
  const [error, setError] = useState("");

  const [checkStatus, setCheckStatus] = useState<NicknameCheckStatus>("idle");
  const [checkMessage, setCheckMessage] = useState("");
  const [lastCheckedNickname, setLastCheckedNickname] = useState("");
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);

  const handleValidate = async (): Promise<boolean> => {
    setError("");
    try {
      await nicknameSchema.validate(nickName.trim());
      return true;
    } catch (err: unknown) {
      if (err instanceof ValidationError) setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    void handleValidate();
  }, [nickName]);

  useEffect(() => {
    setCheckStatus("idle");
    setCheckMessage("");
    setLastCheckedNickname("");
  }, [nickName]);

  // 닉네임 중복 확인
  const checkNicknameMutation = useMutation({
    mutationFn: (name: string) => checkNickname(name),
  });

  const onClickCheckNickname = async () => {
    const trimmed = nickName.trim();
    if (!trimmed) {
      setError("닉네임을 입력해주세요.");
      return;
    }
    const ok = await handleValidate();
    if (!ok) return;

    checkNicknameMutation.mutate(trimmed, {
      onSuccess: (res) => {
        if (nickName.trim() !== trimmed) return;
        setLastCheckedNickname(trimmed);
        setCheckStatus("valid");
        setCheckMessage(res.message);
        setIsCheckModalOpen(true);
      },
      onError: (err) => {
        if (nickName.trim() !== trimmed) return;
        const isDuplicate =
          err instanceof AxiosError && err.response?.status === 409;

        if (isDuplicate) {
          setLastCheckedNickname(trimmed);
          setCheckStatus("duplicate");
        } else {
          setCheckStatus("error");
        }

        const fallback = "닉네임 중복 확인에 실패했습니다.";
        setCheckMessage(
          err instanceof AxiosError
            ? err.response?.data?.message ?? fallback
            : fallback
        );
        setIsCheckModalOpen(true);
      },
    });
  };

  // === 성별 선택 ===
  const [gender, setGender] = useState<GenderType | undefined>(undefined);
  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);

  // === 생년월일 선택 ===
  const [userBirthYear, setUserBirthYear] = useState("");
  const [userBirthMonth, setUserBirthMonth] = useState("");
  const [userBirthDay, setUserBirthDay] = useState("");
  const [isBirthModalOpen, setIsBirthModalOpen] = useState(false);

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

  const birth =
    userBirthYear && userBirthMonth && userBirthDay
      ? `${userBirthYear}${userBirthMonth}${userBirthDay}`
      : undefined;

  // === 선호 지역 선택 ===
  // 미선택(undefined)은 정상 상태다 — 선호 지역은 선택 항목이라 안 고르고 넘어가도 된다.
  // 고른 경우에는 시/도·시·군·구가 항상 함께 채워진다(`PreferredRegion`).
  const [region, setRegion] = useState<PreferredRegion | undefined>(undefined);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  // === 프로필 저장 ===
  const updateMeMutation = useMutation({
    mutationFn: () =>
      updateMe({
        nickName: nickName.trim(),
        ...(birth && { birth }),
        ...(gender && { gender }),
        // 지역은 쌍으로만 보낸다 (`PreferredRegion` 이 둘 다 필수)
        ...(region && {
          areaCd: region.areaCd,
          sigunguCd: region.sigunguCd,
        }),
      }),
    onSuccess: () => {
      navigate(ROUTES.MAIN.HOME, { replace: true });
    },
    onError: (err) => {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || "프로필 저장에 실패했습니다."
          : "프로필 저장에 실패했습니다.";
      openAlertModal({ title: "오류", content: message });
    },
  });

  // === disabled 조건 ===
  const trimmed = nickName.trim();
  const isNicknameVerified =
    checkStatus === "valid" && trimmed.length > 0 && trimmed === lastCheckedNickname;

  const isSameAsLastChecked = trimmed.length > 0 && trimmed === lastCheckedNickname;
  const isDuplicateLocked = checkStatus === "duplicate" && isSameAsLastChecked;

  const isCheckDisabled =
    checkNicknameMutation.isPending ||
    trimmed.length === 0 ||
    Boolean(error) ||
    checkStatus === "valid" ||
    isDuplicateLocked;

  const isSubmitDisabled = !isNicknameVerified || updateMeMutation.isPending;

  return (
    <>
      <CheckResultModal
        isOpen={isCheckModalOpen}
        message={checkMessage}
        onClick={() => setIsCheckModalOpen(false)}
      />

      <ProfileLayout
        genderProps={{
          isGenderModalOpen,
          handleCloseGenderModal: () => setIsGenderModalOpen(false),
          gender,
          setGender,
        }}
        birthProps={{
          isBirthModalOpen,
          handleCloseBirthModal: () => setIsBirthModalOpen(false),
          userBirthYear,
          userBirthMonth,
          userBirthDay,
          handleChangeBirth,
        }}
        regionProps={{
          isRegionModalOpen,
          handleCloseRegionModal: () => setIsRegionModalOpen(false),
          region,
          setRegion,
        }}
        skipProfileProps={{
          isSkipModalOpen: false,
          handleOpenSkipModal: () => {},
          handleCloseSkipModal: () => {},
          handleSkipProfile: () => {},
        }}
        pageTitle={{
          title: "프로필 정보를 등록해주세요",
          subTitle: "이 정보를 바탕으로 더 정확한 추천을 드릴 수 있어요",
        }}
        handleGoBack={() => navigate(ROUTES.AUTH.LANDING, { replace: true })}
        nickname={nickName}
        setNickname={setNickname}
        isNicknameError={!!nickName.length && !!error.length}
        nicknameHelperText={nickName.length ? error : undefined}
        buttonProps={{
          disabled: isCheckDisabled,
          onClick: onClickCheckNickname,
        }}
        genderValue={getGenderLabel(gender)}
        birthValue={formattedBirth}
        regionValue={formatPreferredRegion(region)}
        handleOpenGenderModal={() => setIsGenderModalOpen(true)}
        handleOpenBirthModal={() => setIsBirthModalOpen(true)}
        handleOpenRegionModal={() => setIsRegionModalOpen(true)}
        isSkipProfile={false}
        isDisabled={isSubmitDisabled}
        handleSubmitProfile={() => updateMeMutation.mutate()}
        hideSkip
        submitLabel="시작하기"
      />
    </>
  );
};

export default OAuthProfilePage;
