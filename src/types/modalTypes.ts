import type { ReactNode } from "react";

export interface ModalContentsType {
  title: string; // 모달 제목
  content: string; // 모달 내용
}

export interface ButtonInfoType {
  label: string; // 버튼 라벨
  onClick?: () => void; // 버튼 클릭 핸들러
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
}

export interface CommonConfirmModalPropsType {
  isOpen: boolean; // 모달 보임 상태 제어 (부모로부터 받음)
  confirmButtonInfo: ButtonInfoType; // 확인 버튼 정보
  cancelButtonInfo: ButtonInfoType; // 취소 버튼 정보
  modalContent: ModalContentsType; // 모달에 표시할 내용
}
