/**
 * 일정(Schedule) 관련 Query Key Factory
 */

export const scheduleKeys = {
  all: ["schedules"] as const,
  lists: () => [...scheduleKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...scheduleKeys.lists(), { ...filters }] as const,
  details: () => [...scheduleKeys.all, "detail"] as const,
  detail: (scheduleNum: number) =>
    [...scheduleKeys.details(), scheduleNum] as const,

  /** 일정별 공유 링크 — 호출마다 새 토큰이 발급되므로 캐시로 재사용한다 */
  shares: () => [...scheduleKeys.all, "share"] as const,
  share: (scheduleNum: number) => [...scheduleKeys.shares(), scheduleNum] as const,

  /** 공유 링크로 진입한 비로그인 조회 (shareToken 기준) */
  sharedViews: () => [...scheduleKeys.all, "sharedView"] as const,
  sharedView: (shareToken: string) =>
    [...scheduleKeys.sharedViews(), shareToken] as const,
} as const;
