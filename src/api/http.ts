/**
 * Axios 인터셉터 초기화 파일
 *
 * 역할:
 * - http, apiKeyHttp 인스턴스에 공통 인증 인터셉터 적용
 * - accessToken 자동 주입 (Request)
 * - 401 발생 시 refresh 토큰으로 자동 갱신 후 재요청 (Response)
 * - apiKeyHttp 전용 API-KEY 헤더 추가
 *
 * 주의:
 * - 실제 인터셉터 로직은 axiosInterceptors.ts에 정의되어 있음
 * - 이 파일은 앱 시작 시 1회 import 되어야 인터셉터가 등록됨
 */

import { http, apiKeyHttp } from "./client";
import { getApiKey } from "./apiKey";
import { applyAuthInterceptors } from "./axiosInterceptors";

import { http, apiKeyHttp } from "./client";
import { getApiKey } from "./apiKey";

// apiKeyHttp 전용: API-KEY만 추가
apiKeyHttp.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};
    config.headers["API-KEY"] = getApiKey();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API-KEY 전용 인스턴트: 모든 요청에 API-KEY 헤더 자동 삽입
apiKeyHttp.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};

    // API 키
    config.headers["API-KEY"] = getApiKey();

    // 토큰(있으면)도 같이
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
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
