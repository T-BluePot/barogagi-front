type Props = {};

export default function EmailLoginPage({}: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">이메일 로그인</h1>
      <p className="text-gray-600 mb-6">
        이메일과 비밀번호를 입력하여 로그인하세요.
      </p>
      {/* 여기에 이메일 로그인 폼 컴포넌트를 추가할 수 있습니다. */}
    </div>
  );
}
