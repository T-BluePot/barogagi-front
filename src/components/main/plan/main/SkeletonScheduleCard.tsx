import SkeletonBlock from "@/components/common/loading/SkeletonBlock";

/**
 * ScheduleCard 스켈레톤
 * - 실제 카드와 같은 96px(태그 없는 기본 높이) 단일 블록.
 *   태그가 붙은 카드는 124px 로 늘어나지만, 목록에 몇 개가 태그를 갖는지는
 *   로딩 시점에 알 수 없어 기본 높이에 맞춘다.
 */
const SkeletonScheduleCard = () => {
  return (
    <SkeletonBlock width="w-full" height="h-[96px]" rounded="rounded-xl" />
  );
};

export default SkeletonScheduleCard;
