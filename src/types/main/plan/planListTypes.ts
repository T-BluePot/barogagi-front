// PLAN 테이블 기반 애플리케이션용 타입
export interface Plan {
  planNum: number; // PLAN_NUM, 계획 번호 (PK, AUTO_INCREMENT)
  planNm: string; // PLAN_NM, 계획명 (최대 100자)

  startTime: string; // START_TIME, 시작 시간 (HH:mm:ss 형식의 문자열 권장)
  endTime: string; // END_TIME, 종료 시간 (HH:mm:ss 형식 문자열)

  itemNum: number; // ITEM_NUM, 아이템 번호 (FK)
  scheduleNum: number; // SCHEDULE_NUM, 일정 번호 (FK)
  membershipNo: number; // MEMBERSHIP_NO, 회원 번호 (FK)
  placeNum: number; // PLACE_NUM, 장소 번호 (FK)

  regDate: string; // REG_DATE, 생성 일시 (ISO DATETIME 문자열)
  delYn: "Y" | "N"; // DEL_YN, 삭제 여부 플래그 (DB에서는 VARCHAR(1) / CHAR(1) 가 일반적)
  updDate: string; // UPD_DATE, 수정 일시 (ISO DATETIME 문자열)
}

// 애플리케이션 도메인용 Place 타입
export interface Place {
  placeNum: number; // PLACE_NUM
  regionNm: string; // REGION_NM → 장소명
  address: string; // ADDRESS → 전체주소
  regionNum: number; // REGION_NUM
  planLink: string; // PLAN_LINK → 장소 링크
  placeDescription: string; // PLACE_DESCRIPTION → 장소 설명
}

// PLAN_TAG 도메인 타입
export interface PlanTag {
  tagNum: number; // TAG_NUM
  planNum: number; // PLAN_NUM
}

// TAG 도메인 타입
export interface Tag {
  tagNum: number; // TAG_NUM
  tagNm: string; // TAG_NM (한글 태그명)
  tagType: string; // TAG_TYPE (유형)
  categoryNum: number; // CATEGORY_NUM
}

export interface PlanWithRelations {
  plan: Plan; // 시간 / 회원 / 스케줄 / 장소 FK
  place: Place; // 장소 정보
  tags: Tag[]; // 태그 정보 목록
}

// plan 데이터 전용 필드 (back에 사진 타입 추가시 수정)
export interface PlanDataProps extends PlanWithRelations {
  src: string; // 카드 썸네일 이미지 URL
}

// 카드 공통 필드
interface PlanDetailCardBase {
  plan: Plan;
  place: Place;
  tags: Tag[];
  src: string;
  isOpen: boolean;
  onToggleOpen: () => void;
}

// create 모드: 추천 루트 페이지 - 메뉴 버튼 없음
export interface PlanDetailCardSimple extends PlanDetailCardBase {
  mode: "create";
  onOpenCardMenu?: never;
}

// Popover를 띄우기 위해 필요한 정보 타입
export interface CardMenuAnchorInfo {
  planNum: number; // 어떤 카드인지
  anchorEl: HTMLElement | null; // 팝오버 기준이 될 DOM 요소
}

// detail 모드: 메뉴 팝오버 기능 있음
export interface PlanDetailCardEdit extends PlanDetailCardBase {
  mode: "detail";
  onOpenCardMenu: (info: CardMenuAnchorInfo) => void;
}

/**
 * PLAN + PLACE + TAG + UI 상태를 합쳐 만든
 * 최종 카드 컴포넌트용 타입
 */
export type PlanDetailCardProps = PlanDetailCardSimple | PlanDetailCardEdit;
