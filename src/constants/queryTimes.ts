/**
 * React Query 캐시 시간 상수
 *
 * 전역 기본값은 `src/lib/queryClient.ts` (staleTime 1분 / gcTime 5분).
 * 배치성·정적 데이터처럼 기본값이 과도한 경우만 여기에 상수로 정의한다.
 */

/**
 * 오늘의 핫플레이스 — 백엔드 월배치 스냅샷(`baseYm`)이라 하루 단위로 충분하다.
 *
 * `Infinity` 를 쓰지 않는 이유: RN WebView 는 앱이 살아 있는 동안 세션이 장수하고
 * `queryClient` 가 `refetchOnWindowFocus: false` 라서, `Infinity` 면 월 경계를 넘겨도
 * 영구히 갱신되지 않는다.
 */
export const HOT_PLACE_STALE_TIME = 24 * 60 * 60_000;
export const HOT_PLACE_GC_TIME = 24 * 60 * 60_000;
