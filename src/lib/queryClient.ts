import { QueryClient } from "@tanstack/react-query";

import { classifyApiError } from "@/utils/api/classifyApiError";
import { useCriticalErrorStore } from "@/stores/criticalErrorStore";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 캐시 유지 시간 (5분)
      gcTime: 5 * 60 * 1000,
      // 데이터가 신선하다고 간주되는 시간 (1분)
      staleTime: 1 * 60 * 1000,
      // 에러가 발생하면 재시도 (최대 1번).
      // failureCount 는 0 기반이라 `count < 1` 이 기존 `retry: 1`(총 2회 시도)과 동일하다.
      retry: (count, error) => {
        // 전역 오류 화면은 오버레이라 아래 트리가 살아 있다 → 화면이 떠 있는 동안에도
        // 새 화면이 마운트되며 쿼리가 계속 나간다. 이때의 재시도는 화면에 아무 기여도 없다.
        if (useCriticalErrorStore.getState().kind !== null) return false;

        // 서버 장애(critical)·설정 오류(config, 잘못된 API-KEY 등)는 재시도로 복구되지 않는다.
        // network 만 남긴다 — 일시적 끊김은 실제로 자가 회복한다.
        const kind = classifyApiError(error);
        if (kind === "critical" || kind === "config") return false;

        return count < 1;
      },
      // 윈도우 포커스시 자동 재요청
      refetchOnWindowFocus: false,
      // 마운트 시 재요청
      refetchOnMount: true,
    },
    mutations: {
      // 에러가 발생하면 재시도 안함
      retry: false,
    },
  },
});
