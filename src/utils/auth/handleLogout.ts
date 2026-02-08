/** 로그아웃 처리: 모든 토큰 제거 및 로그인 페이지 이동 */
export const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("accessTokenExpiry");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("refreshTokenExpiry");
  window.location.href = "/auth/login";
};
