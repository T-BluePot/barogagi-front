import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import { settingsKeys } from "@/api/keyFactories";
import { updateSetting } from "@/api/queries";
import { toSettingValue } from "@/utils/api/settingsMapper";
import type { SettingType } from "@/api/types";
import type { SettingsState } from "@/types/settingsTypes";

interface UpdateSettingVariables {
  type: SettingType;
  isOn: boolean;
}

/**
 * 앱 설정 수정 뮤테이션 훅
 * - 토글 즉시 반영(낙관적 업데이트) 후, 실패 시 이전 상태로 롤백
 * - HTTP 200 이지만 BaseResponse.code 가 성공(S202)이 아닌 경우를 검증
 */
export const useUpdateSettingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, isOn }: UpdateSettingVariables) => {
      const res = await updateSetting(type, toSettingValue(isOn));

      if (res.code !== "S202") {
        throw new Error(res.message ?? "설정 변경에 실패했습니다.");
      }

      return res;
    },
    // 낙관적 업데이트: 토글 결과를 즉시 캐시에 반영
    onMutate: async ({ type, isOn }) => {
      await queryClient.cancelQueries({ queryKey: settingsKeys.list() });
      const previous = queryClient.getQueryData<SettingsState>(
        settingsKeys.list()
      );

      queryClient.setQueryData<SettingsState>(settingsKeys.list(), (prev) => ({
        ...(prev ?? {}),
        [type]: isOn,
      }));

      return { previous };
    },
    onError: (err, _variables, context) => {
      // 실패 시 이전 상태로 롤백
      if (context?.previous !== undefined) {
        queryClient.setQueryData(settingsKeys.list(), context.previous);
      }

      if (err instanceof AxiosError) {
        toast(err.response?.data?.message ?? "설정 변경에 실패했습니다.");
      } else {
        toast(err.message || "설정 변경에 실패했습니다.");
      }
    },
    // 성공/실패 무관하게 서버 상태와 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.list() });
    },
  });
};
