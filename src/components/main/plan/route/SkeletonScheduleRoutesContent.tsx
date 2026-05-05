import SkeletonBlock from "@/components/common/SkeletonBlock";

/**
 * ScheduleRoutesContent 스켈레톤
 * - AI 일정 생��� 중 표시되는 로딩 placeholder
 * - 헤더 + PlanDetailCard 3개 형태를 모방
 */
const SkeletonScheduleRoutesContent = () => {
  return (
    <div className="flex flex-col w-full h-full bg-gray-5">
      {/* 헤더 영역 */}
      <div className="flex flex-col w-full p-6 bg-gray-white gap-2">
        <SkeletonBlock width="w-32" height="h-3" rounded="rounded-sm" />
        <SkeletonBlock width="w-48" height="h-6" rounded="rounded-sm" />
      </div>

      {/* 카드 리스트 영역 */}
      <div className="flex flex-col flex-1 w-full p-6 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <SkeletonPlanDetailCard key={idx} />
        ))}
      </div>
    </div>
  );
};

/** PlanDetailCard 스켈레톤 */
const SkeletonPlanDetailCard = () => {
  return (
    <div className="flex flex-col items-baseline px-2 py-4 bg-gray-white rounded-xl gap-4 shadow-md">
      <div className="flex w-full justify-between items-baseline">
        <div className="flex flex-col justify-start items-start gap-2 pl-3">
          {/* 장소명 */}
          <SkeletonBlock width="w-28" height="h-5" rounded="rounded-sm" />
          {/* 시간 + 위치 */}
          <div className="flex flex-col gap-1">
            <SkeletonBlock width="w-36" height="h-3.5" rounded="rounded-sm" />
            <SkeletonBlock width="w-24" height="h-3.5" rounded="rounded-sm" />
          </div>
          {/* 태그 */}
          <div className="flex gap-2 mt-2">
            <SkeletonBlock width="w-12" height="h-5" rounded="rounded-full" />
            <SkeletonBlock width="w-16" height="h-5" rounded="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonScheduleRoutesContent;
