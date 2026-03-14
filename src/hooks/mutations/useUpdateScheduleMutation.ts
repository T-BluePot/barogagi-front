import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import { scheduleKeys } from "@/api/keyFactories";
import { updateSchedule } from "@/api/queries";
import type { ScheduleRegistResDTO } from "@/api/types";

/**
 * 일정 수정 뮤테이션 훅
 * - 수정 성공 시 일정 목록 및 상세 캐시를 무효화하여 최신 데이터 반영
 */
export const useUpdateScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScheduleRegistResDTO) => updateSchedule(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.detail(variables.scheduleNum),
      });
      toast("일정이 수정되었습니다");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast(err.response?.data?.message ?? "일정 수정에 실패했습니다.");
      } else {
        toast("일정 수정에 실패했습니다.");
      }
    },
  });
};
