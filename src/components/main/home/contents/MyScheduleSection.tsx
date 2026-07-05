import { useNavigate } from "react-router-dom";

import SectionHeader from "@/components/common/SectionHeader";
import EmptyContent from "@/components/common/EmptyContent";
import HomeScheduleCard from "./HomeScheduleCard";
import SkeletonHomeScheduleCard from "./SkeletonHomeScheduleCard";
import { useScheduleListQuery } from "@/hooks/queries/useScheduleListQuery";
import { useStartScheduleCreation } from "@/hooks/useStartScheduleCreation";
import { getRoutePath } from "@/constants/routes";
import type { Schedule } from "@/types/scheduleTypes";

/** "YYYY-MM-DD" → "M.D" (타임존 영향 없이 문자열 분해) */
const toDateLabel = (ymd?: string) => {
  if (!ymd) return "";
  const [, m, d] = ymd.split("-");
  if (!m || !d) return ymd;
  return `${Number(m)}.${Number(d)}`;
};

/** 오늘 날짜를 "YYYY-MM-DD"로 (로컬 기준) */
const todayYmd = () => {
  const t = new Date();
  const mm = String(t.getMonth() + 1).padStart(2, "0");
  const dd = String(t.getDate()).padStart(2, "0");
  return `${t.getFullYear()}-${mm}-${dd}`;
};

/** 오늘이 일정 구간(start~end)에 포함되면 진행 중 */
const isOngoing = (schedule: Schedule) => {
  const today = todayYmd();
  const end = schedule.endDate || schedule.startDate;
  return schedule.startDate <= today && today <= end;
};

/** 태그명을 "# a · # b" 형태로 (최대 2개, 없으면 undefined) */
const toMeta = (schedule: Schedule) => {
  const names = schedule.tags
    .map((t) => t.tagNm)
    .filter(Boolean)
    .slice(0, 2);
  return names.length ? names.map((n) => `# ${n}`).join(" · ") : undefined;
};

// 서버 일정이 없을 때 노출할 예시 카드 (사용자 요청 임시 mock)
// TODO: 실제 일정 데이터가 안정적으로 쌓이면 제거
const MOCK_CARD = {
  dateLabel: "4.25",
  dateSubLabel: "~ 4.26",
  title: "한강 산책 데이트",
  meta: "# 데이트 · # 서울",
  badgeLabel: "예시",
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
 * - 일정이 없으면 예시(mock) 카드를 보여주고 탭 시 일정 생성 플로우로 유도
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
    if (isLoading) return <SkeletonHomeScheduleCard />;
    if (isError) return <EmptyContent message="일정을 불러오지 못했습니다." />;

    // 일정 없음 → 예시 mock 카드 (탭 시 생성 플로우)
    if (!nearest) {
      return <HomeScheduleCard {...MOCK_CARD} onClick={startScheduleCreation} />;
    }

    const endLabel =
      nearest.endDate && nearest.endDate !== nearest.startDate
        ? `~ ${toDateLabel(nearest.endDate)}`
        : undefined;

    return (
      <HomeScheduleCard
        dateLabel={toDateLabel(nearest.startDate)}
        dateSubLabel={endLabel}
        title={nearest.scheduleNm}
        meta={toMeta(nearest)}
        isOngoing={isOngoing(nearest)}
        onClick={() =>
          navigate(getRoutePath.plan.detail(String(nearest.scheduleNum)))
        }
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
