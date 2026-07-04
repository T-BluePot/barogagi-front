import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { ScheduleViewType } from "@/components/main/plan/main/ScheduleViewToggleButton";
import { getMarkedDates } from "@/utils/getMarkedDates";

import ScheduleListHeader from "@/components/main/plan/main/ScheduleListHeader";
import { CalendarView } from "@/components/main/plan/CalendarView";
import ListView from "@/components/main/plan/main/ListView";
import AddScheduleButton from "@/components/main/plan/main/AddScheduleButton";

import DeleteScheduleModal from "@/components/main/plan/DeleteScheduleModal";
import SkeletonCalendar from "@/components/main/plan/SkeletonCalendar";
import SkeletonListView from "@/components/main/plan/main/SkeletonListView";

import { useStartScheduleCreation } from "@/hooks/useStartScheduleCreation";

// === server ===
import { useScheduleListQuery } from "@/hooks/queries/useScheduleListQuery";
import { useDeleteScheduleMutation } from "@/hooks/mutations/useDeleteScheduleMutation";

const ScheduleListPage = () => {
  const navigate = useNavigate();

  // === 일정 목록 조회 ===
  const { current, past, all, isLoading, isError, refetch } =
    useScheduleListQuery();
  const deleteMutation = useDeleteScheduleMutation();

  const [viewType, setViewType] = useState<ScheduleViewType>("list");

  const toggleViewType = () => {
    if (viewType === "list") {
      setViewType("calendar");
    } else setViewType("list");
    setSelectedDate(null); // 모드 전환 시 선택된 날짜 초기화
  };

  // calendar 모드
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const markedDates = getMarkedDates(all);

  // 카드 클릭 시 상세 페이지로 이동
  const handleOpenDetail = (scheduleNum: number) => {
    navigate(`/plan/${scheduleNum}/detail`);
  };

  // === 일정 삭제 ===
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleDeleteSchedule = (scheduleNum: number) => {
    setDeleteTargetId(scheduleNum);
    setIsDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteTargetId(null);
  };

  // 삭제 확인 시 API 호출
  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      deleteMutation.mutate(deleteTargetId);
    }
    handleCloseDeleteModal();
  };

  // === 일정 생성 관련 ===
  const { startScheduleCreation } = useStartScheduleCreation();

  const handleAddSchedule = () => {
    startScheduleCreation();
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <DeleteScheduleModal
        isOpen={isDeleteOpen}
        onClickCancel={handleCloseDeleteModal}
        onClickConfirm={handleConfirmDelete}
      />
      <ScheduleListHeader viewType={viewType} toggleViewType={toggleViewType} />
      <div className="flex-1">
        {isError ? (
          <div className="flex flex-col items-center justify-center w-full pt-25 gap-4">
            <p className="typo-sub-title text-gray-70">
              일정을 불러오지 못했습니다.
            </p>
            <button
              className="typo-body text-main underline"
              onClick={() => refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : viewType === "calendar" ? (
          <div className="flex h-full min-h-0 pb-15 bg-gray-5">
            <CalendarView
              selectedDate={selectedDate}
              onChangeDate={(date) => setSelectedDate(date)}
              markedDates={markedDates}
              schedules={all}
              onDelete={handleDeleteSchedule}
              onClickCard={handleOpenDetail}
            />
          </div>
        ) : (
          <div className="flex flex-col w-full px-6 min-h-0 pb-15 gap-6">
            {isLoading ? (
              <>
                <SkeletonCalendar />
                <SkeletonListView />
              </>
            ) : (
              <ListView
                schedules={current}
                pastSchedules={past}
                onClickCard={handleOpenDetail}
                onDelete={handleDeleteSchedule}
              />
            )}
          </div>
        )}
      </div>
      <div className="fixed bottom-[calc(5rem+max(env(safe-area-inset-bottom,0px),var(--sai-bottom,0px)))] right-6 z-35">
        <AddScheduleButton onAddSchedule={handleAddSchedule} />
      </div>
    </div>
  );
};

export default ScheduleListPage;
