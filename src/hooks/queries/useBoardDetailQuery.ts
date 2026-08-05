import { useQuery } from "@tanstack/react-query";

// === api ===
import { boardKeys } from "@/api/keyFactories";
import { BOARD_SUCCESS_CODE, getBoardDetail } from "@/api/queries";

// === type ===
import type { BaseResponse, BoardDetailDTO } from "@/api/types";

/**
 * 공지사항 상세 조회 훅
 *
 * 목록 응답에는 본문(`boardContent`)이 없어서 펼칠 때 따로 받아온다.
 *
 * @param boardNum 조회할 공지 번호. `undefined` 면 조회하지 않는다
 * @param enabled  아코디언이 펼쳐졌을 때만 true — 목록에 있는 공지를 전부 미리
 *                 받아오면 화면에 안 보이는 본문까지 다 내려받게 된다
 */
export const useBoardDetailQuery = (boardNum?: number, enabled = true) => {
  const query = useQuery<BaseResponse<BoardDetailDTO | null>>({
    queryKey: boardKeys.detail(boardNum ?? -1),
    // 목록과 마찬가지로 실패도 HTTP 200 으로 온다 → 코드를 보고 직접 throw 한다
    queryFn: async () => {
      // `enabled` 가 막아주지만, 단언(`boardNum!`)으로 타입을 속이지 않도록 직접 확인한다
      if (boardNum === undefined) {
        throw new Error("공지 번호가 없습니다.");
      }
      const res = await getBoardDetail(boardNum);
      if (res.code !== BOARD_SUCCESS_CODE) {
        throw new Error(res.message ?? "공지 내용을 불러오지 못했습니다.");
      }
      return res;
    },
    enabled: enabled && boardNum !== undefined,
  });

  return {
    notice: query.data?.data ?? undefined,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
