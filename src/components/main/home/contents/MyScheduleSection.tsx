import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ScheduleCard } from "../../plan/main/ScheduleCard";
import SkeletonScheduleCard from "../../plan/main/SkeletonScheduleCard";
import DeleteScheduleModal from "@/components/main/plan/DeleteScheduleModal";
import SectionHeader from "@/components/common/SectionHeader";
import EmptyContent from "@/components/common/EmptyContent";
import { useScheduleListQuery } from "@/hooks/queries/useScheduleListQuery";
import { useDeleteScheduleMutation } from "@/hooks/mutations/useDeleteScheduleMutation";
import { useStartScheduleCreation } from "@/hooks/useStartScheduleCreation";
import { getRoutePath } from "@/constants/routes";

/** + 아이콘 — 섹션 헤더(22px)와 빈 상태 플레이스홀더(18px)가 같은 모양을 공유한다 */
const PlusIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ADD_ICON = <PlusIcon size={22} />;

/**
 * 홈 "나의 일정" 섹션 (메인 최하단 — 목록이 아래로 늘어나는 영역)
 * - 일정 목록 API의 다가오는 일정을 가까운 순으로 세로 나열
 * - 일정이 없으면 예시(mock) 일정을 보여주고 탭 시 일정 생성 플로우로 유도
 * - 카드·간격·삭제 흐름 모두 일정 탭(`ScheduleListPage`)과 동일하게 맞춘다.
 *   같은 카드가 화면마다 다르게 동작하면 사용자가 "여기선 왜 안 되지"를 겪는다.
 */
const MyScheduleSection = () => {
  const navigate = useNavigate();
  const { current, past, isLoading, isError } = useScheduleListQuery();
  const { startScheduleCreation } = useStartScheduleCreation();
  const deleteMutation = useDeleteScheduleMutation();

  // === 일정 삭제 (일정 탭과 같은 흐름: 확인 모달 → 삭제) ===
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleDeleteSchedule = (scheduleNum: number) => {
    setDeleteTargetId(scheduleNum);
    setIsDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteTargetId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) deleteMutation.mutate(deleteTargetId);
    handleCloseDeleteModal();
  };

  // 다가오는 일정을 가까운 순으로 (YYYY-MM-DD라 문자열 정렬 = 날짜 오름차순)
  // current 참조는 React Query select 캐시로 안정적 → 데이터 변경 시에만 재정렬
  const upcoming = useMemo(
    () => [...current].sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [current]
  );

  // 다가오는 일정은 없지만 지난 일정은 있는 상태 = 신규 사용자가 아니다
  const hasPastOnly = upcoming.length === 0 && past.length > 0;

  const renderContent = () => {
    // 로딩 스켈레톤도 목록 레이아웃(세로 스택)으로 노출해 실데이터 전환 시 점프 완화
    if (isLoading)
      return (
        <div className="flex flex-col gap-4">
          <SkeletonScheduleCard />
          <SkeletonScheduleCard />
        </div>
      );
    if (isError) return <EmptyContent message="일정을 불러오지 못했습니다." />;

    // 일정 없음 → 생성 유도 플레이스홀더.
    // 점선으로 카드 자리를 유지한다 — 진짜 일정 카드(실선)와 형태로 구분되고,
    // 영역 전체가 탭 영역이라 헤더의 + 버튼 말고 생성 버튼을 새로 두지 않아도 된다.
    if (upcoming.length === 0) {
      return (
        <button
          type="button"
          onClick={startScheduleCreation}
          className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-gray-30 py-8 transition-colors active:bg-gray-10/60"
        >
          {/* 텍스트 "+" 대신 아이콘을 쓴다 —
              글리프는 폰트마다 세로 위치가 달라 원 안에서 미묘하게 떠 보인다 */}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-peach-light text-peach-text">
            <PlusIcon size={18} />
          </span>
          {/* 지난 일정이 있으면 "첫 일정"이 아니다 — 이미 만들어본 사람에게 틀린 말이 된다.
              "일정이 없어요" 같은 부재 안내 대신 다음 행동을 권하는 쪽으로 통일한다. */}
          <span className="typo-body text-gray-50">
            {hasPastOnly ? "다음 일정을 만들어보세요" : "첫 일정을 만들어보세요"}
          </span>
        </button>
      );
    }

    // 다가오는 일정 세로 스택.
    // 간격(gap-4)·삭제 버튼 모두 일정 탭의 `ScheduleList` 와 동일하게 맞춘다.
    return (
      <div className="flex flex-col gap-4">
        {upcoming.map((schedule) => (
          <ScheduleCard
            key={schedule.scheduleNum}
            schedule={schedule}
            onClickCard={() =>
              navigate(getRoutePath.plan.detail(String(schedule.scheduleNum)))
            }
            onDelete={() => handleDeleteSchedule(schedule.scheduleNum)}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="w-full">
      <DeleteScheduleModal
        isOpen={isDeleteOpen}
        onClickCancel={handleCloseDeleteModal}
        onClickConfirm={handleConfirmDelete}
      />
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
