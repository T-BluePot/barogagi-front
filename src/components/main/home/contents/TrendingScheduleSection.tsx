import ContentWrapper from "./ContentWrapper";
import TrendingCarousel from "./TrendingCarousel";

const TrendingScheduleSection = () => {
  return (
    <ContentWrapper title="지금 인기 있는" highlightText="일정">
      <TrendingCarousel />
    </ContentWrapper>
  );
};

export default TrendingScheduleSection;
