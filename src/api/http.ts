/**
 * Axios 인스턴스 설정
 * - baseURL, timeout 등 기본 설정
 * - Request 인터셉터: Authorization 헤더에 토큰 자동 삽입
 * - Response 인터셉터: 401 에러 시 로그인 페이지 리다이렉트
 */

import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { API_BASE_URL } from "./endpoints";

const axiosConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const http: AxiosInstance = axios.create(axiosConfig);

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

// 응답 인터셉터: 401 에러 시 로그인 페이지 리다이렉트
http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);
