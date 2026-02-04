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
import ErrorModal from "@/components/auth/signup/ErrorModal";

// === server ===
import { useMutation } from "@tanstack/react-query";
// 1. 닉네임
import { checkNickname } from "@/api/queries";
import type { NicknameCheckStatus } from "@/types/signupTypes";
import { generateRandomNickname } from "@/utils/auth/generateRandomNickname";

// 2. 회원가입
import { useSignupStore } from "@/stores/signupStore";
import type {
  SignupPayloadType,
  RequiredFields,
  OptionalFields,
  SignupErrorState,
} from "@/types/signupTypes";
import { handleSignupError } from "@/utils/auth/handleSignupError";
import { signup } from "@/api/queries";

// 3. 약관 동의
import type { TermsProcessRequestType } from "@/api/types";
import { agreeTerms } from "@/api/queries";
import {
  loadTermsAgreeList,
  clearTermsAgreeList,
} from "@/utils/sessionStorage/termsAgree";

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
  const [nickName, setNickname] = useState<string>("");
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
      await nicknameSchema.validate(nickName);
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
  }, [nickName]);

  useEffect(() => {
    // 닉네임이 바뀌면 중복확인 결과 초기화
    setCheckStatus("idle");
    setCheckMessage("");
    setLastCheckedNickname("");
  }, [nickName]);

  const checkNicknameMutation = useMutation({
    mutationFn: (nickName: string) => checkNickname(nickName),
  });

  const onClickCheckNickname = async () => {
    const requestedNickname = nickName.trim();

    if (!requestedNickname) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    const ok = await handleValidate();
    if (!ok) return;

    checkNicknameMutation.mutate(requestedNickname, {
      onSuccess: (res) => {
        // 사용자가 이미 입력을 바꿨으면 이 응답은 무시
        if (nickName.trim() !== requestedNickname) return;

        setLastCheckedNickname(requestedNickname);
        setCheckStatus("valid");
        setCheckMessage(res.message);
        setIsNickNameCheckModalOpen(true);
      },
      onError: (error) => {
        if (nickName.trim() !== requestedNickname) return;

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
  const trimmed = nickName.trim();

  // 마지막 체크값이 실패한 경우
  const isSameAsLastChecked =
    trimmed.length > 0 && nickName === lastCheckedNickname;
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
    nickName.length > 0 &&
    nickName === lastCheckedNickname;

  // === 성별 선택 모달 ===
  const [gender, setGender] = useState<GenderType | undefined>(undefined);
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

  // server 전송용 birth 변수
  const birth = `${userBirthYear}${userBirthMonth}${userBirthDay}`;

  // === 회원 가입 로직 ===

  const draft = useSignupStore((s) => s.draft); // store 값 꺼내오기
  // 회원 가입 시 발생하는 에러 로직 처리 모달
  const [errorModal, setErrorModal] = useState<SignupErrorState>({
    isOpen: false,
    message: "",
    redirectTo: undefined,
    replace: true,
  });

  const openErrorModal = (params: {
    message: string;
    redirectTo?: string;
    replace?: boolean;
  }) => {
    setErrorModal({
      isOpen: true,
      message: params.message,
      redirectTo: params.redirectTo,
      replace: params.replace ?? true,
    });
  };

  // 서버 전송 값 생성
  const buildSignupPayload = (
    draft: Partial<SignupPayloadType>,
    required: Pick<RequiredFields, "nickName">,
    optional?: Partial<OptionalFields>
  ): SignupPayloadType | null => {
    const { userId, password, tel } = draft;

    if (!userId || !password) {
      openErrorModal({
        message:
          "아이디, 비밀번호 정보가 누락되었습니다. \n해당 페이지로 이동합니다.",
        redirectTo: ROUTES.AUTH.SIGNUP.CREDENTIALS,
        replace: true,
      });
      return null;
    }

    if (!tel) {
      openErrorModal({
        message: "전화번호가 인증되지 않았습니다. \n해당 페이지로 이동합니다.",
        redirectTo: ROUTES.AUTH.VERIFY.SIGNUP,
        replace: true,
      });
      return null;
    }

    const nickName = required.nickName;
    if (!nickName) {
      openErrorModal({ message: "닉네임을 입력해주세요." });
      return null;
    }

    const payload: SignupPayloadType = {
      userId,
      password,
      tel,
      nickName: nickName,
    };

    if (birth) payload.birth = birth;
    if (gender) payload.gender = gender;

    return payload;
  };

  const handleErrorModalConfirm = () => {
    const { redirectTo, replace } = errorModal;

    setErrorModal((prev) => ({ ...prev, isOpen: false }));

    if (redirectTo) {
      navigate(redirectTo, { replace: replace ?? true });
    }
  };

  // === 약관 동의 ===
  const agreeTermsMutation = useMutation({
    mutationFn: (params: {
      userId: string;
      termsAgreeList: TermsProcessRequestType[];
    }) => agreeTerms(params.userId, params.termsAgreeList),
  });
  // === 프로필 설정 스킵 ===
  const [isSkipProfile, setIsSkipProfile] = useState(false);

  const [isSkipModalOpen, setIsSkipModalOpen] = useState<boolean>(false);
  const handleOpenSkipModal = () => setIsSkipModalOpen(true);
  const handleCloseSkipModal = () => setIsSkipModalOpen(false);

  // 스킵 로직
  const onSubmitSignupSkipProfile = () => {
    // 랜덤 닉네임 생성
    const randomNickName = generateRandomNickname();

    // payload 조립 (optional 생략)
    const payload = buildSignupPayload(draft, { nickName: randomNickName });
    if (!payload) return;

    // 회원가입 호출
    signupMutation.mutate(payload, {
      onSuccess: () => {
        navigate(ROUTES.AUTH.SIGNUP.COMPLETE, { replace: true });
      },
      onError: handleSignupError({ openErrorModal }),
    });
  };

  const handleSkipProfile = () => {
    handleCloseSkipModal(); // 모달 닫기
    onSubmitSignupSkipProfile(); // 랜덤 닉네임으로 회원가입 진행
  };

  useEffect(() => {
    if (isSkipModalOpen) {
      setIsSkipProfile(true);
    } else {
      setIsSkipProfile(false);
    }
  }, [isSkipModalOpen]);

  // bottom 버튼 valid 조건
  const isInvalid = (): boolean => {
    return (
      !trimmed || // 닉네임이 비어있거나
      !!error || // 유효성 검사 에러가 존재하거나
      !isNicknameVerified // 닉네임 중복 확인을 통과하지 못했거나
    );
  };

  const signupMutation = useMutation({
    mutationFn: (payload: SignupPayloadType) => signup(payload),
  });

  const onSubmitSignupWithProfile = async () => {
    // 닉네임 검증
    if (!isNicknameVerified) {
      openErrorModal({
        message: "닉네임 중복 확인을 완료해주세요.",
        // 현재 페이지 유지
      });
      return;
    }

    // payload 조립
    const payload = buildSignupPayload(
      draft,
      { nickName: nickName },
      { birth, gender }
    );

    // 검증 실패 시(모달 오픈 + null 반환) 제출 중단
    if (!payload) return;

    try {
      // 회원가입 먼저
      await signupMutation.mutateAsync(payload);

      // 세션에서 약관 동의 내역 로드
      const termsAgreeList = loadTermsAgreeList();
      if (!termsAgreeList) {
        openErrorModal({
          message: "약관 동의 정보가 없습니다. 약관 동의 화면으로 이동합니다.",
          redirectTo: ROUTES.AUTH.SIGNUP.TERMS,
          replace: true,
        });
        return;
      }

      // 약관 동의 서버 전송 (그대로 사용 가능)
      await agreeTermsMutation.mutateAsync({
        userId: payload.userId,
        termsAgreeList,
      });

      // 성공 처리
      clearTermsAgreeList();
      navigate(ROUTES.AUTH.SIGNUP.COMPLETE, { replace: true });
    } catch (e) {
      // signup / agreeTerms 에러 모두 여기서 처리
      handleSignupError({ openErrorModal })(e);
    }
  };

  return (
    <>
      <CheckResultModal
        isOpen={isNickNameCheckModalOpen}
        message={checkMessage}
        onClick={handleCloseNicknameModal}
      />
      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClick={handleErrorModalConfirm}
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
        handleOpenGenderModal={handleOpenGenderModal}
        handleOpenBirthModal={handleOpenBirthModal}
        isSkipProfile={isSkipProfile}
        isDisabled={isInvalid()}
        handleSubmitProfile={onSubmitSignupWithProfile}
      />
    </>
  );
};

export default ProfilePage;
