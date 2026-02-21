/**
 * 회원 탈퇴 모달 관련 텍스트 상수
 */

/** 탈퇴 사유 옵션 */
export const WITHDRAWAL_REASONS = [
  "서비스 이용이 불편해요",
  "원하는 기능이 없어요",
  "다른 서비스를 이용할 거예요",
  "기타",
] as const;

export type WithdrawalReason = (typeof WITHDRAWAL_REASONS)[number];

export const WITHDRAWAL_MODAL_TEXT = {
  TITLE: "회원 탈퇴",
  CONTENT: "탈퇴 시 모든 데이터가 삭제되며\n복구할 수 없습니다.",
  REASON_LABEL: "탈퇴사유",
  REASON_PLACEHOLDER: "탈퇴 사유를 선택해주세요.",
  DETAIL_PLACEHOLDER: "탈퇴 사유를 입력해주세요.",
  CONFIRM_LABEL: "확인",
  CANCEL_LABEL: "취소",
  SUCCESS_MESSAGE: "회원 탈퇴되었습니다.",
  FAIL_MESSAGE: "회원 탈퇴에 실패했습니다.\n다시 시도해주세요.",
} as const;
