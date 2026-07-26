import { QueryClient } from "@tanstack/react-query";

import { classifyApiError } from "@/utils/api/classifyApiError";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 캐시 유지 시간 (5분)
      gcTime: 5 * 60 * 1000,
      // 데이터가 신선하다고 간주되는 시간 (1분)
      staleTime: 1 * 60 * 1000,
      // 에러가 발생하면 재시도 (최대 1번).
      // 단 서버 장애(critical)는 재시도해도 의미가 없고, 전역 오류 화면이 이미 떴는데
      // 같은 요청이 한 번 더 실패하는 것뿐이다 → 재시도에서 제외한다.
      // failureCount 는 0 기반이라 `count < 1` 이 기존 `retry: 1`(총 2회 시도)과 동일하다.
      retry: (count, error) =>
        classifyApiError(error) === "critical" ? false : count < 1,
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
