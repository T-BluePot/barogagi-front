/**
 * Axios 인스턴스 설정
 * - baseURL, timeout 등 기본 설정
 * - Request 인터셉터: Authorization 헤더에 토큰 자동 삽입
 * - Response 인터셉터: 401 에러 시 로그인 페이지 리다이렉트
 */

import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { API_BASE_URL, ENDPOINTS } from "./endpoints";

import { refresh } from "./queries";

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

    // 원래 실패했던 요청 설정(axios가 들고 있음)
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401이 아니면 그대로 반환
    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // refresh 요청 자체가 401이면 더 시도하지 말고 로그인 처리
    // (실수로 http로 refresh를 보냈을 때도 안전장치가 됨)
    if (originalRequest.url?.includes(ENDPOINTS.AUTH.REFRESH)) {
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/login";
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
      // refresh 요청에 필요한 데이터 구성 (프로젝트 스펙에 맞게 조립)
      // 예: refreshToken을 로컬스토리지에 저장했다면 여기서 꺼내기
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("refreshToken이 없습니다.");
      }

      // 1) 토큰 재발급
      const refreshRes = await refresh({ refreshToken });

      // 2) 새 accessToken 저장 (응답 구조에 맞게 키 수정)
      const newAccessToken = refreshRes.data.accessToken;
      if (!newAccessToken) {
        throw new Error("refresh 응답에 accessToken이 없습니다.");
      }
      localStorage.setItem("accessToken", newAccessToken);

      // 3) 원요청 헤더에 새 토큰을 넣고 재요청
      originalRequest.headers = {
        ...(originalRequest.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      };

      return http(originalRequest);
    } catch (e) {
      // refresh 실패 → 로그인 이동
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/login";
      return Promise.reject(e);
    }
  }
);
