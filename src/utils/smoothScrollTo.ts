/**
 * 스크롤 컨테이너를 지정 위치로 부드럽게 이동시킨다.
 *
 * `scrollTo({ behavior: "smooth" })` 를 쓰지 않는 이유:
 * 브라우저 기본 스무스 스크롤은 **속도를 제어할 방법이 없고**, 짧은 거리에서도
 * 순간이동하듯 휙 지나가 위치 변화를 따라가기 어렵다.
 *
 * 그래서 rAF 로 직접 트윈한다.
 */

/**
 * 스크롤 전용 이징 — 약한 ease-in + 긴 ease-out.
 *
 * 두 가지를 모두 피한 결과다:
 * - `--ease-fitpl: cubic-bezier(0.2, 0, 0, 1)` (디자인 시스템 토큰)
 *   → 강한 ease-out 이라 **시작하자마자 최고 속도**다(실측: 44ms 만에 166px).
 *     버튼·모달처럼 짧은 거리의 상태 전환에는 맞지만, 화면이 통째로 움직이는
 *     스크롤에 쓰면 눈이 못 따라가 "휙 지나갔다"가 된다.
 * - 대칭 ease-in-out `cubic-bezier(0.45, 0, 0.55, 1)`
 *   → 시작에 뜸을 들여서 "멈칫 → 확 감 → 뚝 멈춤"으로 읽힌다.
 *
 * 살짝만 밀고 들어가 길게 감속하는 곡선이 스크롤에는 가장 매끄럽다.
 * (네이티브 스크롤 감속과 같은 성격)
 */
const EASE_SCROLL = [0.4, 0, 0.2, 1] as const;

/* 아래 3개가 속도 조절 손잡이다. 느리면 MS_PER_PX 를 올리고, 답답하면 내린다. */

/** 거리와 무관하게 최소 이만큼은 쓴다 — 짧은 이동이 튀어 보이지 않도록.
 *  실사용 이동량이 대부분 30~90px 라 사실상 이 값이 체감 속도를 결정한다. */
const MIN_DURATION_MS = 300;
/** 아무리 멀어도 이보다 오래 끌지 않는다 — 답답해지지 않도록 */
const MAX_DURATION_MS = 640;
/** 1px 당 소요 시간. 거리에 비례해 자연스럽게 늘어난다 */
const MS_PER_PX = 1.7;

/** CSS cubic-bezier 와 동일한 결과를 내는 이징 함수를 만든다 (x → y, Newton-Raphson) */
const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
  const a = (p1: number, p2: number) => 1 - 3 * p2 + 3 * p1;
  const b = (p1: number, p2: number) => 3 * p2 - 6 * p1;
  const c = (p1: number) => 3 * p1;

  const calc = (t: number, p1: number, p2: number) =>
    ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t;
  const slope = (t: number, p1: number, p2: number) =>
    3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1);

  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t = x;
    for (let i = 0; i < 5; i += 1) {
      const d = slope(t, x1, x2);
      if (d === 0) break;
      t -= (calc(t, x1, x2) - x) / d;
    }
    return calc(t, y1, y2);
  };
};

const ease = cubicBezier(...EASE_SCROLL);

/** 모션 최소화를 켠 사용자에게는 애니메이션 없이 즉시 이동한다 */
const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

interface SmoothScrollOptions {
  /** 지정하면 거리 기반 자동 계산 대신 이 값을 쓴다 (ms) */
  duration?: number;
}

/**
 * @returns 애니메이션을 중단하는 함수. 언마운트·재선택 시 호출해 이전 트윈을 정리한다.
 */
export const smoothScrollTo = (
  element: HTMLElement,
  top: number,
  { duration }: SmoothScrollOptions = {}
): (() => void) => {
  const start = element.scrollTop;
  const distance = top - start;

  if (distance === 0) return () => {};

  if (prefersReducedMotion()) {
    element.scrollTop = top;
    return () => {};
  }

  const ms =
    duration ??
    Math.min(
      MAX_DURATION_MS,
      Math.max(MIN_DURATION_MS, Math.abs(distance) * MS_PER_PX)
    );

  let rafId = 0;
  let startTime: number | null = null;

  const step = (now: number) => {
    if (startTime === null) startTime = now;
    const progress = Math.min(1, (now - startTime) / ms);

    element.scrollTop = start + distance * ease(progress);

    if (progress < 1) rafId = requestAnimationFrame(step);
  };

  rafId = requestAnimationFrame(step);

  return () => cancelAnimationFrame(rafId);
};
