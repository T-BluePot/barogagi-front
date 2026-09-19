import SkeletonScheduleCard from "./SkeletonScheduleCard";

interface SkeletonListViewProps {
  /** 표시할 스켈레톤 카드 수 */
  count?: number;
}

/**
 * ListView 스켈레톤
 * - ListView 와 같은 세로 스택(gap-4)에 카드 placeholder 를 깐다.
 * - 하단 여백도 ListView 와 같은 pb-tabbar 를 쓴다(탭바에 마지막 카드가 깔리지 않도록).
 */
const SkeletonListView = ({ count = 3 }: SkeletonListViewProps) => {
  return (
    <div className="pb-tabbar flex flex-col w-full h-full gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonScheduleCard key={idx} />
      ))}
    </div>
  );
};

export default SkeletonListView;
