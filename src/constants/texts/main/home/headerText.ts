interface HomeGreetingParams {
  userName: string;
  /** 다가오는 일정 존재 여부 */
  hasUpcomingSchedule: boolean;
  /** 인기 지역명 (조회 실패/없음이면 undefined) */
  popularRegionName?: string;
  /** 일정/인기지역 로딩 중 여부 (확정 전엔 기본 문구로 고정해 깜빡임 방지) */
  isLoading?: boolean;
}

/** 인사 타이틀을 강조 구간 기준으로 분리한 구조 (highlight만 코랄로 렌더링) */
export interface HomeGreetingParts {
  lead: string;
  highlight?: string;
  tail: string;
}

/** 인사말 아래 서브 카피 (디자인 레퍼런스 카피) */
export const HOME_GREETING_SUB =
  "고민없이 바로가는 만남 · 날씨도 좋고, 거리도 가까워요";

/**
 * 홈 인사 문구
 * 0. 로딩 중 → 기본 문구 (확정 전 깜빡임 방지)
 * 1. 다가오는 일정이 있는 경우
 * 2. 없는 경우 → 인기 지역 추천
 * 3. 없는데 인기 지역 조회 실패한 경우 → 기본 문구
 */
export const HOME_GREETING = ({
  userName,
  hasUpcomingSchedule,
  popularRegionName,
  isLoading,
}: HomeGreetingParams): HomeGreetingParts => {
  if (!isLoading && hasUpcomingSchedule) {
    return {
      lead: `${userName}님,\n곧 `,
      highlight: "다가오는 일정",
      tail: "이 있어요!",
    };
  }
  if (!isLoading && popularRegionName) {
    return {
      lead: `${userName}님,\n오늘 `,
      highlight: `${popularRegionName} 데이트 코스`,
      tail: "가 있어요!",
    };
  }
  return {
    lead: `${userName}님,\n`,
    highlight: "특별한 일정",
    tail: "을 만들어보세요!",
  };
};
