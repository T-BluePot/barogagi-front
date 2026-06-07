import { Routes, Route } from "react-router-dom";
import GuestRoute from "@/components/route/GuestRoute";
import AuthLandingPage from "@/pages/auth/AuthLandingPage";

/* auth/signup 로직 */
import TermsPage from "@/pages/auth/signup/TermsPage";
import CredentialsPage from "@/pages/auth/signup/CredentialsPage";
/* use shared verify code page */
import VerifyCodePage from "@/pages/auth/verify/VerifyCodePage";
import ProfilePage from "@/pages/auth/signup/ProfilePage";
import SignupCompletePage from "@/pages/auth/signup/SignupCompletePage";

/* auth/signin 로직 */
import LoginPage from "@/pages/auth/signin/LoginPage";

/* OAuth 소셜 로그인 */
import OAuthCallbackPage from "@/pages/auth/oauth/OAuthCallbackPage";
import OAuthProfilePage from "@/pages/auth/oauth/OAuthProfilePage";

/* auth/find 로직 */
import AccountFindPage from "@/pages/auth/find/AccountFindPage";
import FindIdResultPage from "@/pages/auth/find/FindIdResultPage";
import FindPwResetPage from "@/pages/auth/find/FindPwResetPage";

/* unified verify page */
import VerifyPage from "@/pages/auth/verify/VerifyPage";

/**
 * /auth 라우트
 *
 * 가드 정책: 토큰 생성 경로(/oauth/callback, /oauth/profile)만 GuestRoute 밖에 두고,
 * 그 외 모든 /auth 라우트는 GuestRoute로 감싼다.
 * - /oauth/callback: 렌더 중 토큰을 저장하는 경로 → 가드가 잔존 토큰으로 콜백 처리 전 튕기면 안 되므로 제외
 * - /oauth/profile: OAuth 신규회원이 토큰을 든 중간 상태(updateMe 인증 호출)로 머무는 경로 → 제외
 * - 나머지 /auth(로그인/회원가입/계정찾기/인증)는 전 구간 토큰 없이 진행되므로,
 *   정상 플로우에선 GuestRoute가 항상 Outlet을 렌더(동작 변화 없음). 로그인 상태의 비정상 진입만 홈으로 차단.
 *
 * 향후 /auth 하위 라우트가 추가되면 기본적으로 가드 안(GuestRoute)으로 들어간다.
 * 토큰 보유 중간 상태 경로를 새로 추가할 때만 가드 밖(예외)에 명시할 것.
 */
export const AuthRoutes = () => (
  <Routes>
    {/* 예외: 토큰 보유/저장 중간 상태 — 가드 밖 */}
    <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
    <Route path="/oauth/profile" element={<OAuthProfilePage />} />

    {/* 그 외 /auth 전부 게스트 전용 (로그인 상태면 홈으로) */}
    <Route element={<GuestRoute />}>
      <Route path="/" element={<AuthLandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 회원가입 */}
      <Route path="/signup" element={<TermsPage />} />
      <Route path="/signup/credentials" element={<CredentialsPage />} />
      <Route path="/signup/profile" element={<ProfilePage />} />
      <Route path="/signup/complete" element={<SignupCompletePage />} />

      {/* 계정 찾기 */}
      <Route path="/find" element={<AccountFindPage />} />
      <Route path="/find/result" element={<FindIdResultPage />} />
      <Route path="/find/reset-password" element={<FindPwResetPage />} />

      {/* 휴대폰 인증 (flow: signup-verify / find-id / reset-password) */}
      <Route path="/verify/:flow" element={<VerifyPage />} />
      <Route path="/verify/:flow/code" element={<VerifyCodePage />} />
    </Route>
  </Routes>
);
