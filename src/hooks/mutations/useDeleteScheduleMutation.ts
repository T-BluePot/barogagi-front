import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import { scheduleKeys } from "@/api/keyFactories";
import { deleteSchedule } from "@/api/queries";

/**
 * 일정 삭제 뮤테이션 훅
 * - 삭제 성공 시 일정 목록 캐시를 무효화하여 최신 데이터 반영
 */
export const useDeleteScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleNum: number) => deleteSchedule(scheduleNum),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      toast("일정이 삭제되었습니다");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast(err.response?.data?.message ?? "일정 삭제에 실패했습니다.");
      } else {
        toast("일정 삭제에 실패했습니다.");
      }
    },
  });
};
