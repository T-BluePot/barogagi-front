import ContentWrapper from "./ContentWrapper";
import TrendingCarousel from "./TrendingCarousel";
import EmptyContent from "@/components/common/EmptyContent";
import type { TagInfoDTO } from "@/api/types";
import type { TrendingItem } from "./TrendingCarouselItem";

interface Props {
  tags: TagInfoDTO[];
  isLoading: boolean;
}

const TrendingScheduleSection: React.FC<Props> = ({ tags, isLoading }) => {
  // API 태그 → TrendingCarouselItem 변환
  const items: TrendingItem[] = tags.map((tag) => ({
    id: tag.tagNum,
    title: tag.tagNm,
    subtitle: tag.tagType,
    imageUrl: "",
  }));

  const renderContent = () => {
    if (isLoading) return <EmptyContent message="불러오는 중..." />;
    if (items.length === 0)
      return <EmptyContent message="인기 있는 일정이 없습니다." />;

    return <TrendingCarousel items={items} />;
  };

  return (
    <ContentWrapper title="지금 인기 있는" highlightText="일정">
      {renderContent()}
    </ContentWrapper>
  );
};

export default TrendingScheduleSection;
