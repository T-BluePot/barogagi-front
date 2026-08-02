/**
 * 메인 홈 관련 타입 변환 함수 모음
 */

import type { HotPlaceDTO } from "@/api/types";
import type { HotPlaceData } from "@/types/main/home/hotPlace";

/**
 * `hubRank` 는 string("1"~"10") 이므로 숫자로 변환한 뒤 정렬한다.
 * 문자열 정렬이면 `"10" < "2"` 로 순서가 깨진다.
 */
export const sortByHubRank = (places: HotPlaceDTO[]): HotPlaceDTO[] =>
  [...places].sort((a, b) => Number(a.hubRank) - Number(b.hubRank));

/**
 * 목록 전체가 같은 시군구인지 판정한다.
 * true 면 카드별 지역 표기를 생략하고 섹션 캡션에서 한 번만 노출한다
 * (실측 10건이 전부 "서울 종로구" 라서 카드마다 넣으면 같은 문자열이 10번 반복된다).
 */
export const hasUniformSigngu = (places: HotPlaceDTO[]): boolean =>
  places.length > 0 && new Set(places.map((p) => p.signguCd)).size === 1;

/**
 * 시/도명 축약 — 카드 메타 라인(11px)에 "서울특별시"는 길다.
 *
 * ⚠️ 실측 데이터가 서울특별시뿐이라 도 단위 축약 규칙은 미확정이다.
 *    "충청북도" → "충북" 같은 관례 축약은 임의 판단이 되므로 제거 대상에서 제외하고
 *    원문을 그대로 노출한다. 도 단위 데이터가 유입되면 기획과 표기 규칙을 확정한다.
 */
const shortenAreaNm = (areaNm: string): string =>
  areaNm.replace(/(특별자치시|특별시|광역시)$/, "");

/** 지역 표시명: "서울 종로구" */
export const formatHotPlaceRegion = (place: HotPlaceDTO): string =>
  `${shortenAreaNm(place.areaNm)} ${place.signguNm}`.trim();

/**
 * 배치 기준월: "202605" → "2026년 5월"
 *
 * `dateFormatters.ts` 는 yyyy-MM-dd 전용이라 여기에 둔다.
 * 형식이 다르면 더미 문자열을 만들지 않고 `undefined` 로 두어 표기 자체를 생략한다.
 */
export const formatBaseYm = (baseYm: string): string | undefined => {
  if (!/^\d{6}$/.test(baseYm)) return undefined;

  const month = Number(baseYm.slice(4, 6));
  if (month < 1 || month > 12) return undefined;

  return `${baseYm.slice(0, 4)}년 ${month}월`;
};

/**
 * 핫플레이스 DTO → 카드 데이터
 *
 * 🚫 서버가 주지 않는 값을 채우지 않는다 — 표기할 수 없으면 `undefined` 로 둔다.
 *
 * @param showArea 목록 내 지역이 섞여 있을 때만 카드에 지역을 표기한다
 *                 (전부 같으면 섹션 캡션에서 한 번만 노출)
 */
export const toHotPlaceCardData = (
  place: HotPlaceDTO,
  showArea: boolean
): HotPlaceData => ({
  // string → number. 변환을 빠뜨리면 1위 HOT 뱃지가 절대 뜨지 않는다
  rank: Number(place.hubRank),
  name: place.hubTatsNm,
  area: showArea ? formatHotPlaceRegion(place) : undefined,
  // 외부(관광공사) 데이터라 빈 문자열이 올 수 있다 → 타입 계약(`category?: string`)대로 undefined 로 정규화.
  // 소비처가 트루시 검사에 기대지 않게 경계에서 끊는다.
  category: place.hubCtgryMclsNm || undefined,
});
