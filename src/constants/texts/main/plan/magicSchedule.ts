export const MAGIC_SCHEDULE_TEXT = {
  HEADER_TITLE: "마법봉 일정",
  TITLE: "이대로 일정을 만들까요?",
  SUB_TITLE: "나머지는 마법봉이 알아서 채워드릴게요",
  SUMMARY: {
    DATE: "날짜",
    REGION: "지역",
    CHANGE: "변경",
  },
  TIME: {
    TITLE: "언제 놀까요?",
    HINT: "선택한 시간대를 2시간 단위로 나눠 채워요",
    EMPTY: "시간대를 고르지 않으면 11:00~19:00으로 만들어요",
    // 연속 구간이 깨지는 조작을 막을 때만 토스트로 알린다.
    // 화면에 상시 띄우면 정상 선택 중에도 경고를 보게 돼 잔소리처럼 읽힌다.
    BLOCKED_ADD: "시간대는 이어지게 골라주세요",
    BLOCKED_REMOVE: (label: string) => `${label} 시간대만 제외할 수 없어요`,
  },
  PREVIEW: {
    TITLE: "이렇게 채워져요",
    MEAL: "식사",
    RANDOM: "랜덤",
    CAPTION: "장소를 못 찾은 시간대는 비어서 올 수 있어요",
  },
  SUBMIT: "마법봉 흔들기",
  /** 로딩 오버레이에서 타이핑으로 순환하는 문구. 스크린리더에는 LOADING_SR 하나만 읽힌다. */
  LOADING_MESSAGES: [
    "마법봉 흔드는 중",
    "가장 멋진 카페를 찾는 중",
    "맛집을 찾는 중",
    "뭐하고 놀지 고민하는 중",
    "숨은 골목을 뒤지는 중",
    "동선을 다듬는 중",
    "사진 잘 나오는 곳 고르는 중",
    "걷기 좋은 길을 그리는 중",
    "저녁 먹을 곳 정하는 중",
    "마지막 마법을 거는 중",
  ],
  LOADING_SR: "마법봉이 일정을 만들고 있어요",
  ERROR: {
    MISSING: "날짜와 지역을 먼저 선택해주세요",
    FAILED: "일정 생성에 실패했습니다.",
  },
} as const;
