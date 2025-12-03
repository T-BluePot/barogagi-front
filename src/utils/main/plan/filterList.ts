import type { PlanDataProps } from "@/types/main/plan/planListTypes";

// 내 일정 페이지에서 넘어온 scheduleNum 값을 기반으로 plans를 필터링하는 함수
export const filterPlansByScheduleNum = (
  isDetail: boolean,
  plans: PlanDataProps[],
  scheduleNum?: number
): PlanDataProps[] => {
  // id가 없으면 전체 plans 반환
  if (!isDetail || !scheduleNum) return plans;

  // id가 있으면 해당 id만 필터링
  return plans.filter((item) => item.plan.scheduleNum === scheduleNum);
};

// 선택된 계획만 필터링하는 함수
export const findPlanByNum = (
  plans: PlanDataProps[], // 일정 리스트
  planNum: number | null // 선택된 일정 넘버
): PlanDataProps | null => {
  if (planNum == null) return null;
  return plans.find((p) => p.plan.planNum === planNum) ?? null;
};
