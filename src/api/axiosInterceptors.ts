/**
 * axiosInterceptors.ts
 * - 인스턴스별로 공통 인터셉터를 주입(apply)하는 유틸
 * - refreshInFlight를 모듈 스코프에 두어 모든 인스턴스가 공유
 */

import type { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { ENDPOINTS } from "./endpoints";

import { refresh } from "./queries";
import { saveAuthTokens } from "@/lib/auth/tokenStorage";
import { getAccessToken, getRefreshToken } from "@/lib/auth/tokenCache";
import { handleLogout } from "@/utils/auth/handleLogout";

let refreshInFlight: Promise<string> | null = null;

type RetriableRequestConfig = AxiosRequestConfig & { _retry?: boolean };

export function applyAuthInterceptors(instance: AxiosInstance) {
  // Request: accessToken 자동 주입
  instance.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response: 401이면 refresh 후 재시도
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalRequest = error.config as
        | RetriableRequestConfig
        | undefined;

      if (status !== 401 || !originalRequest) {
        return Promise.reject(error);
      }

      // auth 요청 제외(무한루프 방지)
      // 주의: originalRequest.url이 baseURL 제외한 path일 수도, 전체 URL일 수도 있음
      const authEndpoints = Object.values(ENDPOINTS.AUTH);

      const url = originalRequest.url ?? "";
      const isAuthRequest = authEndpoints.some((endpoint) => {
        // endpoint가 "/api/v1/auth/login" 같은 path라고 가정
        return (
          url === endpoint ||
          url.startsWith(endpoint + "?") ||
          url.includes(endpoint)
        );
      });

      if (isAuthRequest) {
        return Promise.reject(error);
      }

      // 같은 요청은 1번만 재시도
      if (originalRequest._retry) {
        handleLogout();
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        const storedRefreshToken = getRefreshToken();
        if (!storedRefreshToken) {
          throw new Error("refreshToken이 없습니다.");
        }

        // 동시에 여러 401 -> refresh 1회만
        if (!refreshInFlight) {
          refreshInFlight = (async () => {
            const refreshData = await refresh({
              refreshToken: storedRefreshToken,
            });
            const tokenBundle = refreshData.data;

            if (!tokenBundle?.accessToken) {
              throw new Error("refresh 응답에 accessToken이 없습니다.");
            }

            saveAuthTokens(tokenBundle);
            return tokenBundle.accessToken;
          })().finally(() => {
            refreshInFlight = null;
          });
        }

        const newAccessToken = await refreshInFlight;

        // 원요청에 새 토큰 주입
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 중요: "그 인스턴스"로 재시도 (http 고정 X)
        return instance(originalRequest);
      } catch (e) {
        handleLogout();
        return Promise.reject(e);
      }
    }
  );
}
