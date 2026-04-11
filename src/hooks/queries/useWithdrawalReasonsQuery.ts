import { useQuery } from "@tanstack/react-query";

import { authKeys } from "@/api/keyFactories";
import { getWithdrawalReasons } from "@/api/queries/authQueries";

/**
 * 탈퇴 사유 목록 조회 쿼리 훅
 */
export const useWithdrawalReasonsQuery = () => {
  const query = useQuery({
    queryKey: authKeys.withdrawalReasons(),
    queryFn: getWithdrawalReasons,
    staleTime: Infinity,
  });

  return {
    reasons: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
