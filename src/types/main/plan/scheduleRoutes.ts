import type { PlanDataProps } from "./planListTypes";

/**
 * 사용 화면에 따른 타입 분기
 * create: 추천 루트(생성 완료) 화면
 * detail: 상세 루트 화면
 */
export type Variant = "create" | "detail";

// ----- scheduleRoutesContent 컴포넌트에서 사용되는 타입 -----

// 헤더 정보
interface ContentHeaderProps {
  scheduleDate: Date;
  scheduleName: string;
  onChangeScheduleName: (next: string) => void;
}

// 팝메뉴: 편집 액션 콜백 묶음
interface EditActionsProps {
  onRequestEdit: (planNum: number) => void;
  onRequestDelete: (planNum: number) => void;
}

// create 화면에서만 쓰는 푸터 액션
interface CreateFooterProps {
  onClickConfirm: () => void; // 예: 생성 완료 버튼 클릭
}

// 공통 부분
interface ScheduleRoutesContentBase {
  header: ContentHeaderProps;
  plans: PlanDataProps[];
}

// create 화면: 편집 불가 + 일정 완성 푸터
interface ScheduleRoutesContentCreate extends ScheduleRoutesContentBase {
  isEditable: false; // create 모드에서는 false로 구분
  footer: CreateFooterProps;
}

// detail 화면: 편집 가능 + 액션 필수
interface ScheduleRoutesContentDetail
  extends ScheduleRoutesContentBase,
    EditActionsProps {
  isEditable: true;
  footer?: never;
}

// 최종 Props 유니온
export type ScheduleRoutesContentProps =
  | ScheduleRoutesContentCreate
  | ScheduleRoutesContentDetail;

export interface ScheduleRoutesPageProps {
  variant: Variant;
}
