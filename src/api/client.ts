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

export const http: AxiosInstance = axios.create(axiosConfig);
export const refreshHttp: AxiosInstance = axios.create(axiosConfig);
