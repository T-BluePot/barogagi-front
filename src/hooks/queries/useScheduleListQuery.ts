import { useQuery } from "@tanstack/react-query";

import { scheduleKeys } from "@/api/keyFactories";
import { getScheduleList } from "@/api/queries";
import { toSchedule, splitSchedulesByDate } from "@/utils/api/scheduleMapper";

/**
 * 내 일정 목록 조회 쿼리 훅
 * - API 응답을 UI용 Schedule 타입으로 변환
 * - 현재/지난 일정으로 자동 분류
 */
export const useScheduleListQuery = () => {
  const query = useQuery({
    queryKey: scheduleKeys.lists(),
    queryFn: getScheduleList,
    select: (res) => {
      const schedules = (res.data ?? []).map(toSchedule);
      return splitSchedulesByDate(schedules);
    },
  });

  return {
    current: query.data?.current ?? [],
    past: query.data?.past ?? [],
    all: [...(query.data?.current ?? []), ...(query.data?.past ?? [])],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
