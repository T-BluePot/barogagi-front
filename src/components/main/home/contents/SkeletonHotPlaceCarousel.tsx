import SkeletonBlock from "@/components/common/loading/SkeletonBlock";

/**
 * HotPlaceSection 캐러셀 스켈레톤
 *
 * HotPlaceCard 와 같은 구조로 3장 표시한다(실측 기준):
 *  - 썸네일 150x104 rounded-xl
 *  - 이름 13px 줄(mt-2) + 지역 11px 줄(mt-[3px])
 *
 * 바깥 여백(-mx-5.5 px-5.5)도 실제 캐러셀과 맞춘다. 이게 없으면 로딩이 끝나는 순간
 * 카드들이 좌우로 5.5 만큼 밀려 어긋난다.
 */
const SkeletonHotPlaceCarousel = () => {
  return (
    <div className="hide-scrollbar -mx-5.5 flex gap-3 overflow-hidden px-5.5 pt-0.5 pb-1">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="w-[150px] shrink-0">
          <SkeletonBlock
            width="w-full"
            height="h-[104px]"
            rounded="rounded-xl"
          />
          <div className="mt-2">
            <SkeletonBlock width="w-3/4" height="h-5" />
          </div>
          <div className="mt-[3px]">
            <SkeletonBlock width="w-1/2" height="h-[17px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonHotPlaceCarousel;
