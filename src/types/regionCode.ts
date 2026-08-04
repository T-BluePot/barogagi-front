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
 * ⚠️ 시군구는 **선택 사항**이다 — 시/도만 고른 상태(`sigunguCd === undefined`)가
 *    정상값이므로 더미값("", "00")으로 채우지 않는다.
 *    서버 DTO(`JoinRequestDTO` / `MemberRequestDTO`)도 둘 다 optional 이다.
 */
export interface PreferredRegion {
  areaCd: string;
  areaNm: string;
  sigunguCd?: string;
  sigunguNm?: string;
}
