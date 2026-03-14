import type { ScheduleListItemDTO } from "@/api/types";
import type { Schedule } from "@/types/scheduleTypes";

/**
 * API 목록 응답 DTO(ScheduleListItemDTO)를 UI 컴포넌트용 Schedule 타입으로 변환
 */
export const toSchedule = (dto: ScheduleListItemDTO): Schedule => ({
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
