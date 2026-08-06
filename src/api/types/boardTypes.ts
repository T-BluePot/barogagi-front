/**
 * 공지사항(Board) 관련 API 타입
 *
 * ⚠️ 이 API 는 성공 코드가 `"SUCCESS"` 다 — 다른 API 의 `S200` / `M200` 과 형식이 다르다.
 *    코드로 성공을 판정할 때 주의한다.
 * ⚠️ 목록·상세 모두 **로그인 토큰이 필요**하다. API-KEY 만으로는 실패한다(실측).
 */

/** 목록 아이템 — 본문(`boardContent`)은 상세에서만 온다 */
export interface BoardListItemDTO {
  boardNum: number;
  boardTitle: string;
  /** 첨부 이미지. 없으면 null */
  imageUrl: string | null;
  /** 중요 공지 여부 — "Y" 면 서버가 목록 상단에 고정해 내려준다 */
  isImportant: string;
  /** ISO 문자열 (예: "2026-05-30T23:07:42") */
  regDate: string;
}

/** 상세 — 목록 필드 + 본문 */
export interface BoardDetailDTO extends BoardListItemDTO {
  /** 줄바꿈(`\n`)이 포함된 원문 */
  boardContent: string;
}
