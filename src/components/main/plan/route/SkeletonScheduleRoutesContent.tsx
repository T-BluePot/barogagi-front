import SkeletonBlock from "@/components/common/loading/SkeletonBlock";
import CommonLoading from "@/components/common/loading/CommonLoading";

/**
 * ScheduleRoutesContent 스켈레톤
 * - 배경: 스켈레톤 카드 placeholder
 * - 전면: dimmed 오버레이 + 로딩 스피너
 */
const SkeletonScheduleRoutesContent = () => {
  return (
    <div className="relative w-full h-full">
      {/* 배경 스켈레톤 */}
      <div className="flex flex-col w-full h-full bg-gray-5 px-6 pt-6 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonBlock
            key={idx}
            width="w-full"
            height="h-[100px]"
            rounded="rounded-xl"
          />
        ))}
      </div>

      {/* dimmed 오버레이 + 로딩 */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <CommonLoading message="AI가 일정을 생성하고 있어요" dark />
      </div>
    </div>
  );
};

export default SkeletonScheduleRoutesContent;
