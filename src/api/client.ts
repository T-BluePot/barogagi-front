/**
 * Axios 클라이언트 인스턴스
 * - baseURL, timeout 등 기본 설정만 포함
 * - 인터셉터 로직은 http.ts에서 별도 관리
 */

import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./endpoints";

const axiosConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// 일반 API 요청 인스턴스: 인증이 필요 없는 요청에서 사용
export const http: AxiosInstance = axios.create(axiosConfig);
// API-KEY 전용 인스턴스: 인증이 필요한 요청에서 사용
export const apiKeyHttp: AxiosInstance = axios.create(axiosConfig);
// 토큰 갱신(refresh) 전용 인스턴스: 인터셉터에서 토큰 갱신 요청 시 사용
export const refreshHttp: AxiosInstance = axios.create(axiosConfig);
