/**
 * 메인 홈(Home) 관련 Query Key Factory
 */
export const homeKeys = {
  all: ["home"] as const,
  popularTags: () => [...homeKeys.all, "popularTags"] as const,
  popularRegions: () => [...homeKeys.all, "popularRegions"] as const,
  /**
   * 오늘의 핫플레이스 (선호 지역 기준).
   *
   * ⚠️ 지역은 **쌍일 때만** 키에 넣는다. 서버가 단독 파라미터를 무시하고 기본값(종로구)을
   *    돌려주므로, `areaCd` 만 키에 넣으면 서로 다른 키가 같은 데이터를 담는 중복 적재가 된다.
   *    → 쌍이 아니면 파라미터 없는 호출과 같은 키(`[...all, "hotPlaces"]`)를 쓴다.
   */
  hotPlaces: (areaCd?: string, sigunguCd?: string) =>
    areaCd && sigunguCd
      ? ([...homeKeys.all, "hotPlaces", areaCd, sigunguCd] as const)
      : ([...homeKeys.all, "hotPlaces"] as const),
  /**
   * 공공기관 지역코드 목록.
   * 호출 파라미터가 `type=HOT-PLACE` 한 종류뿐이라 인자를 받지 않는다.
   */
  regionCodes: () => [...homeKeys.all, "regionCodes"] as const,
  mySchedules: () => [...homeKeys.all, "mySchedules"] as const,
} as const;
