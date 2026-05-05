import SkeletonBlock from "@/components/common/SkeletonBlock";

/**
 * ScheduleCard 스켈레톤
 * - ScheduleCard와 동일한 크기의 단일 직사각형 블록
 */
const SkeletonScheduleCard = () => {
  return <SkeletonBlock width="w-full" height="h-[100px]" rounded="rounded-xl" />;
};

export default SkeletonScheduleCard;
