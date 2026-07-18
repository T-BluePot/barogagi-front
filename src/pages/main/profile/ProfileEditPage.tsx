import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { AxiosError } from "axios";
import { ValidationError } from "yup";
import { getMe, updateMe, checkNickname } from "@/api/queries/authQueries";
import { authKeys } from "@/api/keyFactories";
import { ROUTES } from "@/constants/routes";
import { PROFILE_EDIT_TEXT } from "@/constants/texts/main/profile";
import type { BaseResponse, MemberRequestDTO } from "@/api/types";
import type { NicknameCheckStatus } from "@/types/signupTypes";
import { getGenderLabel, type GenderType } from "@/constants/userInfo";
import { nicknameSchema } from "@/utils/authSchema";

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
    onError: (error) => {
      const serverMessage =
        error instanceof AxiosError
          ? (error.response?.data as BaseResponse<null>)?.message
          : undefined;
      openAlertModal({
        title: PROFILE_EDIT_TEXT.ERROR_MODAL.TITLE,
        content: serverMessage ?? PROFILE_EDIT_TEXT.ERROR_MODAL.CONTENT,
        buttonLabel: PROFILE_EDIT_TEXT.ERROR_MODAL.BUTTON_LABEL,
      });
    },
  });

  // Form State
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<GenderType | undefined>(undefined);
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
      setGender((userData.gender as GenderType) || undefined);

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

  // === 닉네임 중복 확인 (닉네임을 기존과 다르게 바꿨을 때만 노출/요구) ===
  const originalNickname = userData?.nickName ?? "";
  const trimmedNickname = nickname.trim();
  const isNicknameChanged =
    trimmedNickname.length > 0 && trimmedNickname !== originalNickname;

  const [nicknameCheckStatus, setNicknameCheckStatus] =
    useState<NicknameCheckStatus>("idle");
  const [lastCheckedNickname, setLastCheckedNickname] = useState("");

  // 비동기 응답 콜백은 요청 당시 nickname을 클로저로 캡처하므로, 최신값을 ref로 참조한다.
  // (렌더 중 ref 변이는 동시성 렌더링에서 지양 → 커밋 이후 effect에서 동기화)
  const latestNicknameRef = useRef(nickname);

  // 닉네임을 다시 수정하면 최신값 ref 동기화 + 이전 확인 결과 무효화
  useEffect(() => {
    latestNicknameRef.current = nickname;
    setNicknameCheckStatus("idle");
    setLastCheckedNickname("");
  }, [nickname]);

  const checkNicknameMutation = useMutation({
    mutationFn: (value: string) => checkNickname(value),
  });

  const alertOnce = (title: string) =>
    openAlertModal({
      title,
      buttonLabel: PROFILE_EDIT_TEXT.ERROR_MODAL.BUTTON_LABEL,
    });

  const handleCheckNickname = async () => {
    const requested = nickname.trim();
    if (!requested) return;

    // 형식 검사 먼저 (회원가입과 동일 규칙)
    try {
      await nicknameSchema.validate(requested);
    } catch (err) {
      if (err instanceof ValidationError) alertOnce(err.message);
      return;
    }

    checkNicknameMutation.mutate(requested, {
      onSuccess: (res) => {
        if (latestNicknameRef.current.trim() !== requested) return; // 그 사이 입력이 바뀌면 무시
        setLastCheckedNickname(requested);
        setNicknameCheckStatus("valid");
        alertOnce(res.message ?? "사용 가능한 닉네임입니다.");
      },
      onError: (error) => {
        if (latestNicknameRef.current.trim() !== requested) return;
        const isDuplicate =
          error instanceof AxiosError && error.response?.status === 409;
        setNicknameCheckStatus(isDuplicate ? "duplicate" : "error");
        if (isDuplicate) setLastCheckedNickname(requested);
        const msg =
          error instanceof AxiosError
            ? (error.response?.data?.message ??
              PROFILE_EDIT_TEXT.NICKNAME.CHECK_FAIL)
            : PROFILE_EDIT_TEXT.NICKNAME.CHECK_FAIL;
        alertOnce(msg);
      },
    });
  };

  // 변경된 닉네임이 "사용 가능" 확인을 통과했는지 (요청·저장 모두 trim 기준으로 비교)
  const isNicknameVerified =
    nicknameCheckStatus === "valid" &&
    trimmedNickname.length > 0 &&
    trimmedNickname === lastCheckedNickname;

  const isCheckDisabled =
    checkNicknameMutation.isPending ||
    (trimmedNickname === lastCheckedNickname &&
      (nicknameCheckStatus === "valid" || nicknameCheckStatus === "duplicate"));

  // 완료 버튼 비활성화: 닉네임 공백 / 요청 중 / 닉네임을 바꿨는데 중복확인 미통과
  const isDisabled =
    !trimmedNickname ||
    updateMutation.isPending ||
    (isNicknameChanged && !isNicknameVerified);

  // 프로필 수정 제출
  const handleSubmitProfile = () => {
    // 닉네임을 바꿨다면 중복 확인을 통과해야 제출 가능 (버튼도 비활성되지만 방어적으로 한 번 더)
    if (isNicknameChanged && !isNicknameVerified) {
      alertOnce(PROFILE_EDIT_TEXT.NICKNAME.CHECK_REQUIRED);
      return;
    }

    const birth =
      userBirthYear && userBirthMonth && userBirthDay
        ? `${userBirthYear}${userBirthMonth}${userBirthDay}`
        : undefined;

    // 변경된 필드만 전송한다.
    // 안 바꾼 닉네임까지 그대로 보내면 서버가 "본인 닉네임"도 중복으로 판정해
    // "이미 사용 중인 닉네임" 에러가 난다. (MemberRequestDTO의 필드는 모두 optional)
    const payload: MemberRequestDTO = {};
    const trimmedNickname = nickname.trim();

    if (trimmedNickname && trimmedNickname !== (userData?.nickName ?? "")) {
      payload.nickName = trimmedNickname;
    }
    if (gender && gender !== userData?.gender) {
      payload.gender = gender;
    }
    if (birth && birth !== userData?.birth) {
      payload.birth = birth;
    }

    // 바뀐 게 없으면 요청 없이 프로필로 돌아간다
    if (Object.keys(payload).length === 0) {
      navigate(ROUTES.MAIN.PROFILE, { replace: true });
      return;
    }

    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full bg-white text-gray-black items-center justify-center">
        <span className="typo-body text-gray-50">
          {PROFILE_EDIT_TEXT.LOADING}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-white text-gray-black">
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
            // 닉네임을 기존과 다르게 바꿨을 때만 중복 확인 버튼을 노출한다
            withButton={isNicknameChanged}
            buttonProps={{
              label: isNicknameVerified
                ? PROFILE_EDIT_TEXT.NICKNAME.CHECK_DONE
                : PROFILE_EDIT_TEXT.NICKNAME.CHECK_BUTTON,
              onClick: handleCheckNickname,
              disabled: isCheckDisabled,
            }}
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
