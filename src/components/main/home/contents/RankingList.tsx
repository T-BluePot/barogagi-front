import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IconBox from "@/components/common/IconBox";

interface RankingItem {
  rank: number;
  name: string;
  rankChange?: "up" | "down" | "same";
}

interface Props {
  rankings: RankingItem[];
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

  // 렌더링할 아이템 컴포넌트를 함수로 분리
  const renderItem = (item: RankingItem) => (
    <div className="flex items-center gap-3">
      <span className="typo-subtitle text-gray-black font-bold w-4">
        {item.rank}
      </span>
      <div className="flex items-center gap-1 w-full">
        <span className="typo-body text-gray-90">{item.name}</span>
        {item.rankChange === "up" && (
          <IconBox name="arrow_drop_up" width={24} className="text-alert-red" />
        )}
        {item.rankChange === "down" && (
          <IconBox
            name="arrow_drop_down"
            width={24}
            className="text-blue-500"
          />
        )}
      </div>
    </div>
  );
  /**
 * // 아래에서 위로 슬라이드 인
initial={{ y: "100%" }}

// 정상 위치로 애니메이션
animate={{ y: 0 }}

// 위로 슬라이드 아웃
exit={{ y: "-100%" }}

// 부드러운 easing과 0.5초 지속시간
transition={{ duration: 0.5, ease: "easeInOut" }}
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
            {renderItem(currentItem)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RankingList;
