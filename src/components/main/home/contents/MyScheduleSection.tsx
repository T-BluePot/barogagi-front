import { useNavigate } from "react-router-dom";

import { ScheduleCard } from "../../plan/main/ScheduleCard";
import SkeletonScheduleCard from "../../plan/main/SkeletonScheduleCard";
import SectionHeader from "@/components/common/SectionHeader";
import EmptyContent from "@/components/common/EmptyContent";
import { useScheduleListQuery } from "@/hooks/queries/useScheduleListQuery";
import { useStartScheduleCreation } from "@/hooks/useStartScheduleCreation";
import { getRoutePath } from "@/constants/routes";
import type { Schedule } from "@/types/scheduleTypes";

// 서버 일정이 없을 때 노출할 예시 일정 (사용자 요청 임시 mock)
// TODO: 실제 일정 데이터가 안정적으로 쌓이면 제거
const MOCK_SCHEDULE: Schedule = {
  scheduleNum: -1,
  scheduleNm: "한강 산책 데이트",
  startDate: "2025-04-25",
  endDate: "2025-04-26",
  tags: [
    { tagNum: -1, tagNm: "데이트" },
    { tagNum: -2, tagNm: "서울" },
  ],
};

const ADD_ICON = (
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
);

/**
 * 홈 "나의 일정" 섹션
 * - 일정 목록 API에서 가장 가까운 다가오는 일정 1건을 카드로 표시
 * - 일정이 없으면 예시(mock) 일정을 보여주고 탭 시 일정 생성 플로우로 유도
 * - 카드는 일정 탭의 ScheduleCard를 그대로 재사용 (카드 리디자인은 일정 담당자 몫)
 */
const MyScheduleSection = () => {
  const navigate = useNavigate();
  const { current, isLoading, isError } = useScheduleListQuery();
  const { startScheduleCreation } = useStartScheduleCreation();

  // 가장 가까운 다가오는 일정 (YYYY-MM-DD라 문자열 정렬 = 날짜 오름차순)
  const nearest = [...current].sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  )[0];

  const renderContent = () => {
    if (isLoading) return <SkeletonScheduleCard />;
    if (isError) return <EmptyContent message="일정을 불러오지 못했습니다." />;

    // 일정 없음 → 예시 mock 카드 (탭 시 생성 플로우)
    if (!nearest) {
      return (
        <ScheduleCard
          schedule={MOCK_SCHEDULE}
          onClickCard={startScheduleCreation}
          isDeleteDisabled
        />
      );
    }

    return (
      <ScheduleCard
        schedule={nearest}
        onClickCard={() =>
          navigate(getRoutePath.plan.detail(String(nearest.scheduleNum)))
        }
        isDeleteDisabled
      />
    );
  };

  return (
    <section className="w-full">
      <SectionHeader
        title="나의 일정"
        actionIcon={ADD_ICON}
        actionAriaLabel="일정 추가"
        onAction={startScheduleCreation}
      />
      {renderContent()}
    </section>
  );
};

export default MyScheduleSection;
