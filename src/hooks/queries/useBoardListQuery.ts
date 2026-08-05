import { useQuery } from "@tanstack/react-query";

// === api ===
import { boardKeys } from "@/api/keyFactories";
import { BOARD_SUCCESS_CODE, getBoardList } from "@/api/queries";

// === type ===
import type { BaseResponse, BoardListItemDTO } from "@/api/types";

/**
 * 공지사항 목록 조회 훅 (알림 화면)
 *
 * ⚠️ 이 API 는 **실패도 HTTP 200** 으로 온다(예: `A100 잘못된 접근`).
 *    코드를 확인해 직접 throw 하지 않으면 axios 가 성공으로 넘겨서
 *    `data: null` → 빈 배열이 되고, 화면에 "받은 알림이 없어요"가 뜬다.
 *    오류를 "알림 없음"으로 보여주면 원인을 찾을 수 없다.
 *
 * 정렬하지 않는다. 중요 공지(`isImportant === "Y"`)를 상단에 고정하는 건 서버 몫이다.
 */
export const useBoardListQuery = () => {
  const query = useQuery<BaseResponse<BoardListItemDTO[] | null>>({
    queryKey: boardKeys.list(),
    queryFn: async () => {
      const res = await getBoardList();
      if (res.code !== BOARD_SUCCESS_CODE) {
        throw new Error(res.message ?? "공지사항을 불러오지 못했습니다.");
      }
      return res;
    },
  });

  return {
    notices: Array.isArray(query.data?.data) ? query.data.data : [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
