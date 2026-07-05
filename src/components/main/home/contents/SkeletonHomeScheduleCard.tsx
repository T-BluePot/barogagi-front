import SkeletonBlock from "@/components/common/loading/SkeletonBlock";

/**
 * HomeScheduleCard 스켈레톤
 * - 카드와 동일한 높이/라운드의 로딩 placeholder
 */
const SkeletonHomeScheduleCard = () => {
  return <SkeletonBlock width="w-full" height="h-[66px]" rounded="rounded-xl" />;
};

export default SkeletonHomeScheduleCard;
