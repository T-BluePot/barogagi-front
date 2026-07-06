import type { PlanRegistResDTO } from "@/api/types";
import type { PlanNoteMap } from "@/types/main/plan/bottom-modal/planFromTypes";
/**
 * 사용 화면에 따른 타입 분기
 * create: 추천 루트(생성 완료) 화면
 * detail: 상세 루트 화면
 */
export type Variant = "create" | "detail";

// ----- scheduleRoutesContent 컴포넌트에서 사용되는 타입 -----

// 헤더 정보
interface ContentHeaderProps {
  scheduleDate: string;
  scheduleName: string;
  onChangeScheduleName: (next: string) => void;
  onCommitScheduleName?: (finalName: string) => void;
}

// 팝메뉴: 편집 액션 콜백 묶음
interface EditActionsProps {
  onRequestEdit: (planNum: number) => void;
  onRequestDelete: (planNum: number) => void;
}

// create 화면에서만 쓰는 푸터 액션
interface CreateFooterProps {
  onClickConfirm: () => void; // 예: 생성 완료 버튼 클릭
  onRegenerate: () => void; // "다시 만들기" — 체크된 계획은 유지하고 재생성
  keptCount: number; // "유지" 체크된 계획 개수 (안내 문구용)
}

// 공통 부분
interface ScheduleRoutesContentBase {
  header: ContentHeaderProps;
  plans: PlanRegistResDTO[];
}

// create 화면: 편집 불가 + 일정 완성 푸터
interface ScheduleRoutesContentCreate extends ScheduleRoutesContentBase {
  isEditable: false; // create 모드에서는 false로 구분
  footer: CreateFooterProps;
  keptIndexes?: Set<number>; // "유지" 체크된 카드 index 집합 (페이지 로컬 상태)
  onToggleKept?: (index: number) => void; // index 카드의 "유지" 체크 토글
}

// detail 화면: 편집 가능 + 액션 필수
interface ScheduleRoutesContentDetail
  extends ScheduleRoutesContentBase, EditActionsProps {
  isEditable: true;
  footer?: never;
  keptIndexes?: never;
  onToggleKept?: never;
  notes?: PlanNoteMap; // planNum → 인라인 메모 입력값
  onChangeNote?: (planNum: number, value: string) => void; // 인라인 메모 입력 변경
  onCommitNote?: (planNum: number) => void; // 인라인 메모 blur 시 커밋
  onAddPlan?: () => void; // 리스트 하단 "계획 추가하기" 타일 탭
}

// 최종 Props 유니온
export type ScheduleRoutesContentProps =
  | ScheduleRoutesContentCreate
  | ScheduleRoutesContentDetail;

export interface ScheduleRoutesPageProps {
  variant: Variant;
}
