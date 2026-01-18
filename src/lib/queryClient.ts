import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 캐시 유지 시간 (5분)
      gcTime: 5 * 60 * 1000,
      // 데이터가 신선하다고 간주되는 시간 (1분)
      staleTime: 1 * 60 * 1000,
      // 에러가 발생하면 재시도 (최대 1번)
      retry: 1,
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
