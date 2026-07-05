import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface RotatingTextProps {
  /** 순환할 문구 목록 */
  items: string[];
  /** 문구 전환 간격(ms) */
  intervalMs?: number;
  /** 텍스트/여백 스타일 (root에 적용, 자식 문구가 상속) */
  className?: string;
}

/**
 * 여러 문구를 위로 넘어가듯(슬라이드 + 페이드) 순환 노출하는 텍스트.
 * - DESIGN.md 모션 규칙 준수: 페이드 + 슬라이드만(바운스/스케일 금지), ease-fitpl 커브
 * - 접근성: 감소 모션 설정 시 슬라이드 없이 페이드만
 * - 표시 전용: 어떤 문구를 넣을지는 상위(예: 날씨 데이터)가 결정
 */
const RotatingText = ({
  items,
  intervalMs = 3500,
  className,
}: RotatingTextProps) => {
  const [index, setIndex] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [items.length, intervalMs]);

  // 문구가 하나 이하면 애니메이션 없이 정적 렌더
  if (items.length <= 1) {
    return <span className={`block ${className ?? ""}`}>{items[0] ?? ""}</span>;
  }

  // 가장 긴 문구로 한 줄 높이를 미리 확보해 전환 시 레이아웃 점프 방지
  const tallest = items.reduce((a, b) => (b.length > a.length ? b : a), "");
  const slide = shouldReduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { y: "100%", opacity: 0 },
        animate: { y: "0%", opacity: 1 },
        exit: { y: "-100%", opacity: 0 },
      };

  return (
    <span className={`relative block overflow-hidden ${className ?? ""}`}>
      {/* 높이 확보용 (보이지 않음) */}
      <span className="invisible block" aria-hidden>
        {tallest}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={index}
          className="absolute inset-0 block"
          initial={slide.initial}
          animate={slide.animate}
          exit={slide.exit}
          transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
