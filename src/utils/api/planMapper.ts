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
  // 유지한 AI 계획의 장소 한줄 설명을 그대로 보존해 재생성 후에도 남게 한다.
  ...(plan.planDescription
    ? { planDescription: plan.planDescription }
    : {}),
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
  ...(plan.planDescription
    ? { planDescription: plan.planDescription }
    : {}),
});

/**
 * 일정 수정(PUT) 전송용 정규화.
 * 사용자가 만든 계획(장소/직접입력)은 `isUserAdded:"Y"`로 표시해 서버 아이템 조회를
 * 스킵시키고, 남아 있는 AI 아이템 참조(itemNum/categoryNum)를 제거한다.
 * (상세 조회 응답엔 planSource/isUserAdded가 없어, 유효 itemNum이 없는 계획도 사용자 계획으로 간주)
 * AI 계획(유효 itemNum 보유)은 그대로 두어 서버가 아이템을 조회한다.
 */
export const normalizePlanForUpdate = (
  plan: PlanRegistResDTO
): PlanRegistResDTO => {
  const isUserMade =
    plan.planSource === "USER_PLACE" ||
    plan.planSource === "USER_CUSTOM" ||
    plan.isUserAdded === "Y" ||
    !plan.itemNum; // 유효 itemNum(양수) 없음 → 사용자 계획으로 간주

  if (!isUserMade) return plan;

  const next: PlanRegistResDTO = { ...plan, isUserAdded: "Y" };
  // 아이템 조회를 유발하는 참조 제거 (추가 플로우와 동일하게 신규 사용자 계획으로 처리)
  delete next.itemNum;
  delete next.categoryNum;
  return next;
};
