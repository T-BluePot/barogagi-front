/**
 * 공지사항(Board) 관련 API 요청 함수
 */
import { apiKeyHttp } from "../client";
import { ENDPOINTS } from "../endpoints";

import type { BaseResponse, BoardDetailDTO, BoardListItemDTO } from "../types";

/** 이 API 의 성공 코드. 다른 API 의 `S200`/`M200` 과 형식이 다르다 */
export const BOARD_SUCCESS_CODE = "SUCCESS";

/**
 * 공지사항 목록 조회
 *
 * ⚠️ **API-KEY 와 로그인 토큰이 둘 다 필요하다** — 그래서 `apiKeyHttp` 를 쓴다.
 *    `http` 로는 API-KEY 가 빠져 HTTP 200 + `A100`(잘못된 접근)이 온다.
 * ⚠️ 스웨거에 `page` 쿼리가 있으나 넘기면 `COMMON-500` 이 난다. 붙이지 않는다.
 *
 * 중요 공지(`isImportant === "Y"`)는 서버가 상단에 고정해 내려주므로 재정렬하지 않는다.
 */
export const getBoardList = async () => {
  const response = await apiKeyHttp.get<BaseResponse<BoardListItemDTO[] | null>>(
    ENDPOINTS.BOARD.LIST
  );
  return response.data;
};

/** 공지사항 상세 조회 (본문 포함). 목록과 동일하게 API-KEY + 토큰이 필요하다 */
export const getBoardDetail = async (boardNum: number) => {
  const response = await apiKeyHttp.get<BaseResponse<BoardDetailDTO | null>>(
    ENDPOINTS.BOARD.DETAIL,
    { params: { boardNum } }
  );
  return response.data;
};
