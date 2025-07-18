import TextButton from "@/components/common/buttons/TextButton";

type Props = {
  onClick?: () => void;
};

export const EmailLoginButton = ({ onClick }: Props) => {
  return (
    <div className="text-center pt-3">
      <TextButton
        label="이메일로 로그인하기"
        variant="main-underline"
        onClick={onClick}
      />
    </div>
  );
};
