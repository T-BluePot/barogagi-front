import type { PlanDataProps } from "@/types/main/plan/planListTypes";

export const findPlanByNum = (
  plans: PlanDataProps[], // 일정 리스트
  planNum: number | null // 선택된 일정 넘버
): PlanDataProps | null => {
  if (planNum == null) return null;
  return plans.find((p) => p.plan.planNum === planNum) ?? null;
};
