import type { AuthTokenBundle } from "@/types/tokenTypes";

export const saveAuthTokens = (bundle: AuthTokenBundle) => {
  const now = Date.now();

  localStorage.setItem("accessToken", bundle.accessToken);
  // 서버에서 내려준 accessTokenExpiresIn(초 단위 남은 유효 시간)을
  // 현재 시각(Date.now()) 기준의 "만료 시각(timestamp)"으로 변환하여 저장
  localStorage.setItem(
    "accessTokenExpiry",
    String(now + bundle.accessTokenExpiresIn * 1000)
  );
  localStorage.setItem("refreshToken", bundle.refreshToken);
  localStorage.setItem(
    "refreshTokenExpiry",
    String(now + bundle.refreshTokenExpiresIn * 1000)
  );
};
