/**
 * classifyApiError.ts
 * - axios 에러를 "전역 오류 심각도"로 분류하는 유틸
 * - 에러 봉투 2종(`code` / `resultCode`)을 모두 읽는 파서 포함
 */

import axios from "axios";
import { API_ERROR_CODE, CRITICAL_ERROR_CODES } from "@/constants/apiErrorCodes";
import type { ApiErrorEnvelope } from "@/api/types";

/**
 * 전역 오류 심각도.
 * - network:  응답 자체가 없음 (timeout / 연결 실패)
 * - critical: 서버 장애 → 전체화면 (앱 재실행 유도)
 * - config:   API-KEY 등 클라이언트 설정 오류 → 전체화면 (토큰 refresh 금지)
 * - auth:     토큰 문제 → 기존 refresh/로그아웃 흐름에 위임 (전체화면 X)
 * - domain:   비즈니스 응답(빈 데이터 포함) → 화면별 처리 (전체화면 X)
 *
 * ⚠️ `maintenance` 는 여기에 없다 — 점검 상태 조회 API가 존재하지 않고
 *    HTTP 503 을 관측한 적도 없다. 임의 매핑 금지. (classifyApiError 하단 TODO 참고)
 */
export type ApiErrorKind = "network" | "critical" | "config" | "auth" | "domain";

/**
 * 에러 봉투에서 코드를 읽는다.
 *
 * 서버는 두 형태를 섞어 보낸다:
 * - 컨트롤러 도달   → `{ code, message, data }`
 * - 전역 에러 핸들러 → `{ resultCode, message }` (data 필드 없음)
 *
 * 봉투 키는 HTTP status 와 **상관관계가 없다**(401 + `code:"A100"` 이 실존).
 * → status 로 키를 고르면 틀린다. 항상 두 키를 모두 확인한다.
 */
export const readApiErrorCode = (data: unknown): string | undefined => {
  if (typeof data !== "object" || data === null) return undefined;
  const envelope = data as ApiErrorEnvelope;
  return envelope.code ?? envelope.resultCode;
};

/**
 * axios 에러를 전역 오류 심각도로 분류한다.
 *
 * 실측 근거: HTTP status 만으로도, 응답 code 만으로도 판정할 수 없다.
 * - `404` 가 정상 빈 데이터일 수 있다 (`/home/regions/popular` → 404 + M201)
 * - `401` 이 토큰 만료가 아닐 수 있다 (잘못된 API-KEY → 401 + A100)
 * → 반드시 status + code **쌍**으로 판정한다.
 */
export const classifyApiError = (error: unknown): ApiErrorKind => {
  // getApiKey() throw 등 axios 요청 이전 단계의 실패 → 설정 오류
  if (!axios.isAxiosError(error)) return "config";

  // 응답이 없으면 네트워크 계층 실패 (timeout / 연결 실패)
  if (!error.response) return "network";

  const { status, data } = error.response;
  const code = readApiErrorCode(data);

  // 서버 장애
  if (status >= 500) return "critical";
  if (code && CRITICAL_ERROR_CODES.includes(code)) return "critical";

  // API-KEY 계열 오류 — 토큰 refresh 로 복구되지 않는다
  if (status === 401 && code === API_ERROR_CODE.INVALID_ACCESS) return "config";

  // 그 외 401 은 기존 refresh/로그아웃 흐름에 맡긴다
  if (status === 401) return "auth";

  // ⛔ TODO(#113): 점검(maintenance) 트리거 미확정 — **여기에 추측으로 분기를 넣지 말 것.**
  //
  // 근거: 백엔드 42개 경로 전수 확인 결과 점검 상태 조회 API 가 없고,
  //       api-docs.json 에 HTTP 503 선언이 0건이며 503 을 실제로 관측한 적도 없다.
  //       백엔드가 준 오류 코드 표 22건에도 점검 관련 코드가 없다.
  //       → `503 → maintenance` 매핑은 근거 없는 추측이다.
  //
  // 백엔드가 트리거(전용 API / 503 / 응답 헤더 / 전용 code)를 확정하면
  // 여기에 한 줄, apiErrorCodes.ts 에 상수 하나만 추가하면 된다.
  // 화면·문구·액션은 이미 완성돼 있다(errorScreen.ts / GlobalErrorScreen.tsx).
  // `ApiErrorKind` 에 "maintenance" 가 없으므로 지금은 타입상으로도 반환이 불가능하다.

  // 빈 데이터(404 + M201)를 포함한 비즈니스 응답 → 화면별 처리
  return "domain";
};

/** 전체화면 오류로 승격해야 하는 심각도인지 판정한다. */
export const isGlobalErrorKind = (
  kind: ApiErrorKind
): kind is "network" | "critical" | "config" =>
  kind === "network" || kind === "critical" || kind === "config";
