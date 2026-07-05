/**
 * 버튼 공통 색상 클래스 (DESIGN.md 버튼 레시피)
 * - 코랄(bg-main) 위 텍스트는 반드시 흰색
 * - 아웃라인은 흰 배경 + 피치 보더/텍스트
 * 모든 버튼 컴포넌트는 여기서 색상을 가져와 팔레트 변경 시 한 곳만 수정한다.
 */
export const BUTTON_COLOR = {
  /** 채움(primary): 코랄 배경 + 흰 글자 */
  filled: "bg-main text-white hover:bg-main-dark",
  filledDisabled: "bg-main-disable text-gray-50 cursor-not-allowed",
  /** 아웃라인(보조): 흰 배경 + 피치 보더/글자 */
  outlined:
    "bg-white border border-peach-border text-peach-text hover:bg-peach-light",
  outlinedDisabled:
    "bg-white border border-main-disable text-gray-30 cursor-not-allowed",
} as const;
