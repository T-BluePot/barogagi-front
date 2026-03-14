import type { ScheduleRegistResDTO } from "@/api/types";
import type { Schedule } from "@/types/scheduleTypes";

/**
 * API 응답 DTO(ScheduleRegistResDTO)를 UI 컴포넌트용 Schedule 타입으로 변환
 */
export const toSchedule = (dto: ScheduleRegistResDTO): Schedule => ({
  scheduleNum: dto.scheduleNum,
  membershipNo: 0,
  scheduleNm: dto.scheduleNm,
  startDate: dto.startDate,
  endDate: dto.endDate,
  radius: 0,
  regDate: "",
  delYn: "N",
  updDate: "",
  tags: (dto.scheduleTagRegistResDTOList ?? []).map((t) => ({
    tagNum: t.tagNum,
    tagNm: t.tagNm,
    tagType: "",
    categoryNum: 0,
  })),
});

/**
 * 일정 목록을 현재/지난 일정으로 분류
 * @param schedules 전체 일정 목록
 * @returns { current: 현재+미래 일정, past: 지난 일정 }
 */
export const splitSchedulesByDate = (
  schedules: Schedule[]
): { current: Schedule[]; past: Schedule[] } => {
  const today = new Date().toISOString().slice(0, 10);

  const current: Schedule[] = [];
  const past: Schedule[] = [];

  schedules.forEach((schedule) => {
    if (schedule.endDate < today) {
      past.push(schedule);
    } else {
      current.push(schedule);
    }
  });

  return { current, past };
};
