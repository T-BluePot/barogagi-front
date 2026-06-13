import { SnsButtonsGroup } from "@/components/common/buttons/SnsButtonsGroup";
import { LoginButton } from "../signin/LoginButton";
import { getOAuthLink } from "@/api/queries/authQueries";
import type { OAuthProviderType } from "@/api/queries/authQueries";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { startOAuthLogin } from "@/utils/auth/startOAuthLogin";
import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export default function LoginButtonSection() {
  const openAlertModal = useAlertModalStore((s) => s.openAlertModal);
  const navigate = useNavigate();

  /**
   * OAuth 링크 API 호출 후 로그인 시작.
   * - 네이티브 앱: 인앱 Custom Tab으로 열고, 돌아온 콜백 파라미터를 콜백 페이지가 처리하도록 위임
   * - 브라우저: 표준 리다이렉트(헬퍼 내부에서 처리, 페이지 이탈)
   */
  const handleOAuthLogin = async (type: OAuthProviderType) => {
    try {
      const response = await getOAuthLink(type);
      const search = await startOAuthLogin(response.data);
      // null = 브라우저 리다이렉트(페이지 이탈) 또는 사용자가 Custom Tab을 닫음 → 더 할 일 없음
      if (search === null) return;
      // 네이티브: 받은 콜백 파라미터를 기존 OAuth 콜백 페이지가 처리(토큰 저장·분기)
      navigate(`${ROUTES.AUTH.OAUTH_CALLBACK}${search}`, { replace: true });
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
