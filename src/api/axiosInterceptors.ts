/**
 * axiosInterceptors.ts
 * - 인스턴스별로 공통 인터셉터를 주입(apply)하는 유틸
 * - refreshInFlight를 모듈 스코프에 두어 모든 인스턴스가 공유
 * - 심각 오류(5xx / 설정 오류 / 네트워크)를 전역 오류 화면으로 승격
 */

import axios from "axios";
import type { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { ENDPOINTS } from "./endpoints";

import { refresh } from "./queries";
import { saveAuthTokens } from "@/lib/auth/tokenStorage";
import { getAccessToken, getRefreshToken } from "@/lib/auth/tokenCache";
import { handleLogout } from "@/utils/auth/handleLogout";
import { API_ERROR_CODE } from "@/constants/apiErrorCodes";
import { useCriticalErrorStore } from "@/stores/criticalErrorStore";
import {
  classifyApiError,
  isGlobalErrorKind,
  readApiErrorCode,
} from "@/utils/api/classifyApiError";

declare module "axios" {
  export interface AxiosRequestConfig {
    /**
     * true 면 이 요청의 실패를 **전역 오류 화면으로 승격하지 않는다.**
     * 실패를 의도적으로 삼키는 fire-and-forget 요청에 붙인다
     * (전체화면이 떠서 사용자 플로우를 막는 것을 방지).
     */
    _skipGlobalError?: boolean;
  }
}

let refreshInFlight: Promise<string> | null = null;

type RetriableRequestConfig = AxiosRequestConfig & { _retry?: boolean };

const AUTH_ENDPOINTS: readonly string[] = Object.values(ENDPOINTS.AUTH);

/**
 * url 이 인증 엔드포인트인지 판정한다.
 * 주의: originalRequest.url 이 baseURL 제외한 path 일 수도, 전체 URL 일 수도 있어 부분 일치로 본다.
 */
const isAuthEndpoint = (url: string): boolean =>
  AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

/**
 * 전역 승격에서 제외할 요청인지 판정한다.
 *
 * 기준은 `_skipGlobalError` **하나뿐**이다 — 제외 사유가 호출부에 붙어 있어야
 * "왜 제외인지"를 그 함수 주석과 함께 읽을 수 있고, 여기에 엔드포인트 목록을 따로 두면
 * 제외 대상을 추가할 때 봐야 할 곳이 두 군데가 된다.
 * 현재 적용 대상: `push/token`(fire-and-forget), `getMe`(홈 부가 정보).
 */
const isExcludedFromGlobalError = (
  config: AxiosRequestConfig | undefined
): boolean => config?._skipGlobalError === true;

/**
 * 오류를 전역 오류 화면으로 승격한다.
 *
 * ⚠️ 호출 위치가 중요하다 — **인증 요청 제외 이후에만** 부른다.
 *    인증 화면은 이미 `handleLoginError` / `handleTelError` 가 A100·COMMON-500 을
 *    인라인 문구로 처리하므로, 여기서 승격하면 인라인 에러와 전체화면이 동시에 뜬다.
 *
 * `auth` / `domain` 은 승격 대상이 아니다(`isGlobalErrorKind`).
 * 특히 `404 + M201`(정상 빈 데이터)이 전체화면을 띄우면 홈이 즉시 회귀한다.
 */
const raiseGlobalError = (error: unknown): void => {
  // 요청 취소는 오류가 아니다
  if (axios.isCancel(error)) return;

  const kind = classifyApiError(error);
  if (!isGlobalErrorKind(kind)) return;

  const code = axios.isAxiosError(error)
    ? readApiErrorCode(error.response?.data)
    : undefined;

  useCriticalErrorStore.getState().raise(kind, code);
};

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

  // Response: 심각 오류 전역 승격 + 401이면 refresh 후 재시도
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const code = readApiErrorCode(error.response?.data);
      const originalRequest = error.config as
        | RetriableRequestConfig
        | undefined;

      // 주의: originalRequest.url이 baseURL 제외한 path일 수도, 전체 URL일 수도 있음
      const url = originalRequest?.url ?? "";
      const isAuthRequest = isAuthEndpoint(url);

      // === 전역 승격 ===
      // 인증 요청 제외를 **먼저** 통과시켜야 인라인 에러와의 이중 노출을 막을 수 있다.
      // 401 외의 status(5xx 등)도 승격 대상이라 401 조기 return 앞에서 판정한다.
      if (!isAuthRequest && !isExcludedFromGlobalError(originalRequest)) {
        raiseGlobalError(error);
      }

      // 승격 후에도 reject 는 유지한다 — 화면별 처리 흐름을 깨지 않는다
      if (status !== 401 || !originalRequest) {
        return Promise.reject(error);
      }

      // auth 요청 제외(무한루프 방지)
      if (isAuthRequest) {
        return Promise.reject(error);
      }

      // A100(잘못된 접근)은 API-KEY 계열 오류다 — 토큰 refresh 로 복구되지 않는다.
      // 그대로 refresh 를 태우면 실패 → handleLogout → 하드 네비게이션으로
      // 방금 띄운 config 오류 화면까지 날아가고 "강제 로그아웃"으로 위장된다.
      // (실측: 쓰레기 토큰으로는 A100 이 오지 않으므로 토큰 갱신 경로를 망가뜨리지 않는다)
      if (code === API_ERROR_CODE.INVALID_ACCESS) {
        return Promise.reject(error);
      }

      // 같은 요청은 1번만 재시도
      if (originalRequest._retry) {
        await handleLogout();
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
        // refreshHttp(client.ts)에는 applyAuthInterceptors 가 걸리지 않으므로
        // refresh 요청의 5xx·네트워크 실패는 이 catch 로만 잡힌다.
        // 승격 대상 판정은 `isGlobalErrorKind` 하나로 맞춘다 — 여기에 종류를 손으로 나열하면
        // 판정 기준이 두 곳으로 갈라져 한쪽만 갱신되는 순간 조용히 어긋난다.
        if (isGlobalErrorKind(classifyApiError(e))) {
          // 토큰이 만료된 게 아니라 서버/네트워크 문제로 갱신이 실패한 것이므로 세션을 끊지 않는다.
          // handleLogout 은 하드 네비게이션이라 오류 화면까지 날려버린다.
          raiseGlobalError(e);
          return Promise.reject(e);
        }

        await handleLogout();
        return Promise.reject(e);
      }
    }
  );
}
