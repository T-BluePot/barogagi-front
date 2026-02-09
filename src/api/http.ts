/**
 * Axios 인스턴스 설정
 * - baseURL, timeout 등 기본 설정
 * - Request 인터셉터: Authorization 헤더에 토큰 자동 삽입
 * - Response 인터셉터: 401 에러 시 로그인 페이지 리다이렉트
 */

import type { AxiosRequestConfig, AxiosError } from "axios";
import { ENDPOINTS } from "./endpoints";

import { http } from "./client";

// === token ===
import { refresh } from "./queries";
import { saveAuthTokens } from "@/lib/auth/tokenStorage";
import { handleLogout } from "@/utils/auth/handleLogout";

// 요청 인터셉터: Authorization 헤더에 토큰 자동 삽입
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let refreshInFlight: Promise<string> | null = null;

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // auth 요청 제외: 무한루프 방지
    const authEndpoints = Object.values(ENDPOINTS.AUTH);
    const isAuthRequest = authEndpoints.some(
      (endpoint) =>
        originalRequest.url === endpoint ||
        originalRequest.url?.startsWith(endpoint + "?")
    );
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
      // refreshToken은 refresh 실행 전에 확인
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) {
        throw new Error("refreshToken이 없습니다.");
      }

      // 동시에 여러 401이 와도 refresh는 단 1번만 실행
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
          // 성공/실패와 관계없이 잠금 해제
          refreshInFlight = null;
        });
      }

      // 이미 실행 중인 refresh가 있으면 그 결과를 기다렸다가 동일 토큰 사용
      const newAccessToken = await refreshInFlight;

      // 원요청에 새 토큰 주입 후 재시도
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return http(originalRequest);
    } catch (e) {
      // refresh 실패 시에도 항상 동일한 로그아웃 정리
      handleLogout();
      return Promise.reject(e);
    }
  }
);
