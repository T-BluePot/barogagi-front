import { SnsButtonsGroup } from "@/components/common/buttons/SnsButtonsGroup";
import { LoginButton } from "../signin/LoginButton";
import { API_BASE_URL } from "@/api/endpoints";

/** 백엔드 Spring Security OAuth2 인가 요청 URL */
const OAUTH_URL = {
  NAVER: `${API_BASE_URL}/oauth2/authorization/naver`,
  KAKAO: `${API_BASE_URL}/oauth2/authorization/kakao`,
  GOOGLE: `${API_BASE_URL}/oauth2/authorization/google`,
} as const;

export default function LoginButtonSection() {
  const handleOAuthLogin = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="mb-8">
      <SnsButtonsGroup
        onNaverClick={() => handleOAuthLogin(OAUTH_URL.NAVER)}
        onKakaoClick={() => handleOAuthLogin(OAUTH_URL.KAKAO)}
        onGoogleClick={() => handleOAuthLogin(OAUTH_URL.GOOGLE)}
      />
      <LoginButton />
    </div>
  );
}
