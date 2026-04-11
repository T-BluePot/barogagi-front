import type { PlanRegistResDTO, PlanDetailVO } from "@/api/types";
/**
 * 일정 관련 타입 변환 함수 모음
 */

export const toCommonPlan = (vo: PlanDetailVO): PlanRegistResDTO => ({
  planNum: vo.planNum,
  planNm: vo.planNm,
  planLink: vo.planLink ?? undefined,
  planDescription: vo.planDescription,
  startTime: vo.startTime,
  endTime: vo.endTime,
  itemNum: vo.itemNum,
  itemNm: vo.itemNm,
  categoryNum: vo.categoryNum,
  categoryNm: vo.categoryNm,
  regionNum: vo.regionVOList[0]?.regionNum ?? 0,
  regionNm:
    vo.regionVOList[0]?.regionLevel4 ?? vo.regionVOList[0]?.regionLevel3 ?? "",
  planTagRegistResDTOList: vo.tagDetailVOList.map(({ tagNum, tagNm }) => ({
    tagNum,
    tagNm,
  })),
  planSource: "USER_CUSTOM",
});
