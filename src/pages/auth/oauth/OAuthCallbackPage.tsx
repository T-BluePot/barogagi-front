import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { saveAuthTokens } from "@/lib/auth/tokenStorage";
import { ROUTES } from "@/constants/routes";
import { useAlertModalStore } from "@/stores/alertModalStore";

/**
 * OAuth 소셜 로그인 콜백 페이지
 * 백엔드 OAuth2 인증 성공 후 리다이렉트되는 페이지로,
 * URL 쿼리 파라미터에서 토큰 정보를 추출하여 localStorage에 저장한 뒤 홈으로 이동합니다.
 *
 * 성공: /auth/oauth/callback?accessToken=...&refreshToken=...&accessTokenExpiresIn=...&refreshTokenExpiresIn=...
 * 실패: /auth/oauth/callback?error=ERROR_CODE&message=에러+메시지
 */
export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const openAlertModal = useAlertModalStore((s) => s.openAlertModal);

  useEffect(() => {
    // 에러 파라미터가 있으면 실패 처리
    const error = searchParams.get("error");
    if (error) {
      const message =
        searchParams.get("message") || "소셜 로그인에 실패했습니다.";

      console.error("[OAuth] 소셜 로그인 실패:", error, message);

      openAlertModal(
        { title: "로그인 실패", content: message },
        () => navigate(ROUTES.AUTH.LANDING, { replace: true })
      );
      return;
    }

    // 토큰 파라미터 추출
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const accessTokenExpiresIn = searchParams.get("accessTokenExpiresIn");
    const refreshTokenExpiresIn = searchParams.get("refreshTokenExpiresIn");

    if (accessToken && refreshToken && accessTokenExpiresIn && refreshTokenExpiresIn) {
      console.log("[OAuth] 소셜 로그인 성공");
      console.log("[OAuth] accessToken:", accessToken.slice(0, 20) + "...");
      console.log("[OAuth] refreshToken:", refreshToken.slice(0, 20) + "...");
      console.log("[OAuth] accessTokenExpiresIn:", accessTokenExpiresIn, "초");
      console.log("[OAuth] refreshTokenExpiresIn:", refreshTokenExpiresIn, "초");

      saveAuthTokens({
        accessToken,
        accessTokenExpiresIn: Number(accessTokenExpiresIn),
        refreshToken,
        refreshTokenExpiresIn: Number(refreshTokenExpiresIn),
      });

      openAlertModal(
        { title: "로그인 성공", content: "소셜 로그인이 완료되었습니다." },
        () => navigate(ROUTES.MAIN.HOME, { replace: true })
      );
    } else {
      console.error("[OAuth] 토큰 정보 누락:", { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn });
      // 토큰 정보가 불완전한 경우
      openAlertModal(
        { title: "로그인 실패", content: "인증 정보가 올바르지 않습니다.\n다시 시도해주세요." },
        () => navigate(ROUTES.AUTH.LANDING, { replace: true })
      );
    }
  }, [searchParams, navigate, openAlertModal]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="typo-body text-gray-500">로그인 처리 중...</p>
    </div>
  );
}
