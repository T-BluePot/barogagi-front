import type React from "react";
import { useNavigate } from "react-router-dom";
import { ScheduleCard } from "../../plan/main/ScheduleCard";
import SkeletonBlock from "@/components/common/SkeletonBlock";
import ContentWrapper from "./ContentWrapper";
import EmptyContent from "@/components/common/EmptyContent";
import type { HomeScheduleResponseDTO } from "@/api/types";
import type { Schedule } from "@/types/scheduleTypes";
import { getRoutePath } from "@/constants/routes";

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
  const navigate = useNavigate();
  const hasSchedule = scheduleData?.userInfoResponseDTO != null;

  const handleEdit = () => {
    if (!scheduleData?.userInfoResponseDTO) return;
    const scheduleNum = scheduleData.userInfoResponseDTO.scheduleNum;
    navigate(getRoutePath.plan.detail(String(scheduleNum)));
  };

  const handleTitleClick = () => {
    navigate(getRoutePath.plan.list());
  };

  const renderContent = () => {
    if (isLoading)
      return <SkeletonBlock width="w-full" height="h-[100px]" rounded="rounded-xl" />;
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
