import type React from "react";
import { useNavigate } from "react-router-dom";
import { ScheduleCard } from "../../plan/main/ScheduleCard";
import SkeletonScheduleCard from "../../plan/main/SkeletonScheduleCard";
import SectionHeader from "@/components/common/SectionHeader";
import EmptyContent from "@/components/common/EmptyContent";
import { useStartScheduleCreation } from "@/hooks/useStartScheduleCreation";
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

  const { startScheduleCreation } = useStartScheduleCreation();

  const handleEdit = () => {
    if (!scheduleData?.userInfoResponseDTO) return;
    const scheduleNum = scheduleData.userInfoResponseDTO.scheduleNum;
    navigate(getRoutePath.plan.detail(String(scheduleNum)));
  };

  const renderContent = () => {
    if (isLoading) return <SkeletonScheduleCard />;
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
    <section className="mb-8 w-full">
      <SectionHeader
        title="나의 일정"
        actionIcon={
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        }
        actionAriaLabel="일정 추가"
        onAction={startScheduleCreation}
      />
      {renderContent()}
    </section>
  );
};

export default UpcomingScheduleSection;
