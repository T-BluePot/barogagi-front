import { SnsButtonsGroup } from "@/components/common/buttons/SnsButtonsGroup";
import { LoginButton } from "../signin/LoginButton";

export default function LoginButtonSection() {
  return (
    <div className="mb-8">
      <SnsButtonsGroup
        onNaverClick={() => console.log("네이버 로그인 클릭")}
        onKakaoClick={() => console.log("카카오 로그인 클릭")}
        onGoogleClick={() => console.log("구글 로그인 클릭")}
      />
      <LoginButton />
    </div>
  );
}
