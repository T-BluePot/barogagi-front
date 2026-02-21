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

// 공통(토큰 주입 + 401 refresh 재시도) 적용
applyAuthInterceptors(http);
applyAuthInterceptors(apiKeyHttp);

// apiKeyHttp 전용: API-KEY만 추가
apiKeyHttp.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};
    config.headers["API-KEY"] = getApiKey();
    return config;
  },
  (error) => Promise.reject(error)
);
