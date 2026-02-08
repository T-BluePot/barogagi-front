import { PageTitle } from "@/components/auth/common/PageTitle";
import { LoginForm } from "@/components/auth/signin/LoginForm";

export default function LoginPage() {
  return (
    <div className=" flex flex-col items-center justify-between p-4">
      <div className="flex flex-col items-start w-full mb-8">
        <PageTitle
          title="아이디로 로그인"
          subTitle="아이디와 비밀번호를 입력하면 로그인할 수 있어요."
        />
      </div>
      <LoginForm />
    </div>
  );
}
