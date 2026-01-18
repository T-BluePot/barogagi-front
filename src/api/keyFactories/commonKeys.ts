/**
 * 기타(Common) 관련 Query Key Factory (Tag, Region, Verification, Terms, Place)
 */
export const commonKeys = {
  all: ["common"] as const,
  tags: {
    all: () => [...commonKeys.all, "tags"] as const,
    search: (criteria?: Record<string, unknown>) =>
      [...commonKeys.tags.all(), "search", { ...criteria }] as const,
  },
  regions: {
    all: () => [...commonKeys.all, "regions"] as const,
    search: (query: string) =>
      [...commonKeys.regions.all(), "search", query] as const,
    geocode: (id: number) =>
      [...commonKeys.regions.all(), "geocode", id] as const,
  },
  terms: {
    all: () => [...commonKeys.all, "terms"] as const,
    list: (type?: string) => [...commonKeys.terms.all(), "list", type] as const,
  },
  places: {
    all: () => [...commonKeys.all, "places"] as const,
    search: (keyword: string) =>
      [...commonKeys.places.all(), "search", keyword] as const,
  },
} as const;
