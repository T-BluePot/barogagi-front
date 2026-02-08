/**
 * Axios 인스턴스 설정
 * - baseURL, timeout 등 기본 설정
 * - Request 인터셉터: Authorization 헤더에 토큰 자동 삽입
 * - Response 인터셉터: 401 에러 시 로그인 페이지 리다이렉트
 */

import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { API_BASE_URL, ENDPOINTS } from "./endpoints";

// === token ===
import { refresh } from "./queries";
import { saveAuthTokens } from "@/lib/auth/tokenStorage";
import { handleLogout } from "@/utils/auth/handleLogout";

const axiosConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const http: AxiosInstance = axios.create(axiosConfig);
export const refreshHttp: AxiosInstance = axios.create(axiosConfig);

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

// 응답 인터셉터: 401이면 refresh → 원요청 재시도(1회), 실패 시 로그인 이동
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401이 아니거나 originalRequest가 없으면 그대로 반환
    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // auth 내 요청 시 제외
    const authEndpoints = Object.values(ENDPOINTS.AUTH);
    const isAuthRequest = authEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    if (isAuthRequest) {
      return Promise.reject(error);
    }

    // 무한 재시도 방지: 같은 요청은 refresh를 1번만 시도
    if (originalRequest._retry) {
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      // refreshToken 확인
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) {
        throw new Error("refreshToken이 없습니다.");
      }

      // 1) 토큰 재발급
      const refreshData = await refresh({
        refreshToken: storedRefreshToken,
      });

      const tokenBundle = refreshData.data;
      if (!tokenBundle.accessToken) {
        throw new Error("refresh 응답에 accessToken이 없습니다.");
      }

      saveAuthTokens(tokenBundle);

      // 3) 원요청 헤더에 새 토큰을 넣고 재요청
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${tokenBundle.accessToken}`;
      }

      return http(originalRequest);
    } catch (e) {
      // refresh 실패 → 로그아웃 처리
      handleLogout();
      return Promise.reject(e);
    }
  }
);
