/**
 * 앱 설정(Settings) 관련 Query Key Factory
 *
 * 사용 예시
 * - useQuery({ queryKey: settingsKeys.list() })
 * - queryClient.invalidateQueries({ queryKey: settingsKeys.list() })
 */

export const settingsKeys = {
  /** settings 관련 모든 쿼리의 기본 키 */
  all: ["settings"] as const,

  /** 설정 목록 조회 키 (예: ["settings", "list"]) */
  list: () => [...settingsKeys.all, "list"] as const,
} as const;
