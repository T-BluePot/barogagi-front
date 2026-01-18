/**
 * 메인 홈(Home) 관련 Query Key Factory
 */
export const homeKeys = {
  all: ["home"] as const,
  popularTags: () => [...homeKeys.all, "popularTags"] as const,
  popularRegions: () => [...homeKeys.all, "popularRegions"] as const,
  mySchedules: () => [...homeKeys.all, "mySchedules"] as const,
} as const;
