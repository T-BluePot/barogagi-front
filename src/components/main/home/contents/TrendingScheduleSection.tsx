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

  if (isLoading) {
    return (
      <ContentWrapper title="지금 인기 있는" highlightText="일정">
        <EmptyContent message="불러오는 중..." />
      </ContentWrapper>
    );
  }

  if (items.length === 0) {
    return (
      <ContentWrapper title="지금 인기 있는" highlightText="일정">
        <EmptyContent message="인기 있는 일정이 없습니다." />
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper title="지금 인기 있는" highlightText="일정">
      <TrendingCarousel items={items} />
    </ContentWrapper>
  );
};

export default TrendingScheduleSection;
