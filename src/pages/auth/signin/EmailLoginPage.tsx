import { EmailLoginForm } from "@/components/auth/signin/EmailLoginForm";


export default function EmailLoginPage() {
  return (
    <div className=" flex flex-col items-center justify-between p-4">
      <div className="flex flex-col items-start w-full mb-8">
        <h1 className="typo-header text-gray-white text-left">이메일 로그인</h1>
        <p className="text-gray-600 mb-6">
          이메일과 비밀번호를 입력하여 로그인하세요.
        </p>
      </div>
      <EmailLoginForm />
    </div>
  );
}
