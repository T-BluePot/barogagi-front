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

// 일정 수정 폼 전용 드래프트 타입
export interface EditPlanDraft {
  planNum: number; // 계획 번호 (PK) - 대표 식별자

  // Plan 섹션: 시간/제목 등 "계획" 자체에 대한 정보
  plan: {
    planNm: string; // 계획 이름
    startTime: string; // 시작 시간 (HH:mm)
    endTime: string; // 종료 시간 (HH:mm)
  };

  // Place 섹션: 위치 관련 정보
  place: {
    placeNum: number | null; // PLACE_NUM, 아직 선택 안 했으면 null
    placeName: string; // UI 표시용 장소 이름 (regionNm)
    address: string; // UI 표시용 전체 주소
  };

  /**
   *  Tags 섹션: 태그 관련 정보 (필요 시)
   *  tags: {
    selectedTagNums: number[]; // 선택된 TAG_NUM 배열
  };
   */
}

// place 섹션만 추출한 전용 타입
export type EditPlanPlace = EditPlanDraft["place"];

// 장소 선택 핸들러 공통 타입
export type OnSelectPlace = (location: EditPlanPlace) => void;

// planNum 기준으로 메모를 저장하는 맵 타입
export type PlanNoteMap = Record<number, string>;
