import SkeletonBlock from "@/components/common/SkeletonBlock";

/**
 * ScheduleCard 스켈레톤
 * - ScheduleCard와 동일한 레이아웃 구조로 로딩 placeholder 표시
 */
const SkeletonScheduleCard = () => {
  return (
    <div className="flex flex-col w-full pt-4 pb-3.5 px-3 items-baseline border border-gray-10 rounded-xl gap-3 bg-gray-white">
      {/* 헤더 영역 */}
      <div className="flex w-full justify-between items-baseline pl-2">
        <div className="flex flex-col items-baseline gap-2">
          {/* 날짜 */}
          <SkeletonBlock width="w-24" height="h-3" rounded="rounded-sm" />
          {/* 일정명 */}
          <SkeletonBlock width="w-40" height="h-5" rounded="rounded-sm" />
        </div>
      </div>
      {/* 태그 영역 */}
      <div className="flex gap-2">
        <SkeletonBlock width="w-14" height="h-5" rounded="rounded-full" />
        <SkeletonBlock width="w-18" height="h-5" rounded="rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonScheduleCard;
