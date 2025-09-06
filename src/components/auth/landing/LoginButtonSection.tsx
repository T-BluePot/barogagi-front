import { SnsButtonsGroup } from "@/components/common/buttons/SnsButtonsGroup";
import { EmailLoginButton } from "../signin/EmailLoginButton";

type Props = {};

export default function LoginButtonSection({}: Props) {
  return (
    <div className="mb-8">
      <SnsButtonsGroup
        onNaverClick={() => console.log("네이버 로그인 클릭")}
        onKakaoClick={() => console.log("카카오 로그인 클릭")}
        onGoogleClick={() => console.log("구글 로그인 클릭")}
      />
      <EmailLoginButton />
    </div>
  );
}
