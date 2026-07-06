export const SCHEDULE_STYLE_TEXT = {
  HEADER_TITLE: "일정 스타일 선택",
  TITLE: "일정 스타일 태그",
  SUB_TITLE: "마음에 드는 일정 스타일 태그를 최대 5개까지 선택해주세요",
  SEC_TITLE: "일정 참고사항",
  SEC_SUB_TITLE: "일정을 더 즐겁게 만들 포인트를 남겨주세요",
  AGE_LABEL: "연령대",
  AGE_HINT: "다중 선택 가능",
  PEOPLE_LABEL: "인원수",
  PURPOSE_LABEL: "목적",
  PURPOSE_PLACEHOLDER: "예) 데이트",
  NOTE_LABEL: "추가사항",
  PLACEHOLDER: "일정 스타일, 선호 사항 등을 자유롭게 적어주세요",
  NEXT_BUTTON: "일정 생성하기",
} as const;

/** 연령대 선택지 (다중 선택) */
export const AGE_OPTIONS = [
  "10대",
  "20대",
  "30대",
  "40대",
  "50대",
  "60대 이상",
] as const;
