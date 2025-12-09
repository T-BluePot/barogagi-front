import { ScheduleCard } from "../../plan/main/ScheduleCard";
import { mockSchedules } from "@/mock/schedules";
import ContentWrapper from "./ContentWrapper";

const UpcomingScheduleSection: React.FC = () => {
  // 목 데이터
  const mockScheduleData = mockSchedules[0];

  const handleEdit = () => {
    // TODO: 일정 수정 페이지로 이동 또는 수정 모달 표시
  };

  const handleTitleClick = () => {
    // TODO: 전체 일정 목록 페이지로 이동
  };

  return (
    <ContentWrapper
      title="곧 다가오는"
      highlightText="일정"
      onClick={handleTitleClick}
      isArrowVisible={true}
    >
      <ScheduleCard
        schedule={mockScheduleData}
        onClickCard={handleEdit}
        isDeleteDisabled
      />
    </ContentWrapper>
  );
};

export default UpcomingScheduleSection;
