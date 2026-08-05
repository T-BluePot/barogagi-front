import SkeletonBlock from "@/components/common/loading/SkeletonBlock";

/**
 * HotPlaceSection 캐러셀 스켈레톤
 * - HotPlaceCard(썸네일 + 이름)와 동일한 레이아웃으로 3장 표시
 */
const SkeletonHotPlaceCarousel = () => {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="w-[150px] shrink-0">
          <SkeletonBlock width="w-full" height="h-[104px]" rounded="rounded-xl" />
          <div className="mt-2">
            <SkeletonBlock width="w-3/4" height="h-4" rounded="rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonHotPlaceCarousel;
