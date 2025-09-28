import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ValidationError } from "yup";

import {
  idSchema,
  passwordSchema,
  passwordConfirmSchema,
} from "@/utils/authSchema";

import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import Button from "@/components/common/buttons/CommonButton";

import { CREDENTIALS_TEXT } from "@/constants/texts/auth/signup/credentials";
import { ROUTES } from "@/constants/routes";

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
    handleValidate();
  }, [id, password, passwordConfirm]);

  const shouldDisableButton = (): boolean => {
    // 모든 입력값이 공백 또는 빈 문자열인 경우 → true 반환
    if ([id, password, passwordConfirm].every((v) => v.trim() === ""))
      return true;

    if (Object.keys(errors).length !== 0) return true;

    return false;
  };

  return (
    <div className="flex flex-col items-center justify-between h-full bg-gray-black">
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
            onClickButton={() => {
              // 중복 확인용 함수
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
          isDisabled={shouldDisableButton()}
          onClick={() => navigate(ROUTES.AUTH.SIGNUP.VERIFY)}
        />
      </div>
    </div>
  );
};

export default CredentialsPage;
