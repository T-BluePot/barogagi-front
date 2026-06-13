import { useEffect, useRef } from "react";

interface UseScrollStepParams {
  /** 순환/이동에 사용할 값 목록 (현재 값과 동일한 포맷이어야 함) */
  items: string[];
  /** 현재 값 */
  value: string;
  /** 스크롤/드래그로 값이 한 칸 바뀔 때 호출 */
  onChange: (value: string) => void;
  /** 끝에서 다음으로 넘어갈 때 순환할지 (시/분: true) */
  wrap?: boolean;
}

// 한 단계(한 칸 이동)로 인식할 드래그 거리(px)
const STEP_PX = 22;

/**
 * 기존 입력칸 UI를 유지한 채, 휠(데스크톱)·세로 드래그(모바일)로
 * 값을 한 칸씩 증감시키는 핸들러를 제공한다.
 * - 반환된 props를 input/button에 그대로 펼쳐 넣으면 됨
 * - 탭(클릭/포커스)은 막지 않으므로 직접 입력은 그대로 동작
 */
export const useScrollStep = ({
  items,
  value,
  onChange,
  wrap = false,
}: UseScrollStepParams) => {
  const lastYRef = useRef(0);
  const accRef = useRef(0);
  // 한 번의 드래그 이벤트에서 여러 칸을 이동할 때, 직전 step의 결과를 이어받기 위해
  // 현재 인덱스를 ref로 들고 있는다 (클로저의 value는 리렌더 전까지 갱신되지 않으므로).
  const indexRef = useRef(items.indexOf(value));

  // 외부에서 value가 바뀌면(리렌더 후) 인덱스를 다시 맞춰준다.
  useEffect(() => {
    indexRef.current = items.indexOf(value);
  }, [items, value]);

  const step = (dir: 1 | -1) => {
    const index = indexRef.current;
    if (index === -1) return;
    let next = index + dir;
    if (wrap) {
      next = (next + items.length) % items.length;
    } else {
      next = Math.min(items.length - 1, Math.max(0, next));
    }
    if (next !== index) {
      indexRef.current = next;
      onChange(items[next]);
    }
  };

  return {
    style: { touchAction: "none" as const },
    onWheel: (e: React.WheelEvent) => {
      step(e.deltaY > 0 ? 1 : -1);
    },
    onTouchStart: (e: React.TouchEvent) => {
      lastYRef.current = e.touches[0].clientY;
      accRef.current = 0;
    },
    onTouchMove: (e: React.TouchEvent) => {
      const y = e.touches[0].clientY;
      // 위로 밀면(=y 감소) 다음 값(증가)
      accRef.current += lastYRef.current - y;
      lastYRef.current = y;
      while (accRef.current >= STEP_PX) {
        step(1);
        accRef.current -= STEP_PX;
      }
      while (accRef.current <= -STEP_PX) {
        step(-1);
        accRef.current += STEP_PX;
      }
    },
  };
};
