import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import { homeKeys, scheduleKeys } from "@/api/keyFactories";
import { deleteSchedule } from "@/api/queries";

/**
 * 일정 삭제 뮤테이션 훅
 * - 삭제 성공 시 일정 목록 캐시를 무효화하여 최신 데이터 반영
 * - HTTP 200이지만 BaseResponse.code가 성공이 아닌 경우를 검증
 */
export const useDeleteScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleNum: number) => {
      const res = await deleteSchedule(scheduleNum);

      if (!res.code.startsWith("S")) {
        throw new Error(res.message ?? "일정 삭제에 실패했습니다.");
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      // 홈 인사 문구는 일정 목록이 아니라 별도 요약 API(`home/me/schedules`)로 판단한다.
      // 같이 무효화하지 않으면 마지막 일정을 지웠을 때 목록은 비는데
      // 인사말은 "곧 다가오는 일정이 있어요!" 로 남는다.
      queryClient.invalidateQueries({ queryKey: homeKeys.mySchedules() });
      toast("일정이 삭제되었습니다");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast(err.response?.data?.message ?? "일정 삭제에 실패했습니다.");
      } else {
        toast(err.message || "일정 삭제에 실패했습니다.");
      }
    },
  });
};
