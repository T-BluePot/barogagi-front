import SkeletonBlock from "@/components/common/SkeletonBlock";

/**
 * RankingList 스켈레톤
 * - RankingList와 동일한 레이아웃으로 로딩 placeholder 표시
 */
const SkeletonRankingList = () => {
  return <SkeletonBlock width="w-full" height="h-14" rounded="rounded-lg" />;
};

export default SkeletonRankingList;
