export interface Region {
  REGION_NUM: number; // 지역 번호
  REGION_LEVEL_1: string; // 예: 서울특별시
  REGION_LEVEL_2: string; // 예: 강남구
  REGION_LEVEL_3: string; // 예: 삼성동
  REGION_LEVEL_4: string; // 예: (없을 수도 있음)
}

export interface RegionSearchProps {
  regions: Region[]; // props로 받는 지역 데이터
}
