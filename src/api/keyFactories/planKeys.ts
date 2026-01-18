/**
 * 일정(Plan) 관련 Query Key Factory
 * TanStack Query의 Query Key를 체계적으로 관리합니다.
 */

export const planKeys = {
  all: ["plans"] as const,
  lists: () => [...planKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...planKeys.lists(), { ...filters }] as const,
  details: () => [...planKeys.all, "detail"] as const,
  detail: (id: number | string) => [...planKeys.details(), id] as const,
} as const;
