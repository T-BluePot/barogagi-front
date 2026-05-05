import SkeletonBlock from "@/components/common/loading/SkeletonBlock";

/**
 * TrendingCarousel 스켈레톤
 * - 원형 캐러셀 아이템(w-25 h-25) 5개 + 인디케이터 영역
 */
const SkeletonTrendingCarousel = () => {
  return (
    <div className="relative w-full">
      <div className="flex gap-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <SkeletonBlock
            key={idx}
            width="w-25"
            height="h-25"
            rounded="rounded-full"
            className="shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonTrendingCarousel;
