interface HomeGreetingParams {
  userName: string;
  /** 다가오는 일정 존재 여부 */
  hasUpcomingSchedule: boolean;
  /** 인기 지역명 (조회 실패/없음이면 undefined) */
  popularRegionName?: string;
}

/**
 * 홈 인사 문구
 * 1. 다가오는 일정이 있는 경우
 * 2. 없는 경우 → 인기 지역 추천
 * 3. 없는데 인기 지역 조회 실패한 경우 → 기본 문구
 */
export const HOME_GREETING = ({
  userName,
  hasUpcomingSchedule,
  popularRegionName,
}: HomeGreetingParams) => {
  if (hasUpcomingSchedule) {
    return `${userName}님,\n곧 다가오는 일정이 있어요!`;
  }
  if (popularRegionName) {
    return `${userName}님,\n${popularRegionName}에서 하루 어떠세요?`;
  }
  return `${userName}님,\n특별한 일정을 만들어보세요!`;
};
