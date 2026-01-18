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
} as const;
