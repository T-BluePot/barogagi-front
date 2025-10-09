import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RankingItem, { type RankingItemData } from "./RankingItem";

interface Props {
  rankings: RankingItemData[];
  className?: string;
  rollInterval?: number; // 롤링 간격 (밀리초)
}

const RankingList = ({
  rankings,
  className = "",
  rollInterval = 3000,
}: Props) => {
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    // 순위가 없거나 1개면 롤링하지 않음
    if (rankings.length <= 1) return;

    const timer = setInterval(() => {
      setDisplayIndex((prev) => (prev + 1) % rankings.length);
    }, rollInterval);

    return () => clearInterval(timer);
  }, [rankings.length, rollInterval]);

  // rankings가 변경되면 첫 번째 항목으로 리셋
  useEffect(() => {
    setDisplayIndex(0);
  }, [rankings]);

  if (rankings.length === 0) return null;

  const currentItem = rankings[displayIndex];

  // 단일 아이템일 때는 애니메이션 없이 바로 렌더링
  if (rankings.length === 1) {
    return (
      <div className={`bg-gray-10 rounded-lg px-6 py-3 ${className}`}>
        <div className="h-8 flex items-center">
          <RankingItem item={currentItem} />
        </div>
      </div>
    );
  }

  /**
   * Framer Motion 애니메이션 설정:
   * - initial: 아래에서 시작 (y: "100%")
   * - animate: 정상 위치로 이동 (y: 0)
   * - exit: 위로 사라짐 (y: "-100%")
   * - transition: 0.5초 부드러운 easing
   */
  return (
    <div className={`bg-gray-10 rounded-lg px-6 py-3 ${className}`}>
      <div className="relative h-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayIndex}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center"
          >
            <RankingItem item={currentItem} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RankingList;
