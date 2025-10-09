import { useState, useRef } from "react";
import { motion } from "framer-motion";
import TrendingCarouselItem, {
  type TrendingItem,
} from "./TrendingCarouselItem";

type Props = {
  items?: TrendingItem[];
};

const TrendingCarousel: React.FC<Props> = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 목 데이터 (실제로는 props나 API에서 받아와야 함)
  const mockItems: TrendingItem[] = [
    {
      id: 1,
      title: "분위기 좋은",
      subtitle: "카페",
      imageUrl:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 2,
      title: "낭만적인",
      subtitle: "데이트",
      imageUrl:
        "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 3,
      title: "맛있는",
      subtitle: "맛집",
      imageUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 4,
      title: "힐링되는",
      subtitle: "여행",
      imageUrl:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 5,
      title: "즐거운",
      subtitle: "액티비티",
      imageUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop&crop=center",
    },
  ];

  const displayItems = items.length > 0 ? items : mockItems;

  // 자동 슬라이드 기능 제거됨 - 수동 제어만 가능

  // 아이템 크기 계산 (w-25 = 100px, gap-4 = 16px)
  const itemWidth = 100; // 100px
  const gap = 16; // 16px
  const translateX = -(currentIndex * (itemWidth + gap));

  const handleDragEnd = (
    _: unknown,
    info: {
      offset: { x: number; y: number };
      velocity: { x: number; y: number };
    }
  ) => {
    const threshold = 30; // 더 민감한 드래그 임계값
    const velocityThreshold = 500; // 속도 기반 임계값

    // 속도나 거리 기준으로 슬라이드 변경 결정
    const shouldGoNext =
      info.offset.x < -threshold || info.velocity.x < -velocityThreshold;
    const shouldGoPrev =
      info.offset.x > threshold || info.velocity.x > velocityThreshold;

    if (shouldGoPrev && currentIndex > 0) {
      // 오른쪽으로 드래그 - 이전 슬라이드
      setCurrentIndex(currentIndex - 1);
    } else if (shouldGoNext && currentIndex < displayItems.length - 1) {
      // 왼쪽으로 드래그 - 다음 슬라이드
      setCurrentIndex(currentIndex + 1);
    }
    // 임계값에 도달하지 않으면 원래 위치로 스냅백
  };

  return (
    <div className="relative w-full">
      {/* 캐러셀 컨테이너 - 스크롤바 완전 숨김 */}
      <div
        className="overflow-visible scrollbar-hide"
        ref={containerRef}
        style={{
          // 모든 스크롤 차단
          touchAction: "pan-y", // 세로 스크롤만 허용 (페이지 스크롤)
          overscrollBehavior: "none",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        <motion.div
          className="flex gap-4 cursor-grab active:cursor-grabbing"
          animate={{ x: translateX }}
          drag="x"
          dragConstraints={{
            left: translateX,
            right: translateX,
          }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          whileDrag={{
            cursor: "grabbing",
          }}
        >
          {displayItems.map((item) => (
            <div key={item.id} className="pointer-events-none">
              <TrendingCarouselItem item={item} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* 인디케이터 (선택사항) */}
      <div className="flex justify-center mt-4 gap-2">
        {displayItems.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentIndex ? "bg-main-dark" : "bg-gray-30"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingCarousel;
