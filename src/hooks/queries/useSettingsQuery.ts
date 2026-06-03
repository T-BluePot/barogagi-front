import { useQuery } from "@tanstack/react-query";

import { settingsKeys } from "@/api/keyFactories";
import { getSettings } from "@/api/queries";
import { toSettingsState } from "@/utils/api/settingsMapper";
import type { SettingsState } from "@/types/settingsTypes";

/**
 * 앱 설정 목록 조회 쿼리 훅
 * - 응답을 UI 상태(SettingsState)로 정규화하여 캐시에 저장 (낙관적 업데이트 용이)
 * - HTTP 200 이지만 BaseResponse.code 가 성공(S200)이 아닌 경우 에러로 처리
 */
export const useSettingsQuery = () => {
  return useQuery<SettingsState>({
    queryKey: settingsKeys.list(),
    queryFn: async () => {
      const res = await getSettings();

      if (res.code !== "S200") {
        throw new Error(res.message ?? "설정을 불러오지 못했습니다.");
      }

      return toSettingsState(res.data);
    },
  });
};
