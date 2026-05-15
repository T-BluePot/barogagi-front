import type { AuthTokenBundle } from "@/types/tokenTypes";
import { getPersistStorage } from "@/utils/bridgeStorage";

/**
 * 인증 토큰 in-memory cache.
 *
 * - 동기적으로 토큰을 읽어야 하는 axios 인터셉터/라우트 가드를 위해 메모리 캐시 유지.
 * - 영속 저장소(secure namespace)와 양방향 동기화:
 *   - 부팅 시 bootstrapTokens()로 영속 저장소 → 캐시 hydration
 *   - 저장 시 setAuthTokens()로 캐시 + 영속 저장소 동시 갱신
 *   - 삭제 시 clearAuthTokens()로 캐시 + 영속 저장소 동시 삭제
 *
 * RN 앱(WebView): secure namespace = EncryptedSharedPreferences (네이티브 보안 저장소)
 * 브라우저:        secure namespace = localStorage (보안 미보장 — 브라우저 환경 한계)
 *
 * 참고: docs/RN_BRIDGE.md §1
 */

interface TokenCache {
  accessToken: string;
  accessTokenExpiry: number;
  refreshToken: string;
  refreshTokenExpiry: number;
}

const STORAGE_KEYS = {
  accessToken: "accessToken",
  accessTokenExpiry: "accessTokenExpiry",
  refreshToken: "refreshToken",
  refreshTokenExpiry: "refreshTokenExpiry",
} as const;

let cache: TokenCache | null = null;

const storage = () => getPersistStorage("secure");

// === 동기 read API (axios 인터셉터/라우트 가드용) ===

export const getAccessToken = (): string | null => cache?.accessToken ?? null;
export const getRefreshToken = (): string | null => cache?.refreshToken ?? null;
export const isLoggedIn = (): boolean => !!cache?.accessToken;

// === async write/clear API ===

/** 로그인/refresh 응답으로 받은 토큰을 캐시 + 영속 저장소에 저장 */
export const setAuthTokens = async (
  bundle: AuthTokenBundle
): Promise<void> => {
  const now = Date.now();
  const next: TokenCache = {
    accessToken: bundle.accessToken,
    refreshToken: bundle.refreshToken,
    // 서버가 내려준 남은 유효 시간(초)을 절대 만료 시각(timestamp)으로 변환
    accessTokenExpiry: now + bundle.accessTokenExpiresIn * 1000,
    refreshTokenExpiry: now + bundle.refreshTokenExpiresIn * 1000,
  };
  cache = next;
  const s = storage();
  await Promise.all([
    s.setItem(STORAGE_KEYS.accessToken, next.accessToken),
    s.setItem(STORAGE_KEYS.refreshToken, next.refreshToken),
    s.setItem(STORAGE_KEYS.accessTokenExpiry, String(next.accessTokenExpiry)),
    s.setItem(STORAGE_KEYS.refreshTokenExpiry, String(next.refreshTokenExpiry)),
  ]);
};

/** 모든 토큰 제거 (로그아웃) */
export const clearAuthTokens = async (): Promise<void> => {
  cache = null;
  const s = storage();
  await Promise.all([
    s.removeItem(STORAGE_KEYS.accessToken),
    s.removeItem(STORAGE_KEYS.refreshToken),
    s.removeItem(STORAGE_KEYS.accessTokenExpiry),
    s.removeItem(STORAGE_KEYS.refreshTokenExpiry),
  ]);
};

/**
 * 앱 부팅 시 1회 호출. 영속 저장소에서 토큰을 읽어 메모리 캐시에 hydration.
 * - main.tsx에서 createRoot 호출 전에 await 권장 (라우트 가드가 hydration된 cache를 동기 read해야 하므로)
 * - 실패 시 빈 cache로 시작 (= 로그인 안 된 상태)
 */
export const bootstrapTokens = async (): Promise<void> => {
  const s = storage();
  try {
    const [accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry] =
      await Promise.all([
        s.getItem(STORAGE_KEYS.accessToken),
        s.getItem(STORAGE_KEYS.refreshToken),
        s.getItem(STORAGE_KEYS.accessTokenExpiry),
        s.getItem(STORAGE_KEYS.refreshTokenExpiry),
      ]);
    if (accessToken && refreshToken) {
      cache = {
        accessToken,
        refreshToken,
        accessTokenExpiry: Number(accessTokenExpiry) || 0,
        refreshTokenExpiry: Number(refreshTokenExpiry) || 0,
      };
    }
  } catch (err) {
    console.error("[tokenCache] bootstrap failed", err);
  }
};
