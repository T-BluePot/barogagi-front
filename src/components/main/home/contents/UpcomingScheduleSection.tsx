import type React from "react";
import { ScheduleCard } from "../../plan/main/ScheduleCard";
import ContentWrapper from "./ContentWrapper";
import EmptyContent from "@/components/common/EmptyContent";
import type { HomeScheduleResponseDTO } from "@/api/types";
import type { Schedule } from "@/types/scheduleTypes";

interface Props {
  scheduleData: HomeScheduleResponseDTO | null;
  isLoading: boolean;
}

/** API 응답 → ScheduleCard용 Schedule 변환 */
const toSchedule = (data: HomeScheduleResponseDTO): Schedule => ({
  scheduleNum: data.userInfoResponseDTO?.scheduleNum ?? 0,
  membershipNo: 0,
  scheduleNm: data.userInfoResponseDTO?.scheduleNm ?? "",
  startDate: data.userInfoResponseDTO?.startDate ?? "",
  endDate: "", // 홈 API에서 endDate를 제공하지 않음
  radius: 0,
  regDate: "",
  delYn: "N",
  updDate: "",
  tags: (data.tagInfoList ?? []).map((t) => ({
    tagNum: t.tagNum,
    tagNm: t.tagNm,
    tagType: t.tagType,
    categoryNum: 0,
  })),
});

const UpcomingScheduleSection: React.FC<Props> = ({
  scheduleData,
  isLoading,
}) => {
  const hasSchedule = scheduleData?.userInfoResponseDTO != null;

  const handleEdit = () => {
    // TODO: 일정 수정 페이지로 이동 또는 수정 모달 표시
  };

  const handleTitleClick = () => {
    // TODO: 전체 일정 목록 페이지로 이동
  };

  const renderContent = () => {
    if (isLoading) return <EmptyContent message="불러오는 중..." />;
    if (!hasSchedule)
      return <EmptyContent message="다가오는 일정이 없습니다." />;

    return (
      <ScheduleCard
        schedule={toSchedule(scheduleData!)}
        onClickCard={handleEdit}
        isDeleteDisabled
      />
    );
  };

  return (
    <ContentWrapper
      title="곧 다가오는"
      highlightText="일정"
      onClick={handleTitleClick}
      isArrowVisible={true}
    >
      {renderContent()}
    </ContentWrapper>
  );
};

export default UpcomingScheduleSection;
