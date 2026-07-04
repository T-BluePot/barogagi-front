import { useState } from "react";
import { ValidationError } from "yup";

// === component ===
import { CommonInput } from "@/components/auth/common/CommonInput";
import CommonButton from "@/components/common/buttons/CommonButton";
import TextButton from "@/components/common/buttons/TextButton";

// === Schema ===
import { idSchema, passwordSchema } from "@/utils/authSchema";

// === route ===
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

// === server ===
import { useLoginMutation } from "@/hooks/mutations/useLoginMutation";
import { handleLoginError } from "@/utils/auth/handleLoginError";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useLoginMutation();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    // 에러 초기화
    setError(null);

    // 입력값 검증
    if (!userId || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    // 아이디 유효성 검증
    try {
      await idSchema.validate(userId);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setError(err.message);
        return;
      } else {
        setError(
          "일시적인 오류로 아이디를 확인하지 못했어요. \n잠시 후 다시 시도해 주세요."
        );
      }
    }

    // 비밀번호 유효성 검증
    try {
      await passwordSchema.validate(password);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        setError(err.message);
        return;
      } else {
        setError(
          "일시적인 오류로 비밀번호를 확인하지 못했어요. \n잠시 후 다시 시도해 주세요."
        );
      }
    }

    const onLoginError = handleLoginError({ setError });

    try {
      await mutateAsync({ userId, password });
    } catch (err) {
      onLoginError(err);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleLogin();
  };

  return (
    <form className="" onSubmit={handleSubmit}>
      {/* 에러 메시지 표시 */}
      {error && (
        <div className="mb-4 p-3 bg-alert-red/10 border border-alert-red rounded-lg">
          <p className="typo-caption text-alert-red">{error}</p>
        </div>
      )}

      <CommonInput
        label="아이디"
        placeholder="아이디를 입력하세요"
        type="text"
        value={userId}
        setValue={setUserId}
      />
      <CommonInput
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        type="password"
        value={password}
        setValue={setPassword}
      />
      <div className="mt-16">
        <CommonButton
          type="submit"
          label={isPending ? "로그인 중..." : "로그인 하기"}
          isDisabled={isPending || !userId || !password}
        />
        <div className="flex justify-center items-center mt-4 text-main text-sm">
          <TextButton
            label="아이디 찾기"
            variant="main"
            className="typo-tag"
            onClick={() => navigate(`${ROUTES.AUTH.FIND_ACCOUNT}?tab=id`)}
          />
          <span className="text-gray-20">|</span>
          <TextButton
            label="비밀번호 재설정"
            variant="main"
            className="typo-tag"
            onClick={() => navigate(`${ROUTES.AUTH.FIND_ACCOUNT}?tab=password`)}
          />
          <span className="text-gray-20">|</span>
          <TextButton
            label="회원가입"
            variant="main"
            className="typo-tag"
            onClick={() => navigate(ROUTES.AUTH.SIGNUP.TERMS)}
          />
        </div>
      </div>
    </form>
  );
};
