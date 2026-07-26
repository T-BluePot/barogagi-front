/**
 * 메인 홈(Home) 관련 Query Key Factory
 */
export const homeKeys = {
  all: ["home"] as const,
  popularTags: () => [...homeKeys.all, "popularTags"] as const,
  popularRegions: () => [...homeKeys.all, "popularRegions"] as const,
  /**
   * 오늘의 핫플레이스.
   * 지역 선택 UI 가 없어 호출이 항상 기본값(종로구) 1종이므로 파라미터를 받지 않는다.
   *
   * 지역 선택 착수 시 `hotPlaces: (areaCd: string, sigunguCd: string)` 로 확장한다.
   * ⚠️ 확장할 때 **둘 중 하나만 키에 넣지 마라.** 서버가 단독 파라미터를 무시하고
   *    기본값을 돌려주므로, 서로 다른 키가 같은 데이터를 담는 중복 적재가 발생한다.
   */
  hotPlaces: () => [...homeKeys.all, "hotPlaces"] as const,
  mySchedules: () => [...homeKeys.all, "mySchedules"] as const,
} as const;
