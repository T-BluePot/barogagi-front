import type {
  PlanRegistResDTO,
  PlanRegistReqDTO,
  PlanDetailVO,
} from "@/api/types";
/**
 * 일정 관련 타입 변환 함수 모음
 */

export const toCommonPlan = (vo: PlanDetailVO): PlanRegistResDTO => ({
  planNum: vo.planNum,
  planNm: vo.planNm,
  planLink: vo.planLink ?? undefined,
  planDescription: vo.planDescription,
  planAddress: vo.planAddress,
  planMemo: vo.planMemo,
  startTime: vo.startTime,
  endTime: vo.endTime,
  itemNum: vo.itemNum,
  itemNm: vo.itemNm,
  categoryNum: vo.categoryNum,
  categoryNm: vo.categoryNm,
  regionNum: vo.regionVOList[0]?.regionNum,
  regionNm:
    vo.regionVOList[0]?.regionLevel4 ?? vo.regionVOList[0]?.regionLevel3 ?? "",
  imageLink: vo.imageLink ?? undefined,
  planTagRegistResDTOList: vo.tagDetailVOList.map(({ tagNum, tagNm }) => ({
    tagNum,
    tagNm,
  })),
});

/** 재생성: 체크된(유지) 계획 → USER_PLACE 요청 DTO (AI가 건드리지 않음) */
export const toUserPlaceReq = (plan: PlanRegistResDTO): PlanRegistReqDTO => ({
  isUserAdded: "Y",
  isRandomCategory: "N",
  startTime: plan.startTime,
  endTime: plan.endTime,
  planNm: plan.planNm,
  userAddedPlaceDTO: {
    placeName: plan.planNm ?? plan.regionNm ?? "",
    placeUrl: plan.planLink,
    addressName: plan.planAddress ?? plan.regionNm,
  },
});

/** 재생성: 미체크 AI 계획 → AI 슬롯 요청 DTO (AI가 재추천) */
export const toAIReq = (plan: PlanRegistResDTO): PlanRegistReqDTO => {
  // categoryNum이 0/undefined면 유효 카테고리가 없는 것 → 랜덤 카테고리로 재추천
  const hasCategory = !!plan.categoryNum;
  return {
    isUserAdded: "N",
    isRandomCategory: hasCategory ? "N" : "Y",
    startTime: plan.startTime,
    endTime: plan.endTime,
    ...(hasCategory
      ? { itemNum: plan.itemNum, categoryNum: plan.categoryNum }
      : {}),
    regionRegistReqDTOList:
      plan.regionNum != null ? [{ regionNum: plan.regionNum }] : [],
    planTagRegistReqDTOList: (plan.planTagRegistResDTOList ?? []).map((t) => ({
      tagNum: t.tagNum,
    })),
  };
};

/** 재생성: 유지되는 USER_CUSTOM 계획 → 이름만 있는 사용자 계획 요청 DTO */
export const toUserCustomReq = (plan: PlanRegistResDTO): PlanRegistReqDTO => ({
  isUserAdded: "Y",
  isRandomCategory: "N",
  startTime: plan.startTime,
  endTime: plan.endTime,
  planNm: plan.planNm,
});
