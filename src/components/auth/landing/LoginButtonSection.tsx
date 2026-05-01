import { SnsButtonsGroup } from "@/components/common/buttons/SnsButtonsGroup";
import { LoginButton } from "../signin/LoginButton";
import { getOAuthLink } from "@/api/queries/authQueries";
import type { OAuthProviderType } from "@/api/queries/authQueries";

export default function LoginButtonSection() {
  /** OAuth 링크 API 호출 후 해당 URL로 리다이렉트 */
  const handleOAuthLogin = async (type: OAuthProviderType) => {
    try {
      const response = await getOAuthLink(type);
      window.location.href = response.data;
    } catch (error) {
      console.error("[OAuth] 링크 조회 실패:", error);
    }
  };

  return (
    <div className="mb-8">
      <SnsButtonsGroup
        onNaverClick={() => handleOAuthLogin("Naver")}
        onKakaoClick={() => handleOAuthLogin("Kakao")}
        onGoogleClick={() => handleOAuthLogin("Google")}
      />
      <LoginButton />
    </div>
  );
}
