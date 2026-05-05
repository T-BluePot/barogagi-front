import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { saveAuthTokens } from "@/lib/auth/tokenStorage";
import { ROUTES } from "@/constants/routes";
import { useAlertModalStore } from "@/stores/alertModalStore";

/**
 * OAuth 소셜 로그인 콜백 페이지
 * 백엔드 OAuth2 인증 성공 후 리다이렉트되는 페이지로,
 * URL 쿼리 파라미터에서 토큰 정보를 추출하여 localStorage에 저장합니다.
 *
 * 성공(기존 회원): ...&nicknameYn=Y&nickname=xxx → 홈으로 이동
 * 성공(신규 회원): ...&nicknameYn=N → 닉네임 설정 페이지로 이동
 * 실패: ?resultCode=ERROR_CODE&message=에러+메시지 (토큰 없음)
 */
export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const openAlertModal = useAlertModalStore((s) => s.openAlertModal);

  useEffect(() => {
    // 토큰 파라미터 추출
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const accessTokenExpiresIn = searchParams.get("accessTokenExpiresIn");
    const refreshTokenExpiresIn = searchParams.get("refreshTokenExpiresIn");

    // 토큰이 없으면 실패 처리
    if (!accessToken || !refreshToken || !accessTokenExpiresIn || !refreshTokenExpiresIn) {
      const message =
        searchParams.get("message") || "소셜 로그인에 실패했습니다.";
      const resultCode = searchParams.get("resultCode");

      console.error("[OAuth] 소셜 로그인 실패:", resultCode, message);

      openAlertModal(
        { title: "로그인 실패", content: message },
        () => navigate(ROUTES.AUTH.LANDING, { replace: true })
      );
      return;
    }

    // 토큰 저장
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

    // 신규/기존 회원 분기
    const nicknameYn = searchParams.get("nicknameYn");
    const nickname = searchParams.get("nickname");

    if (nicknameYn === "N" || !nickname) {
      // 신규 회원: 닉네임 미설정 → 닉네임 입력 페이지로
      console.log("[OAuth] 신규 회원 — 닉네임 설정 필요");
      navigate(ROUTES.AUTH.OAUTH_PROFILE, { replace: true });
    } else {
      // 기존 회원: 닉네임 있음 → 홈으로
      console.log("[OAuth] 기존 회원 — nickname:", nickname);
      openAlertModal(
        { title: "로그인 성공", content: "소셜 로그인이 완료되었습니다." },
        () => navigate(ROUTES.MAIN.HOME, { replace: true })
      );
    }
  }, [searchParams, navigate, openAlertModal]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="typo-body text-gray-500">로그인 처리 중...</p>
    </div>
  );
}
