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
}

// detail 모드
export interface PlanDetailCardEdit extends PlanDetailCardBase {
  mode: "detail";
  onOpenCardMenu: (info: CardMenuAnchorInfo) => void;
}

export type PlanDetailCardProps = PlanDetailCardSimple | PlanDetailCardEdit;

// Popover를 띄우기 위해 필요한 정보 타입
export interface CardMenuAnchorInfo {
  planNum: number; // 어떤 카드인지
  anchorEl: HTMLElement | null; // 팝오버 기준이 될 DOM 요소
}
