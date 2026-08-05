import type { ReactNode } from "react";

export interface ModalContentsType {
  title: string; // 모달 제목
  content: string; // 모달 내용
}

// 버튼 강조 종류 (default = 기본 파랑, destructive = 경고 빨강)
export type ButtonVariant = "default" | "destructive";

// 모달 강조 종류 (default = 기존 모션, warning = 진한 오버레이 + shake)
export type ModalSeverity = "default" | "warning";

export interface ButtonInfoType {
  label: string; // 버튼 라벨
  onClick?: () => void; // 버튼 클릭 핸들러
  variant?: ButtonVariant; // 강조 종류 (기본 default)
}

export type CommonAlertModalLayoutPropsType = {
  isVisible: boolean; // 애니메이션 상태 제어 (true = 보임, false = 숨김)
  buttonInfo: ButtonInfoType; // 버튼 정보
  onCloseComplete: () => void; // 페이드아웃 애니메이션 완료 시 호출
  children?: ReactNode; // 모달 내용 영역
};

export interface CommonAlertModalPropsType {
  isOpen: boolean; // 모달 보임 상태 제어 (부모로부터 받음)
  buttonInfo: ButtonInfoType; // 버튼 정보
  modalContent: ModalContentsType; // 모달에 표시할 내용
}

export interface CommonConfirmModalLayoutPropsType {
  isVisible: boolean; // 애니메이션 상태 제어 (true = 보임, false = 숨김)
  confirmButtonInfo: ButtonInfoType; // 확인 버튼 정보
  cancelButtonInfo: ButtonInfoType; // 취소 버튼 정보
  onCloseComplete: () => void; // 페이드아웃 애니메이션 완료 시 호출
  children?: ReactNode; // 모달 내용 영역
  contentClassName?: string; // 콘텐츠 영역 overflow 등 커스터마이징
  severity?: ModalSeverity; // 모달 강조 종류 (기본 default)
  // 배경 클릭/하드웨어 백 등 "닫기만" 하는 경로 전용 핸들러
  // 미지정 시 기존처럼 cancelButtonInfo.onClick으로 동작 (하위 호환)
  onDismiss?: () => void;
}

export interface CommonConfirmModalPropsType {
  isOpen: boolean; // 모달 보임 상태 제어 (부모로부터 받음)
  confirmButtonInfo: ButtonInfoType; // 확인 버튼 정보
  cancelButtonInfo: ButtonInfoType; // 취소 버튼 정보
  modalContent: ModalContentsType; // 모달에 표시할 내용
  severity?: ModalSeverity; // 모달 강조 종류 (기본 default)
  onDismiss?: () => void; // 배경 클릭/하드웨어 백 닫기 전용 핸들러 (선택)
}
