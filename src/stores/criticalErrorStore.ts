import { create } from "zustand";

/**
 * 전체화면 안내로 승격된 오류의 종류.
 *
 * - critical:    서버 장애 (HTTP 5xx / COMMON-500)
 * - network:     응답 자체가 없음 (timeout / 연결 실패)
 * - config:      API-KEY 등 클라이언트 설정 오류 (토큰 refresh 로 복구 불가)
 * - maintenance: ⚠️ 트리거 미확정 — 백엔드 대기. `classifyApiError` 는 이 값을 반환하지 않는다
 * - render:      ErrorBoundary 전용. store 를 거치지 않지만 문구 키를 공유한다
 */
export type CriticalErrorKind =
  | "critical"
  | "network"
  | "config"
  | "maintenance"
  | "render"
  | null;

interface CriticalErrorState {
  kind: CriticalErrorKind;
  /** CS/QA 추적용 서버 응답 코드 (있을 때만) */
  code?: string;
  raise: (kind: Exclude<CriticalErrorKind, null>, code?: string) => void;
  clear: () => void;
}

export const useCriticalErrorStore = create<CriticalErrorState>((set, get) => ({
  kind: null,
  code: undefined,
  /**
   * 오류 화면을 띄운다.
   * 이미 표시 중이면 **무시**해서 첫 오류를 유지한다.
   * (React Query 재시도로 같은 오류가 2회 이상 올라오면 화면이 깜빡이거나 code 가 뒤바뀐다)
   */
  raise: (kind, code) => {
    if (get().kind !== null) return;
    set({ kind, code });
  },
  clear: () => set({ kind: null, code: undefined }),
}));
