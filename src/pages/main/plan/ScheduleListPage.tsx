import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import type { ScheduleViewType } from "@/components/main/plan/main/ScheduleViewToggleButton";
import { getMarkedDates } from "@/utils/getMarkedDates";

import ScheduleListHeader from "@/components/main/plan/main/ScheduleListHeader";
import { CalendarView } from "@/components/main/plan/CalendarView";
import ListView from "@/components/main/plan/main/ListView";
import AddScheduleButton from "@/components/main/plan/main/AddScheduleButton";

import DeleteScheduleModal from "@/components/main/plan/DeleteScheduleModal";
import SkeletonCalendar from "@/components/main/plan/SkeletonCalendar";
import SkeletonListView from "@/components/main/plan/main/SkeletonListView";

import { useScheduleDraftStore } from "@/stores/scheduleStore";
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";
import { useConfirmModalStore } from "@/stores/confirmModalStore";

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
  const { draft, reset } = useScheduleDraftStore();
  const { clearRegions } = useRegionSelectionStore();
  const { openConfirmModal } = useConfirmModalStore();

  const hasStoreDraft =
    draft.planRegistReqDTOList.length > 0 ||
    !!draft.scheduleNm ||
    !!draft.startDate ||
    !!draft.endDate ||
    !!draft.comment ||
    draft.scheduleTagRegistReqDTOList.length > 0 ||
    draft.scheduleRegionRegistReqDTOList.length > 0;

  const handleAddSchedule = () => {
    if (hasStoreDraft) {
      openConfirmModal(
        {
          title: "이어서 만드시겠습니까?",
          content: "이전에 작성 중인 일정이 있습니다.\n이어서 만드시겠습니까?",
          confirmLabel: "이어하기",
          cancelLabel: "새로 만들기",
        },
        () => navigate(ROUTES.PLAN.DATE),
        () => {
          reset();
          clearRegions();
          navigate(ROUTES.PLAN.DATE);
        }
      );
    } else {
      navigate(ROUTES.PLAN.DATE);
    }
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
          <div className="flex flex-col h-full min-h-0 pb-15">
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
