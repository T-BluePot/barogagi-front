import type { Schedule } from "@/types/schedule";

/**
 * 일정 배열에서 날짜만 추출하여 중복 없이 표시할 markedDates 객체를 반환합니다.
 * @param schedules 일정 배열
 * @returns { [date: string]: true }
 */
export function getMarkedDates(schedules: Schedule[]): Record<string, true> {
  const marked: Record<string, true> = {};
  schedules.forEach((schedule) => {
    marked[schedule.date] = true;
  });
  return marked;
}
