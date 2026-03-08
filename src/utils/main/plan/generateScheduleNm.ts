import type { RegionSearchItemType } from "@/types/api/scheduleTypes";

export const generateScheduleNm = (regions: RegionSearchItemType[]): string => {
  const regionNames = regions
    .map((r) => {
      const parts = r.regionNm.trim().split(" ");
      return parts[parts.length - 1];
    })
    .join(", ");
  return `${regionNames} 여행`;
};
