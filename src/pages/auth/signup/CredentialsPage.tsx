import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { ValidationError } from "yup";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

// === Schema ===
import {
  idSchema,
  passwordSchema,
  passwordConfirmSchema,
} from "@/utils/authSchema";

// === component ===
import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import Button from "@/components/common/buttons/CommonButton";

import IdCheckResultModal from "@/components/auth/signup/IdCheckResultModal";

// === constant ===
import { CREDENTIALS_TEXT } from "@/constants/texts/auth/signup/credentials";
import { ROUTES } from "@/constants/routes";

// === server ===
import { checkId } from "@/api/queries";

const CredentialsPage = () => {
  const navigate = useNavigate();

  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleValidate = async (): Promise<boolean> => {
    const newErrors: { [key: string]: string } = {};

    try {
      await idSchema.validate(id);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        newErrors.id = err.message;
      }
    }

    try {
      await passwordSchema.validate(password);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        newErrors.password = err.message;
      }
    }

    try {
      const confirmSchema = passwordConfirmSchema(password);
      await confirmSchema.validate(passwordConfirm);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        newErrors.passwordConfirm = err.message;
      }
    }

    setErrors(newErrors);

    // 유효성 검사 결과에 따라 true/false 반환
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void handleValidate();
    }, 150); // 150~300ms 권장

    return () => clearTimeout(timer);
  }, [id, password, passwordConfirm]);

  useEffect(() => {
    void handleValidate();
  }, [id, password, passwordConfirm]);

  // === 아이디 중복 확인 ===
  const [isIdCheckModalOpen, setIsIdCheckModalOpen] = useState(false);
  const [checkIdMessage, setCheckIdMessage] = useState("");

  /** 아이디 중복 확인 결과 상태 저장 */
  const [checkedId, setCheckedId] = useState<string | null>(null); // 마지막으로 검사한 아이디
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null); // true/false/null(미검사)

  const { mutate: checkIdMutate } = useMutation({
    mutationFn: checkId,

    onSuccess: (res) => {
      setCheckedId(id);
      setIsIdAvailable(true);
      setCheckIdMessage(res.message); // 서버 message 저장
      setIsIdCheckModalOpen(true); // 모달 열기
    },

    onError: (error) => {
      setCheckedId(id);
      setIsIdAvailable(false);
      if (error instanceof AxiosError) {
        setCheckIdMessage(
          error.response?.data?.message ?? "아이디 중복 확인에 실패했습니다."
        );
      } else {
        setCheckIdMessage("아이디 중복 확인에 실패했습니다.");
      }

      setIsIdCheckModalOpen(true);
    },
  });

  // 아이디 변경 시 기존 검증 결과 초기화
  useEffect(() => {
    setCheckedId(null);
    setIsIdAvailable(null);
    setCheckIdMessage("");
    setIsIdCheckModalOpen(false);
  }, [id]);

  // 아이디 중복 확인 함수
  const handleCheckId = async () => {
    if (!id.trim()) return;

    try {
      await idSchema.validate(id);
    } catch {
      // 유효하지 않으면 중복 확인 API 호출 자체를 막음
      return;
    }

    checkIdMutate(id);
  };

  const isIdCheckCompleted = isIdAvailable === true && checkedId === id;

  const idCheckButtonLabel = isIdCheckCompleted ? "확인 완료" : "중복 확인";

  const isNextDisabled = useMemo(() => {
    if ([id, password, passwordConfirm].some((v) => v.trim() === ""))
      return true;
    if (Object.keys(errors).length !== 0) return true;
    if (isIdAvailable !== true || checkedId !== id) return true;
    return false;
  }, [id, password, passwordConfirm, errors, isIdAvailable, checkedId]);

  return (
    <div className="flex flex-col items-center justify-between h-full">
      <IdCheckResultModal
        isOpen={isIdCheckModalOpen}
        message={checkIdMessage}
        onClick={() => setIsIdCheckModalOpen(false)}
      />
      <div className="flex flex-col w-full px-6">
        <PageTitle title={CREDENTIALS_TEXT.TITLE} />
        <div className="flex flex-col w-full gap-4">
          <CommonInput
            label={CREDENTIALS_TEXT.ID.LABEL}
            placeholder={CREDENTIALS_TEXT.ID.PLACEHOLDER}
            value={id}
            setValue={setId}
            error={id !== "" && !!errors.id}
            helperText={id !== "" ? errors.id : ""}
            withButton={true}
            buttonProps={{
              label: idCheckButtonLabel,
              disabled: isIdCheckCompleted,
              onClick: handleCheckId,
            }}
          />
          <CommonInput
            label={CREDENTIALS_TEXT.PASSWORD.LABEL}
            placeholder={CREDENTIALS_TEXT.PASSWORD.PLACEHOLDER}
            value={password}
            setValue={setPassword}
            type="password"
            error={password !== "" && !!errors.password}
            helperText={password !== "" ? errors.password : ""}
          />
          <CommonInput
            label={CREDENTIALS_TEXT.CONFIRM_PASSWORD.LABEL}
            placeholder={CREDENTIALS_TEXT.CONFIRM_PASSWORD.PLACEHOLDER}
            value={passwordConfirm}
            setValue={setPasswordConfirm}
            type="password"
            error={passwordConfirm !== "" && !!errors.passwordConfirm}
            helperText={passwordConfirm !== "" ? errors.passwordConfirm : ""}
          />
        </div>
      </div>
      <div className="mt-auto w-full p-6">
        <Button
          label={CREDENTIALS_TEXT.NEXT_BUTTON}
          isDisabled={isNextDisabled}
          onClick={() => navigate(ROUTES.AUTH.SIGNUP.VERIFY)}
        />
      </div>
    </div>
  );
};

export default CredentialsPage;
