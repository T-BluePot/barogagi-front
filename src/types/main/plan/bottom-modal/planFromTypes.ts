/**
 * 모달 타입
 * Create: 일정 구성 화면
 * Edit: 추천 루트 화면
 * type Mode = "Create" | "Edit";
 */

/**
 * 모달 상호 작용
 * isOpen: 모달 열림 여부
 * onClose/onConfirm: 모달 취소 / 확인 버튼
 */
interface ModalAction {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onClickAction: () => void;
}

/**
 * 공통 필드
 */
interface ModalBaseInfo {
  planNum?: number;
  planNm?: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  onClickTime: () => void;
  onClickAddress: () => void; // 장소 수정
}

/**
 * Create 모드 전용 필드(tags)
 */
interface CreateModalInfo extends ModalBaseInfo {
  mode: "Create"; // 식별자 필드
  tags?: string[];
  onClickTags: () => void;
}

/**
 * Edit 모드 전용 필드(note)
 */
interface EditModalInfo extends ModalBaseInfo {
  mode: "Edit"; // 식별자 필드
  note?: string;
  noteValue: string;
  onChangeNote: (note: string) => void;
}

/**
 * 두 타입을 합쳐서 ModalInfo로 정의
 */
type ModalInfo = CreateModalInfo | EditModalInfo;

export interface PlanFormModalProps {
  action: ModalAction;
  info: ModalInfo;
}

// 일정 수정용 드래프트 타입
export interface EditPlanDraft {
  planNum: number;
  planNm: string;
  address: string;
  startTime: string;
  endTime: string;
  note: string;
}

// planNum 기준으로 메모를 저장하는 맵 타입
export type PlanNoteMap = Record<number, string>;
