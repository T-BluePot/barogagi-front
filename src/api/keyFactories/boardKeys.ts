/**
 * 공지사항(Board) 관련 Query Key Factory
 */

export const boardKeys = {
  /** board 관련 모든 쿼리의 기본 키 */
  all: ["board"] as const,

  /**
   * 공지사항 목록 조회 키.
   * 서버 `page` 파라미터가 동작하지 않아(COMMON-500) 페이지 구분 없이 단일 키를 쓴다.
   */
  list: () => [...boardKeys.all, "list"] as const,

  /** 공지사항 상세 조회 키 */
  detail: (boardNum: number) =>
    [...boardKeys.all, "detail", boardNum] as const,
} as const;
