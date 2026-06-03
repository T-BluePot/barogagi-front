import SkeletonScheduleCard from "./SkeletonScheduleCard";

interface SkeletonListViewProps {
  /** 표시할 스켈레톤 카드 수 */
  count?: number;
}

/**
 * ListView 스켈레톤
 * - ListView와 동일한 레이아웃으로 로딩 시 카드 placeholder 표시
 */
const SkeletonListView = ({ count = 3 }: SkeletonListViewProps) => {
  return (
    <div className="flex flex-col w-full h-full pb-6 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonScheduleCard key={idx} />
      ))}
    </div>
  );
};

export default SkeletonListView;
