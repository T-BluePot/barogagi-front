/**
 * 회원(Auth) 관련 Query Key Factory
 * TanStack Query의 Query Key를 체계적으로 관리합니다.
 *
 * 사용 예시:
 * - useQuery({ queryKey: authKeys.me() })
 * - queryClient.invalidateQueries({ queryKey: authKeys.me() })
 *
 * 왜 Query Key Factory를 사용하나요?
 * - 쿼리 키 오타 방지 (["me"] vs ["Me"] 같은 실수 예방)
 * - 키 변경 시 한 곳만 수정하면 전체 반영
 * - IDE 자동완성 지원으로 개발 생산성 향상
 */

export const authKeys = {
  /** auth 관련 모든 쿼리의 기본 키 */
  all: ["auth"] as const,

  /** 현재 로그인한 사용자 정보 조회 키 (예: ["auth", "me"]) */
  me: () => [...authKeys.all, "me"] as const,
} as const;
