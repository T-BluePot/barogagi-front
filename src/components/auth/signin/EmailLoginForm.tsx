import { useState } from "react";
import { CommonInput } from "@/components/auth/common/CommonInput";
import CommonButton from "@/components/common/buttons/CommonButton";
import TextButton from "@/components/common/buttons/TextButton";
import { useNavigate } from "react-router-dom";
export const EmailLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <form className="">
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
          label="로그인 하기"
          onClick={() => {
            // 로그인 로직
          }}
        />
        <div className="flex justify-center items-center mt-4 text-main text-sm">
          <TextButton
            label="아이디 찾기"
            variant="main"
            className="typo-tag"
            onClick={() => navigate("/auth/find/id")}
          />
          <span className="text-white">|</span>
          <TextButton
            label="비밀번호 재설정"
            variant="main"
            className="typo-tag"
            onClick={() => navigate("/auth/find/password")}
          />
          <span className="text-white">|</span>
          <TextButton
            label="회원가입"
            variant="main"
            className="typo-tag"
            onClick={() => navigate("/auth/signup")}
          />
        </div>
      </div>
    </form>
  );
};
