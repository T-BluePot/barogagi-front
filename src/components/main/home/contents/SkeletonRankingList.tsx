import SkeletonBlock from "@/components/common/SkeletonBlock";

/**
 * RankingList 스켈레톤
 * - RankingList와 동일한 레이아웃으로 로딩 placeholder 표시
 */
const SkeletonRankingList = () => {
  return (
    <div className="bg-gray-10 rounded-lg px-6 py-3">
      <div className="h-8 flex items-center gap-3">
        <SkeletonBlock width="w-4" height="h-4" rounded="rounded-sm" />
        <SkeletonBlock width="w-24" height="h-4" rounded="rounded-sm" />
      </div>
    </div>
  );
};

export default SkeletonRankingList;
