import { ScheduleCard } from "../../plan/main/ScheduleCard";
import ContentWrapper from "./ContentWrapper";
import type { ScheduleRegistResDTO } from "@/api/types";
import type { Schedule } from "@/types/scheduleTypes";

interface Props {
  schedules: ScheduleRegistResDTO[];
  isLoading: boolean;
}

/** API 응답 DTO → ScheduleCard용 Schedule 변환 */
const toSchedule = (dto: ScheduleRegistResDTO): Schedule => ({
  scheduleNum: dto.scheduleNum,
  membershipNo: 0,
  scheduleNm: dto.scheduleNm,
  startDate: dto.startDate,
  endDate: dto.endDate,
  radius: 0,
  regDate: "",
  delYn: "N",
  updDate: "",
  tags: dto.scheduleTagRegistResDTOList.map((t) => ({
    tagNum: t.tagNum,
    tagNm: t.tagNm,
    tagType: "",
    categoryNum: 0,
  })),
});

const UpcomingScheduleSection: React.FC<Props> = ({ schedules, isLoading }) => {
  // 오늘 ~ 7일 이내 가장 가까운 일정 찾기
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const weekLater = new Date(today);
  weekLater.setDate(weekLater.getDate() + 7);
  const weekLaterStr = weekLater.toISOString().slice(0, 10);

  const upcoming = schedules
    .filter((s) => s.startDate >= todayStr && s.startDate <= weekLaterStr)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];

  const handleEdit = () => {
    // TODO: 일정 수정 페이지로 이동 또는 수정 모달 표시
  };

  const handleTitleClick = () => {
    // TODO: 전체 일정 목록 페이지로 이동
  };

  if (isLoading) {
    return (
      <ContentWrapper
        title="곧 다가오는"
        highlightText="일정"
        onClick={handleTitleClick}
        isArrowVisible={true}
      >
        <div className="text-gray-40 typo-body-02 py-4">불러오는 중...</div>
      </ContentWrapper>
    );
  }

  if (!upcoming) {
    return (
      <ContentWrapper
        title="곧 다가오는"
        highlightText="일정"
        onClick={handleTitleClick}
        isArrowVisible={true}
      >
        <div className="text-gray-40 typo-body-02 py-4">
          다가오는 일정이 없습니다.
        </div>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper
      title="곧 다가오는"
      highlightText="일정"
      onClick={handleTitleClick}
      isArrowVisible={true}
    >
      <ScheduleCard
        schedule={toSchedule(upcoming)}
        onClickCard={handleEdit}
        isDeleteDisabled
      />
    </ContentWrapper>
  );
};

export default UpcomingScheduleSection;
