/**
 * 회원(Auth) 관련 Query Key Factory
 * TanStack Query의 Query Key를 체계적으로 관리합니다.
 */

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
} as const;
