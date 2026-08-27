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
  /**
   * 앱에서 카카오톡 전환이 실패했을 때. 버튼이 무반응으로 죽지 않도록
   * 링크를 대신 복사해 주고 그 사실을 알린다. (docs/RN_BRIDGE.md §11)
   */
  KAKAO_FAIL_COPIED:
    "카카오톡을 열지 못했어요. 링크를 복사했으니 붙여넣어 공유해 주세요.",

  ALERT_BUTTON_LABEL: "확인",

  /**
   * 카카오 공유 카드 설명 문구.
   * 닉네임을 못 가져온 경우(비로그인·조회 실패)엔 이름 없는 문구로 폴백한다.
   * ("알 수 없는 사용자님이 공유했어요" 같은 문구가 나가지 않도록)
   *
   * ⚠️ 이 문구는 index.html 의 og:title / og:description 과 짝을 이룬다.
   *    SDK 공유(이 파일)와 링크 붙여넣기(OG 태그)의 멘트가 갈리면 안 되므로
   *    여기를 고치면 index.html 도 같이 고칠 것.
   */
  KAKAO_CARD_DESCRIPTION: (nickname?: string) =>
    nickname
      ? `${nickname}님이 일정을 공유했어요. 핏플에서 확인해보세요.`
      : "새로운 일정이 기다리고 있어요. 핏플에서 확인해보세요.",
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

  /**
   * 설치 유도 CTA.
   *
   * 이 화면을 보는 사람은 링크를 받아 들어온 **비가입자**다. 핏플을 처음 보는 셈이라
   * 브랜드명을 별도 줄로 노출해 무엇을 설치하는 건지 알 수 있게 한다.
   *
   * ⚠️ 문구 길이에 여유가 없다. 360px 기준으로 아이콘(44px)·여백·버튼을 빼면
   *    텍스트에 약 170px 남는다 — 12자를 넘기면 두 줄이 되어 CTA 높이가 늘고
   *    그만큼 일정 목록이 가려진다. 늘릴 때는 실기기에서 줄바꿈을 확인할 것.
   */
  CTA_BRAND: "핏플",
  CTA_QUESTION: "어디 갈지 고민될 땐?",
  CTA_BUTTON: "설치하기",
} as const;
