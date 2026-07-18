/** 일정 공유 관련 텍스트 */
export const SHARE_TEXT = {
  SHEET_TITLE: "일정 공유",
  SHEET_DESCRIPTION: "링크가 있는 사람은 이 일정을 볼 수 있어요",

  COPY_BUTTON: "URL 복사",
  COPY_SUCCESS: "링크가 복사되었습니다.",
  COPY_FAIL: "클립보드 복사에 실패했습니다.",

  KAKAO_BUTTON: "카카오톡",
  MORE_BUTTON: "더보기",

  SHARE_ARIA: "일정 공유",

  LINK_LOADING: "링크를 만드는 중이에요",
  LINK_ERROR: "링크를 만들지 못했어요. 잠시 후 다시 시도해 주세요.",

  KAKAO_FAIL: "카카오톡 공유를 열지 못했습니다.",

  ALERT_BUTTON_LABEL: "확인",

  /**
   * 카카오 공유 카드 설명 문구.
   * 닉네임을 못 가져온 경우(비로그인·조회 실패)엔 이름 없는 문구로 폴백한다.
   * ("알 수 없는 사용자님이 공유했어요" 같은 문구가 나가지 않도록)
   */
  KAKAO_CARD_DESCRIPTION: (nickname?: string) =>
    nickname
      ? `${nickname}님이 일정을 공유했어요. 핏플에서 확인해보세요.`
      : "핏플에서 만든 일정이에요. 링크로 확인해보세요.",
  KAKAO_CARD_BUTTON: "일정 보기",
} as const;

/** 공유 링크로 진입한 사용자에게 보여줄 공개 뷰 텍스트 */
export const SHARED_VIEW_TEXT = {
  LOADING: "일정을 불러오는 중이에요",

  /** 만료/미존재는 서버가 같은 코드(SS400)로 내려주므로 구분해서 안내할 수 없다 */
  EMPTY_TITLE: "일정을 볼 수 없어요",
  EMPTY_DESCRIPTION: "만료되었거나 존재하지 않는 링크예요.",

  ERROR_TITLE: "일정을 불러오지 못했어요",
  ERROR_DESCRIPTION: "잠시 후 다시 시도해 주세요.",

  CTA_QUESTION: "이런 일정을 직접 만들어 보고 싶다면?",
  CTA_BUTTON: "핏플 설치하기",
} as const;
