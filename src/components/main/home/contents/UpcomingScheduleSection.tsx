import { CourseCard } from "../../plan/CourseCard";
import ContentWrapper from "./ContentWrapper";

const UpcomingScheduleSection: React.FC = () => {
  // 목 데이터
  const mockScheduleData = {
    scheduleNum: 1,
    userNum: 1,
    date: "2025년 4월 25일",
    scheduleTitle: "서울 데이트 코스",
    tags: ["이색체험", "서울"],
    isDeleteDisabled: true,
  };

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
      <CourseCard
        onEdit={handleEdit}
        scheduleNum={mockScheduleData.scheduleNum}
        userNum={mockScheduleData.userNum}
        date={mockScheduleData.date}
        scheduleTitle={mockScheduleData.scheduleTitle}
        tags={mockScheduleData.tags}
        isDeleteDisabled={mockScheduleData.isDeleteDisabled}
      />
    </ContentWrapper>
  );
};

export default UpcomingScheduleSection;
