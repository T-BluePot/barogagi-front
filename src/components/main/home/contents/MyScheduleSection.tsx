import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ScheduleCard } from "../../plan/main/ScheduleCard";
import SkeletonScheduleCard from "../../plan/main/SkeletonScheduleCard";
import SectionHeader from "@/components/common/SectionHeader";
import EmptyContent from "@/components/common/EmptyContent";
import { useScheduleListQuery } from "@/hooks/queries/useScheduleListQuery";
import { useStartScheduleCreation } from "@/hooks/useStartScheduleCreation";
import { getRoutePath } from "@/constants/routes";
import type { Schedule } from "@/types/scheduleTypes";

/** 오늘로부터 n일 뒤를 "YYYY-MM-DD"로 (mock 날짜가 항상 미래가 되도록) */
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

// 서버 일정이 없을 때 노출할 예시 일정 (사용자 요청 임시 mock)
// TODO: 실제 일정 데이터가 안정적으로 쌓이면 제거
const MOCK_SCHEDULE: Schedule = {
  scheduleNum: -1,
  scheduleNm: "한강 산책 데이트",
  startDate: daysFromNow(3),
  endDate: daysFromNow(4),
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
 * 홈 "나의 일정" 섹션 (메인 최하단 — 목록이 아래로 늘어나는 영역)
 * - 일정 목록 API의 다가오는 일정을 가까운 순으로 세로 나열
 * - 일정이 없으면 예시(mock) 일정을 보여주고 탭 시 일정 생성 플로우로 유도
 * - 카드는 일정 탭의 ScheduleCard를 그대로 재사용 (카드 리디자인은 일정 담당자 몫)
 */
const MyScheduleSection = () => {
  const navigate = useNavigate();
  const { current, isLoading, isError } = useScheduleListQuery();
  const { startScheduleCreation } = useStartScheduleCreation();

  // 다가오는 일정을 가까운 순으로 (YYYY-MM-DD라 문자열 정렬 = 날짜 오름차순)
  // current 참조는 React Query select 캐시로 안정적 → 데이터 변경 시에만 재정렬
  const upcoming = useMemo(
    () => [...current].sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [current]
  );

  const renderContent = () => {
    // 로딩 스켈레톤도 목록 레이아웃(세로 스택)으로 노출해 실데이터 전환 시 점프 완화
    if (isLoading)
      return (
        <div className="flex flex-col gap-2.5">
          <SkeletonScheduleCard />
          <SkeletonScheduleCard />
        </div>
      );
    if (isError) return <EmptyContent message="일정을 불러오지 못했습니다." />;

    // 일정 없음 → 예시 mock 카드 (탭 시 생성 플로우)
    // 실제 일정과 구분되도록 "예시" 뱃지를 카드 위에 덧씌운다 (ScheduleCard는 미수정)
    if (upcoming.length === 0) {
      return (
        <div className="relative">
          <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-gray-black/65 px-2 py-0.5 text-[10px] font-medium text-white">
            예시
          </span>
          <ScheduleCard
            schedule={MOCK_SCHEDULE}
            onClickCard={startScheduleCreation}
            isDeleteDisabled
          />
        </div>
      );
    }

    // 다가오는 일정 세로 스택 (레퍼런스 §6: gap 10px)
    return (
      <div className="flex flex-col gap-2.5">
        {upcoming.map((schedule) => (
          <ScheduleCard
            key={schedule.scheduleNum}
            schedule={schedule}
            onClickCard={() =>
              navigate(getRoutePath.plan.detail(String(schedule.scheduleNum)))
            }
            isDeleteDisabled
          />
        ))}
      </div>
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
