import { useState } from "react";
import { ValidationError } from "yup";
import { useNavigate } from "react-router-dom";
import { safeBack } from "@/utils/safeBack";
import { passwordSchema, passwordConfirmSchema } from "@/utils/authSchema";
import { FIND_PW_TEXTS } from "@/constants/texts/auth/find/findAuth";

import { BackHeader } from "@/components/common/headers/BackHeader";
import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import CommonButton from "@/components/common/buttons/CommonButton";

const FindPwResetPage = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    passwordConfirm?: string;
  }>({});

  // 비밀번호 유효성 검사
  const validatePassword = (value: string) => {
    try {
      passwordSchema.validateSync(value);
      setErrors((prev) => ({ ...prev, password: undefined }));
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrors((prev) => ({ ...prev, password: error.message }));
      }
    }
  };

  // 비밀번호 확인 유효성 검사
  const validatePasswordConfirm = (value: string) => {
    try {
      passwordConfirmSchema(password).validateSync(value);
      setErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrors((prev) => ({ ...prev, passwordConfirm: error.message }));
      }
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) validatePassword(value);
  };

  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value);
    if (value) validatePasswordConfirm(value);
  };

  const handleSubmit = () => {
    if (!password || !passwordConfirm) return;
    if (errors.password || errors.passwordConfirm) return;

    // TODO: API 호출하여 비밀번호 변경
    console.log("비밀번호 변경:", { password, passwordConfirm });

    // 성공 시 로그인 페이지로 이동
    navigate("/login");
  };

  const isFormValid =
    password && passwordConfirm && !errors.password && !errors.passwordConfirm;

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-black">
      <BackHeader
        isDarkBg={true}
        onClick={() => safeBack(navigate, "/")}
        label={FIND_PW_TEXTS.PAGE_TITLE}
      />
      <div className="flex flex-col w-full px-6 flex-1">
        <PageTitle title={FIND_PW_TEXTS.RESET.TITLE} />
        <div className="flex flex-col w-full gap-6 flex-1 justify-between">
          <div className="flex flex-col w-full gap-4">
            <CommonInput
              label={FIND_PW_TEXTS.RESET.PASSWORD_LABEL}
              placeholder={FIND_PW_TEXTS.RESET.PASSWORD_PLACEHOLDER}
              value={password}
              setValue={handlePasswordChange}
              type="password"
              error={password !== "" && !!errors.password}
              helperText={password !== "" ? errors.password : ""}
            />
            <CommonInput
              label={FIND_PW_TEXTS.RESET.CONFIRM_PASSWORD_LABEL}
              placeholder={FIND_PW_TEXTS.RESET.CONFIRM_PASSWORD_PLACEHOLDER}
              value={passwordConfirm}
              setValue={handlePasswordConfirmChange}
              type="password"
              error={passwordConfirm !== "" && !!errors.passwordConfirm}
              helperText={passwordConfirm !== "" ? errors.passwordConfirm : ""}
            />
          </div>
          <CommonButton
            label={FIND_PW_TEXTS.RESET.BUTTON}
            isDisabled={!isFormValid}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default FindPwResetPage;
