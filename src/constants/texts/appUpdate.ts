/**
 * 앱 업데이트 안내 문구
 *
 * 카피 규칙: 존댓말 요-체(`~어요 / ~세요`). 단정형 `~다` 금지 (`.claude/design/DESIGN.md` §10)
 *
 * ⚠️ 강제(force) 업데이트 문구는 여기에 넣지 않는다 — 전체화면 컴포넌트를 #113 과 공유하기로 돼 있어
 *    설계 합의가 선행이다. 합의 전에 문구를 넣으면 UX 를 미리 굳히게 된다.
 */
export const APP_UPDATE_TEXT = {
  OPTIONAL_TITLE: "새 버전이 나왔어요",
  /**
   * 최신 버전을 못 받은 경우(서버 스펙 미확정)에는 버전 표기 없이 안내한다.
   * 🚫 더미 버전 문자열 금지 — `"undefined 버전"` 같은 문구가 새면 안 된다.
   */
  OPTIONAL_CONTENT: (latestVersion?: string) =>
    latestVersion
      ? `${latestVersion} 버전으로 업데이트하면 더 편하게 쓸 수 있어요.`
      : "업데이트하면 더 편하게 쓸 수 있어요.",
  OPTIONAL_CONFIRM: "업데이트",
  OPTIONAL_CANCEL: "나중에",
} as const;
