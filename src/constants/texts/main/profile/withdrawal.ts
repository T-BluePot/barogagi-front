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
  TITLE: "정말 탈퇴하시겠습니까?",
  /** 확인 사항 섹션 제목 */
  NOTICE_TITLE: "탈퇴 전 아래 사항을 확인해주세요",
  /**
   * 탈퇴 전 확인 사항. 한 문단으로 붙이면 가운데 정렬된 긴 글이 되어 읽히지 않아
   * 항목으로 끊어 왼쪽 정렬로 노출한다.
   *
   * 탈퇴 후 7일 유예가 있고, 그 안에 다시 로그인하면 탈퇴가 취소된다(서버 정책).
   * 유예 중 로그인은 별도 확인 없이 그대로 통과시키므로(트위터/인스타 방식),
   * "다시 로그인하면 취소된다"는 사실을 **탈퇴하는 이 시점에** 알려야 한다.
   * 여기서 안 알리면 나중에 로그인했을 때 계정이 살아난 이유를 알 수 없다.
   *
   * ⚠️ 유예 기간을 담는 API 는 아직 없다. 7일은 서버 정책값을 문구에 박아둔 것이라,
   *    API 가 나오면 응답값으로 바꾼다(정책이 바뀌면 문구만 남아 거짓이 된다).
   */
  NOTICES: [
    "탈퇴 후 7일 이내에 다시 로그인하면 탈퇴가 취소됩니다.",
    "7일이 지나면 모든 데이터가 삭제되며 복구할 수 없습니다.",
  ],
  REASON_LABEL: "탈퇴사유",
  REASON_PLACEHOLDER: "탈퇴 사유를 선택해주세요.",
  DETAIL_PLACEHOLDER: "탈퇴 사유를 입력해주세요.",
  CONFIRM_LABEL: "확인",
  CANCEL_LABEL: "취소",
  SUCCESS_MESSAGE: "회원 탈퇴되었습니다.",
  FAIL_MESSAGE: "회원 탈퇴에 실패했습니다.\n다시 시도해주세요.",
} as const;
