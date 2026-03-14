import { useQuery } from "@tanstack/react-query";

import { scheduleKeys } from "@/api/keyFactories";
import { getScheduleList } from "@/api/queries";
import { toSchedule } from "@/utils/api/scheduleMapper";

/**
 * 내 일정 목록 조회 쿼리 훅
 * - API가 pastSchedules / upcomingSchedules로 분류하여 반환
 * - UI용 Schedule 타입으로 변환
 */
export const useScheduleListQuery = () => {
  const query = useQuery({
    queryKey: scheduleKeys.lists(),
    queryFn: getScheduleList,
    select: (res) => {
      const upcoming = (res.data?.upcomingSchedules ?? []).map(toSchedule);
      const past = (res.data?.pastSchedules ?? []).map(toSchedule);
      return { upcoming, past };
    },
  });

  return {
    current: query.data?.upcoming ?? [],
    past: query.data?.past ?? [],
    all: [...(query.data?.upcoming ?? []), ...(query.data?.past ?? [])],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
