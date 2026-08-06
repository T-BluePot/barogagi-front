import type { ReactNode } from "react";
import type { PlanRegistResDTO } from "@/api/types";
// Popover를 띄우기 위해 필요한 정보 타입
export interface CardMenuAnchorInfo {
  planNum: number; // 어떤 카드인지
  anchorEl: HTMLElement | null; // 팝오버 기준이 될 DOM 요소
}

// 카드 공통 필드
interface PlanDetailCardBase {
  plan: PlanRegistResDTO;
  src?: string; // 이미지 URL (없으면 fallback 이미지 사용)
  isOpen: boolean;
  onToggleOpen: () => void;
  index?: number; // 타임라인 순번 (0-based, 없으면 순번 배지 생략)
}

// create 모드
export interface PlanDetailCardSimple extends PlanDetailCardBase {
  mode: "create";
  onOpenCardMenu?: never;
  kept?: boolean; // "유지" 체크 여부 (다시 만들기 시 유지 대상 표시)
  onToggleKept?: () => void; // "유지" 체크 토글 콜백
  noteValue?: never;
  onChangeNote?: never;
  onCommitNote?: never;
  reorderMode?: never;
  dragHandle?: never;
}

// detail 모드
export interface PlanDetailCardEdit extends PlanDetailCardBase {
  mode: "detail";
  onOpenCardMenu: (info: CardMenuAnchorInfo) => void;
  kept?: never;
  onToggleKept?: never;
  noteValue?: string; // 인라인 메모 입력값 (수정 모달 메모와 동일 소스)
  onChangeNote?: (value: string) => void; // 인라인 메모 입력 변경
  onCommitNote?: () => void; // blur 시 메모 커밋 (변경분 있으면 서버 반영)
  reorderMode?: boolean; // 순서 변경 모드 — 우상단에 dragHandle 렌더, 인라인 메모/확장 숨김
  dragHandle?: ReactNode; // reorderMode일 때 ⋮ 메뉴 대신 렌더할 드래그 핸들 노드
}

// share 모드 — 공유 링크로 진입한(비로그인 포함) 사용자에게 보여줄 읽기 전용 카드.
// create도 detail도 아니므로 PlanDetailCard 내부의 simple/edit 분기가 모두 false가 되어
// 우상단 영역(유지 체크박스 · ⋮ 메뉴)과 인라인 메모가 렌더되지 않는다. 카드 펼치기만 동작한다.
export interface PlanDetailCardShare extends PlanDetailCardBase {
  mode: "share";
  onOpenCardMenu?: never;
  kept?: never;
  onToggleKept?: never;
  noteValue?: never;
  onChangeNote?: never;
  onCommitNote?: never;
  reorderMode?: never;
  dragHandle?: never;
}

export type PlanDetailCardProps =
  | PlanDetailCardSimple
  | PlanDetailCardEdit
  | PlanDetailCardShare;

// Popover를 띄우기 위해 필요한 정보 타입
export interface CardMenuAnchorInfo {
  planNum: number; // 어떤 카드인지
  anchorEl: HTMLElement | null; // 팝오버 기준이 될 DOM 요소
}
