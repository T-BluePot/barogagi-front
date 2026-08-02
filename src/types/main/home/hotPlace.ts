/**
 * 홈 "오늘의 핫플레이스" 카드용 도메인 타입.
 *
 * 컴포넌트가 아니라 여기에 두는 이유: 매퍼(`utils/api/homeMapper.ts`)가 이 타입을 쓰는데
 * 하위 계층인 매퍼가 컴포넌트를 import 하면 카드를 옮기거나 쪼갤 때 유틸 계층이 깨지고,
 * 카드가 매퍼 헬퍼를 쓰게 되는 순간 순환 참조가 된다.
 */
export interface HotPlaceData {
  rank: number;
  name: string;
  /** 상위 행정구역명 (시/도) — 이름과 같거나 목록 전체가 같은 지역이면 생략 */
  area?: string;
  /** 카테고리 중분류 (hubCtgryMclsNm). area 가 없을 때 메타 라인에 노출 */
  category?: string;
}
