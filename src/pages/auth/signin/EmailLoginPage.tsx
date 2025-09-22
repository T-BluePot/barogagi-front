import { PageTitle } from "@/components/auth/common/PageTitle";
import { EmailLoginForm } from "@/components/auth/signin/EmailLoginForm";

export default function EmailLoginPage() {
  return (
    <div className=" flex flex-col items-center justify-between p-4">
      <div className="flex flex-col items-start w-full mb-8">
        <PageTitle
          title="이메일로 로그인"
          subTitle="이메일과 비밀번호를 입력하여 로그인하세요."
        />
      </div>
      <EmailLoginForm />
    </div>
  );
}
