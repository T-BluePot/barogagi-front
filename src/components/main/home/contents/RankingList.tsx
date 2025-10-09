import { useState, useEffect } from "react";
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
  // 현재 보여질 순위의 인덱스
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    // 순위가 없거나 1개면 롤링하지 않음
    if (rankings.length <= 1) return;

    const timer = setInterval(() => {
      setDisplayIndex((prev) => (prev + 1) % rankings.length);
    }, rollInterval);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timer);
  }, [rankings.length, rollInterval]);

  // rankings가 변경되면 첫 번째 항목으로 리셋
  useEffect(() => {
    setDisplayIndex(0);
  }, [rankings]);

  // 순위가 없으면 아무것도 렌더링하지 않음
  if (rankings.length === 0) return null;

  // 현재 표시할 항목
  const currentItem = rankings[displayIndex];

  return (
    <div className={`bg-gray-10 rounded-lg px-6 py-3 ${className}`}>
      {/* 한 번에 하나의 순위만 표시 */}
      <div className="flex items-center gap-3 h-8">
        <span className="typo-subtitle text-gray-black font-bold w-4">
          {currentItem.rank}
        </span>
        <div className="flex items-center gap-1 w-full">
          <span className="typo-body text-gray-90">{currentItem.name}</span>
          {currentItem.rankChange === "up" && (
            <IconBox
              name="arrow_drop_up"
              width={24}
              className="text-alert-red"
            />
          )}
          {currentItem.rankChange === "down" && (
            <IconBox
              name="arrow_drop_down"
              width={24}
              className="text-blue-500"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingList;
