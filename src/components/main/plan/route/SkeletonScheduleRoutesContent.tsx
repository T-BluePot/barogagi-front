import SkeletonBlock from "@/components/common/loading/SkeletonBlock";

/**
 * ScheduleRoutesContent 스켈레톤
 * - 일정 카드 placeholder만 표시 (로딩 오버레이는 GlobalLoading이 담당)
 */
const SkeletonScheduleRoutesContent = () => {
  return (
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
  );
};

export default SkeletonScheduleRoutesContent;
