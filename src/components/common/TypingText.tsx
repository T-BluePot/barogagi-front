import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_FITPL } from "@/constants/motion";

interface TypingTextProps {
  /** 순환할 문구 목록 */
  items: string[];
  /** 한 글자 입력 간격(ms) */
  typeMs?: number;
  /** 다 친 뒤 머무는 시간(ms) */
  holdMs?: number;
  /**
   * 스크린리더에 읽힐 고정 문구.
   * 생략하면 현재 문구를 그대로 읽힌다(문구가 바될 때마다 한 번).
   * 상위 live region 안에서 쓰이므로, 순환이 쟦으면 이 값을 넘겨 한 번만 알린다.
   */
  srLabel?: string;
  /** 텍스트 스타일 (root 에 적용) */
  className?: string;
}

/** 문구가 사라지는 데 걸리는 시간(ms) — 아래 transition 과 맞춰야 한다 */
const EXIT_MS = 220;

/**
 * 문구를 한 글자씩 쳐서 보여주고, 다음 문구로 넘어가며 순환하는 텍스트.
 *
 * - 폭은 가장 긴 문구로 미리 잡아 두고 그 안에서 가운데 정렬한다.
 *   폭을 고정해야 문구가 바뀔 때 스피너와의 중심축이 흔들리지 않는다.
 * - 전환은 백스페이스가 아니라 페이드 아웃이다. 한 글자씩 지우면 거의 다 지워진 순간
 *   커서만 왼쪽 끝에 덩그러니 남아 스피너와 어긋나 보인다.
 * - 감소 모션 설정이면 타이핑 없이 문구만 교체한다.
 * - 표시 전용 — 어떤 문구를 넣을지는 상위가 결정한다. 슬라이드 전환이 필요하면
 *   [RotatingText](./RotatingText.tsx) 를 쓴다.
 */
const TypingText = ({
  items,
  typeMs = 55,
  holdMs = 1100,
  srLabel,
  className,
}: TypingTextProps) => {
  const shouldReduce = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // items 가 인라인 배열로 넘어와도 effect 가 매 렌더 재시작하지 않도록 ref 로 읽는다
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const count = items.length;

  // 감소 모션: 타이핑 없이 일정 간격으로 문구만 교체
  useEffect(() => {
    if (!shouldReduce || count <= 1) return;
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % count),
      holdMs + 900
    );
    return () => clearInterval(timer);
  }, [shouldReduce, count, holdMs]);

  useEffect(() => {
    if (shouldReduce || count === 0) return;

    const word = itemsRef.current[index] ?? "";

    // 1) 한 글자씩 입력
    if (!isExiting && charCount < word.length) {
      const timer = setTimeout(() => setCharCount((c) => c + 1), typeMs);
      return () => clearTimeout(timer);
    }

    // 문구가 하나뿐이면 다 친 뒤 그대로 둔다
    if (count <= 1) return;

    // 2) 다 쳤으면 잠시 머문 뒤 사라지기 시작
    if (!isExiting) {
      const timer = setTimeout(() => setIsExiting(true), holdMs);
      return () => clearTimeout(timer);
    }

    // 3) 사라진 뒤 다음 문구로
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % count);
      setCharCount(0);
      setIsExiting(false);
    }, EXIT_MS);
    return () => clearTimeout(timer);
  }, [index, charCount, isExiting, count, typeMs, holdMs, shouldReduce]);

  if (count === 0) return null;

  const current = items[index] ?? "";
  const visible = shouldReduce ? current : current.slice(0, charCount);
  const isTyping = !shouldReduce && !isExiting;
  // 가장 긴 문구로 폭을 미리 확보해 문구 전환 시 중심축 흔들림 방지
  const widest = items.reduce((a, b) => (b.length > a.length ? b : a), "");
  // 타이핑되는 글자는 항상 접근성 트리에서 감춘다 — 상위가 live region 이면
  // 한 글자마다 낭독되어 소음이 된다. 낭독은 여기 srText 로만 일어난다.
  const srText = srLabel ?? current;

  return (
    <span className={`relative inline-block text-center ${className ?? ""}`}>
      {srText && <span className="sr-only">{srText}</span>}

      {/* 폭 확보용 (보이지 않음) */}
      <span className="invisible block whitespace-pre" aria-hidden>
        {widest}
      </span>

      <motion.span
        className="absolute inset-0 block whitespace-pre"
        aria-hidden
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: EXIT_MS / 1000, ease: EASE_FITPL }}
      >
        {visible}
        {isTyping && (
          <span className="ml-0.5 inline-block h-[1em] w-[1.5px] translate-y-[0.15em] animate-pulse bg-current" />
        )}
      </motion.span>
    </span>
  );
};

export default TypingText;
