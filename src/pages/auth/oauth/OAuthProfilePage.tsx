import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ValidationError } from "yup";

import { ROUTES } from "@/constants/routes";
import { nicknameSchema } from "@/utils/authSchema";
import { checkNickname, updateMe } from "@/api/queries";
import { useAlertModalStore } from "@/stores/alertModalStore";

import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import Button from "@/components/common/buttons/CommonButton";
import CheckResultModal from "@/components/auth/signup/CheckResultModal";

import type { NicknameCheckStatus } from "@/types/signupTypes";

/**
 * OAuth 신규 회원 닉네임 설정 페이지
 * 소셜 로그인 후 닉네임이 없는 신규 회원이 닉네임을 설정하는 페이지입니다.
 * 닉네임 설정 완료 시 회원 정보 수정 API(updateMe)를 호출하여 저장합니다.
 */
const OAuthProfilePage = () => {
  const navigate = useNavigate();
  const openAlertModal = useAlertModalStore((s) => s.openAlertModal);

  // === 닉네임 입력 ===
  const [nickName, setNickname] = useState("");
  const [error, setError] = useState("");

  // 중복확인 상태
  const [checkStatus, setCheckStatus] = useState<NicknameCheckStatus>("idle");
  const [checkMessage, setCheckMessage] = useState("");
  const [lastCheckedNickname, setLastCheckedNickname] = useState("");
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);

  // 닉네임 유효성 검사
  const handleValidate = async (): Promise<boolean> => {
    setError("");
    try {
      await nicknameSchema.validate(nickName);
      return true;
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setError(err.message);
      }
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
        setLastCheckedNickname(trimmed);
        setCheckStatus("duplicate");
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

  // === 닉네임 저장 ===
  const updateMeMutation = useMutation({
    mutationFn: () => updateMe({ nickName: nickName.trim() }),
    onSuccess: () => {
      openAlertModal(
        { title: "설정 완료", content: "닉네임이 설정되었습니다.\n바로가기로 이동합니다." },
        () => navigate(ROUTES.MAIN.HOME, { replace: true })
      );
    },
    onError: (err) => {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || "닉네임 저장에 실패했습니다."
          : "닉네임 저장에 실패했습니다.";
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

  const isSubmitDisabled =
    !isNicknameVerified || updateMeMutation.isPending;

  return (
    <>
      <CheckResultModal
        isOpen={isCheckModalOpen}
        message={checkMessage}
        onClick={() => setIsCheckModalOpen(false)}
      />

      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col w-full px-6">
          <PageTitle
            title="닉네임 설정"
            subTitle="서비스에서 사용할 닉네임을 입력해주세요."
          />
          <CommonInput
            label="닉네임"
            placeholder="2~12자 한글, 영문, 숫자"
            value={nickName}
            setValue={setNickname}
            withButton={true}
            error={!!nickName.length && !!error.length}
            helperText={nickName.length ? error : undefined}
            buttonProps={{
              disabled: isCheckDisabled,
              onClick: onClickCheckNickname,
            }}
          />
        </div>

        <div className="flex flex-col items-center justify-center w-full mt-auto p-6">
          <Button
            label="시작하기"
            isDisabled={isSubmitDisabled}
            onClick={() => updateMeMutation.mutate()}
          />
        </div>
      </div>
    </>
  );
};

export default OAuthProfilePage;
