import type { ScheduleListItemDTO } from "@/api/types";
import type { Schedule } from "@/types/scheduleTypes";

/**
 * API 목록 응답 DTO(ScheduleListItemDTO)를 UI 컴포넌트용 Schedule 타입으로 변환
 */
export const toSchedule = (dto: ScheduleListItemDTO): Schedule => ({
  scheduleNum: dto.scheduleNum,
  scheduleNm: dto.scheduleNm,
  startDate: dto.startDate,
  endDate: dto.endDate,
  tags: (dto.scheduleTagRegistResDTOList ?? []).map((t) => ({
    tagNum: t.tagNum,
    tagNm: t.tagNm,
  })),
});
