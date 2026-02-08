import { useState, useEffect, useMemo } from "react";
import { ValidationError } from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { AxiosError } from "axios";

import { ROUTES } from "@/constants/routes";
import { passwordSchema, passwordConfirmSchema } from "@/utils/authSchema";
import { FIND_PW_TEXTS } from "@/constants/texts/auth/find/findAuth";

import { PageTitle } from "@/components/auth/common/PageTitle";
import { CommonInput } from "@/components/auth/common/CommonInput";
import Button from "@/components/common/buttons/CommonButton";

import { findUser, resetPassword } from "@/api/queries";

type LocationState = { phone?: string };

const FindPwResetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};

  const [userId, setUserId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 전화번호로 userId 조회
  useEffect(() => {
    const fetchUserId = async () => {
      if (!state.phone) {
        navigate(ROUTES.AUTH.FIND_ACCOUNT, { replace: true });
        return;
      }

      try {
        const response = await findUser(state.phone);
        const users = response.data as { userId: string }[];
        if (users.length > 0) {
          setUserId(users[0].userId);
        } else {
          alert("해당 전화번호로 가입된 계정이 존재하지 않습니다.");
          navigate(ROUTES.AUTH.FIND_ACCOUNT, { replace: true });
        }
      } catch {
        alert("사용자 정보 조회에 실패했습니다.");
        navigate(ROUTES.AUTH.FIND_ACCOUNT, { replace: true });
      }
    };

    fetchUserId();
  }, [state.phone, navigate]);

  // === 유효성 검사 (회원가입과 동일한 패턴) ===
  const handleValidate = async (): Promise<boolean> => {
    const newErrors: { [key: string]: string } = {};

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
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void handleValidate();
    }, 150);

    return () => clearTimeout(timer);
  }, [password, passwordConfirm]);

  // === 제출 ===
  const handleSubmit = async () => {
    if (!password || !passwordConfirm || !userId) return;

    const isValid = await handleValidate();
    if (!isValid) return;

    setIsLoading(true);
    try {
      await resetPassword(userId, password);
      // 성공 시 로그인 페이지로 이동
      navigate(ROUTES.AUTH.SIGNIN, { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) {
        const code = error.response?.data?.code;
        if (code === "U400") {
          alert("해당 아이디의 정보가 존재하지 않습니다.");
        } else {
          alert(
            error.response?.data?.message ??
              "비밀번호 재설정에 실패했습니다. 잠시 후 다시 시도해주세요."
          );
        }
      } else {
        alert("비밀번호 재설정에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // === 버튼 비활성화 검증 ===
  const isFormValid = useMemo(() => {
    if (!userId) return false;
    if ([password, passwordConfirm].some((v) => v.trim() === "")) return false;
    if (Object.keys(errors).length !== 0) return false;
    if (isLoading) return false;
    return true;
  }, [userId, password, passwordConfirm, errors, isLoading]);

  return (
    <div className="flex flex-col w-full px-6 flex-1">
      <PageTitle title={FIND_PW_TEXTS.RESET.TITLE} />
      <div className="flex flex-col w-full gap-6 flex-1 justify-between">
        <div className="flex flex-col w-full gap-4">
          <CommonInput
            label={FIND_PW_TEXTS.RESET.PASSWORD_LABEL}
            placeholder={FIND_PW_TEXTS.RESET.PASSWORD_PLACEHOLDER}
            value={password}
            setValue={setPassword}
            type="password"
            error={password !== "" && !!errors.password}
            helperText={password !== "" ? errors.password : ""}
          />
          <CommonInput
            label={FIND_PW_TEXTS.RESET.CONFIRM_PASSWORD_LABEL}
            placeholder={FIND_PW_TEXTS.RESET.CONFIRM_PASSWORD_PLACEHOLDER}
            value={passwordConfirm}
            setValue={setPasswordConfirm}
            type="password"
            error={passwordConfirm !== "" && !!errors.passwordConfirm}
            helperText={passwordConfirm !== "" ? errors.passwordConfirm : ""}
          />
        </div>
        <div className="mb-6">
          <Button
            label={isLoading ? "처리 중..." : FIND_PW_TEXTS.RESET.BUTTON}
            isDisabled={!isFormValid}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default FindPwResetPage;
