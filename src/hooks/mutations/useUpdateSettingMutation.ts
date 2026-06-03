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
 * - 토글 즉시 반영(낙관적 업데이트) 후, 실패 시 "변경한 항목만" 이전 값으로 롤백
 *   → 서로 다른 항목을 동시에 토글해도 성공한 다른 항목을 덮어쓰지 않음
 * - 동시 토글 시 마지막 mutation 에서만 서버와 동기화하여 불필요한 재조회/레이스 방지
 * - HTTP 200 이지만 BaseResponse.code 가 성공(S202)이 아닌 경우를 검증
 */
export const useUpdateSettingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 동시성 게이팅(onSettled)에서 설정 관련 mutation 만 셀 수 있도록 키 부여
    mutationKey: settingsKeys.all,
    mutationFn: async ({ type, isOn }: UpdateSettingVariables) => {
      const res = await updateSetting(type, toSettingValue(isOn));

      if (res.code !== "S202") {
        throw new Error(res.message ?? "설정 변경에 실패했습니다.");
      }

      return res;
    },
    // 낙관적 업데이트: 변경 대상 항목만 즉시 캐시에 반영
    onMutate: async ({ type, isOn }) => {
      await queryClient.cancelQueries({ queryKey: settingsKeys.list() });
      const previous = queryClient.getQueryData<SettingsState>(
        settingsKeys.list()
      );

      queryClient.setQueryData<SettingsState>(settingsKeys.list(), (prev) => ({
        ...(prev ?? {}),
        [type]: isOn,
      }));

      // 변경 항목의 이전 값만 보관 (undefined = 캐시에 키가 없던 상태)
      return { previousValue: previous?.[type] };
    },
    // 실패 시 변경한 항목만 이전 값으로 롤백
    onError: (err, { type }, context) => {
      const previousValue = context?.previousValue;
      queryClient.setQueryData<SettingsState>(settingsKeys.list(), (prev) => {
        const next = { ...(prev ?? {}) };
        if (previousValue === undefined) {
          delete next[type];
        } else {
          next[type] = previousValue;
        }
        return next;
      });

      if (err instanceof AxiosError) {
        toast(err.response?.data?.message ?? "설정 변경에 실패했습니다.");
      } else {
        toast(err.message || "설정 변경에 실패했습니다.");
      }
    },
    // 동시 토글 중 마지막으로 끝나는 mutation 에서만 서버 상태와 동기화
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: settingsKeys.all }) === 1) {
        queryClient.invalidateQueries({ queryKey: settingsKeys.list() });
      }
    },
  });
};
