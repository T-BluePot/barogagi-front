/**
 * 모션 공통 상수 (JavaScript 애니메이션용)
 *
 * framer-motion 은 `transition.ease` 에 CSS 변수를 받지 못한다.
 * 그래서 `globals.css` 의 `--ease-fitpl` 과 **같은 값**을 여기에 한 번 더 둔다.
 *
 * ⚠️ 한쪽만 바꾸면 CSS 전환(버튼 hover 등)과 JS 애니메이션의 감속이 어긋난다.
 *    곡선을 바꿀 일이 생기면 `globals.css` 의 `--ease-fitpl` 과 이 값을 같이 고친다.
 *
 * 스크롤 이동에는 쓰지 않는다 — 시작하자마자 최고 속도라 화면이 통째로 움직이면
 * 눈이 못 따라간다. 그쪽은 `utils/smoothScrollTo` 가 전용 곡선을 갖는다.
 */
export const EASE_FITPL: [number, number, number, number] = [0.2, 0, 0, 1];
