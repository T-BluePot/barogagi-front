import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { saveAuthTokens } from "@/lib/auth/tokenStorage";
import { ROUTES } from "@/constants/routes";
import { useAlertModalStore } from "@/stores/alertModalStore";

/**
 * OAuth 소셜 로그인 콜백 페이지
 * 백엔드 OAuth2 인증 후 리다이렉트되는 중간 페이지로, 토큰 처리 후 즉시 이동합니다.
 * 모달은 이동한 페이지(랜딩/홈) 위에서 표시됩니다.
 *
 * 성공(기존 회원): 토큰 저장 → 홈 이동 → 성공 모달
 * 성공(신규 회원): 토큰 저장 → 프로필 설정 페이지 이동
 * 실패: 랜딩 이동 → 실패 모달
 */
export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const openAlertModal = useAlertModalStore((s) => s.openAlertModal);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const accessTokenExpiresIn = searchParams.get("accessTokenExpiresIn");
    const refreshTokenExpiresIn = searchParams.get("refreshTokenExpiresIn");

    // 토큰이 없으면 실패 → 랜딩으로 이동 후 에러 모달
    if (!accessToken || !refreshToken || !accessTokenExpiresIn || !refreshTokenExpiresIn) {
      const message = searchParams.get("message") || "소셜 로그인에 실패했습니다.";
      console.error("[OAuth] 소셜 로그인 실패:", searchParams.get("resultCode"), message);

      navigate(ROUTES.AUTH.LANDING, { replace: true });
      openAlertModal({ title: "로그인 실패", content: message });
      return;
    }

    // 토큰 저장
    saveAuthTokens({
      accessToken,
      accessTokenExpiresIn: Number(accessTokenExpiresIn),
      refreshToken,
      refreshTokenExpiresIn: Number(refreshTokenExpiresIn),
    });

    // 신규/기존 회원 분기
    const nicknameYn = searchParams.get("nicknameYn");
    const nickname = searchParams.get("nickname");
    const isNewUser = nicknameYn === "N" || !nickname;

    console.log("[OAuth] 인증 성공 — 신규회원:", isNewUser);

    if (isNewUser) {
      navigate(ROUTES.AUTH.OAUTH_PROFILE, { replace: true });
    } else {
      navigate(ROUTES.MAIN.HOME, { replace: true });
    }
  }, [searchParams, navigate, openAlertModal]);

  return null;
}
