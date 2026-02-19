import type React from "react";
import ContentWrapper from "./ContentWrapper";
import RankingList from "./RankingList";
import EmptyContent from "@/components/common/EmptyContent";
import type { PopularRegionDTO } from "@/api/types";
import type { RankingItemData } from "./RankingItem";

interface Props {
  regions: PopularRegionDTO[];
  isLoading: boolean;
}

/** API 응답 → RankingItemData 변환 */
const toRankingItem = (region: PopularRegionDTO): RankingItemData => ({
  rank: region.rank,
  name: region.regionName,
  rankChange: region.rankChange,
});

const HotPlaceSection: React.FC<Props> = ({ regions, isLoading }) => {
  const rankings = regions.map(toRankingItem);

  const renderContent = () => {
    if (isLoading) return <EmptyContent message="불러오는 중..." />;
    if (rankings.length === 0)
      return <EmptyContent message="인기 지역 정보가 없습니다." />;

    return <RankingList rankings={rankings} />;
  };

  return (
    <ContentWrapper title="지금 인기 많은" highlightText="핫 플레이스">
      {renderContent()}
    </ContentWrapper>
  );
};

export default HotPlaceSection;
