/**
 * 공공기관 지역코드(시/도 · 시군구) UI 도메인 타입.
 *
 * 컴포넌트가 아니라 여기에 두는 이유는 `hotPlace.ts` 와 같다 —
 * 매퍼(`utils/api/homeMapper.ts`)가 이 타입을 쓰는데, 하위 계층인 매퍼가
 * 컴포넌트를 import 하면 화면을 옮길 때 유틸 계층이 깨진다.
 */

/** 시군구 선택지 */
export interface SigunguOption {
  sigunguCd: string;
  sigunguNm: string;
}

/** 시/도 선택지 (하위 시군구 포함) */
export interface AreaOption {
  areaCd: string;
  areaNm: string;
  sigungus: SigunguOption[];
}

/**
 * 선택된 선호 지역.
 *
 * ⚠️ 네 필드 모두 **필수**다. 서버가 areaCd·sigunguCd 를 쌍으로만 처리하기 때문이다
 *    (한쪽만 보내면 200 을 주면서 조용히 버린다 — 저장·핫플레이스·날씨 전부 동일).
 *    시/도만 고른 상태를 타입으로 아예 만들 수 없게 해서, UI 를 우회한 경로로도
 *    반쪽짜리 값이 서버에 나가지 않도록 막는다.
 *
 * 선호 지역을 **아예 안 고른** 상태는 이 객체가 `undefined` 인 것으로 표현한다
 * (빈 문자열 같은 더미값으로 채우지 않는다).
 *
 * 시·도 단독은 저장도 조회도 지원 예정이 없다(백엔드 확인). optional 로 되돌리지 말 것.
 */
export interface PreferredRegion {
  areaCd: string;
  areaNm: string;
  sigunguCd: string;
  sigunguNm: string;
}
