import { SnsButtonsGroup } from "@/components/common/buttons/SnsButtonsGroup";
import { LoginButton } from "../signin/LoginButton";
import { getOAuthLink } from "@/api/queries/authQueries";
import type { OAuthProviderType } from "@/api/queries/authQueries";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { AxiosError } from "axios";

export default function LoginButtonSection() {
  const openAlertModal = useAlertModalStore((s) => s.openAlertModal);

  /** OAuth 링크 API 호출 후 해당 URL로 리다이렉트 */
  const handleOAuthLogin = async (type: OAuthProviderType) => {
    try {
      const response = await getOAuthLink(type);
      window.location.href = response.data;
    } catch (error) {
      console.error("[OAuth] 링크 조회 실패:", error);

      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || "소셜 로그인 연결에 실패했습니다."
          : "소셜 로그인 연결에 실패했습니다.";

      openAlertModal({ title: "로그인 오류", content: message });
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
