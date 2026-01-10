import { useState } from "react";
import { CommonInput } from "@/components/auth/common/CommonInput";
import CommonButton from "@/components/common/buttons/CommonButton";
import TextButton from "@/components/common/buttons/TextButton";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export const EmailLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    // 에러 초기화
    setError(null);

    // 입력값 검증
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    // 비밀번호 최소 길이 검증
    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    try {
      setIsLoading(true);
      console.log("로그인 시도:", { email, password: "***" }); // 보안: 비밀번호 로깅 방지

      // TODO: API 통합 시 실제 인증 로직으로 교체
      // const response = await loginAPI({ email, password });
      // if (!response.success) {
      //   throw new Error(response.message);
      // }

      // Mock: 임시 인증 시뮬레이션 (개발 중)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: 임시 실패 케이스 시뮬레이션 (테스트용)
      // 실제 배포 시에는 제거 필요
      if (email === "fail@test.com") {
        throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
      }

      // 로그인 성공 시에만 홈으로 이동
      console.log("로그인 성공");
      navigate(ROUTES.MAIN.HOME);
    } catch (err) {
      // 에러 처리
      const errorMessage =
        err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError(errorMessage);
      console.error("로그인 실패:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin();
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
        label="이메일"
        placeholder="이메일을 입력하세요"
        type="email"
        value={email}
        setValue={setEmail}
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
          label={isLoading ? "로그인 중..." : "로그인 하기"}
          onClick={handleLogin}
          isDisabled={isLoading || !email || !password}
        />
        <div className="flex justify-center items-center mt-4 text-main text-sm">
          <TextButton
            label="아이디 찾기"
            variant="main"
            className="typo-tag"
            onClick={() => navigate(`${ROUTES.AUTH.FIND_ACCOUNT}?tab=id`)}
          />
          <span className="text-white">|</span>
          <TextButton
            label="비밀번호 재설정"
            variant="main"
            className="typo-tag"
            onClick={() => navigate(`${ROUTES.AUTH.FIND_ACCOUNT}?tab=password`)}
          />
          <span className="text-white">|</span>
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
