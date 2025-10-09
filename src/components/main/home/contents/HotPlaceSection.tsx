import ContentWrapper from "./ContentWrapper";
import RankingList from "./RankingList";

const HotPlaceSection = () => {
  // TODO: 실제로는 API에서 가져와야 할 데이터
  const hotPlaceRankings = [
    { rank: 1, name: "성수", rankChange: "up" as const },
    { rank: 2, name: "홍대", rankChange: "same" as const },
    { rank: 3, name: "강남", rankChange: "up" as const },
    { rank: 4, name: "이태원", rankChange: "down" as const },
    { rank: 5, name: "명동", rankChange: "up" as const },
  ];

  return (
    <ContentWrapper title="지금 인기 많은" highlightText="핫 플레이스">
      <RankingList rankings={hotPlaceRankings} />
    </ContentWrapper>
  );
};

export default HotPlaceSection;
