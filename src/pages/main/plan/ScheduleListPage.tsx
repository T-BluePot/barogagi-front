import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import type { ScheduleViewType } from "@/components/main/plan/main/ScheduleViewToggleButton";
import { allSchedules } from "@/mock/schedules";
import { getMarkedDates } from "@/utils/getMarkedDates";

import ScheduleListHeader from "@/components/main/plan/main/ScheduleListHeader";
import { CalendarView } from "@/components/main/plan/CalendarView";
import ListView from "@/components/main/plan/main/ListView";
import AddScheduleButton from "@/components/main/plan/main/AddScheduleButton";

import DeleteScheduleModal from "@/components/main/plan/DeleteScheduleModal";

import { useScheduleDraftStore } from "@/stores/scheduleStore";
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";
import { useConfirmModalStore } from "@/stores/confirmModalStore";

const ScheduleListPage = () => {
  const navigate = useNavigate();

  const [viewType, setViewType] = useState<ScheduleViewType>("list");

  const toggleViewType = () => {
    if (viewType === "list") {
      setViewType("calendar");
    } else setViewType("list");
    setSelectedDate(null); // 모드 전환 시 선택된 날짜 초기화
  };

  // calendar 모드
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const markedDates = getMarkedDates(allSchedules);

  // 카드 클릭 시 상세 페이지로 이동하는 함수
  const handleOpenDetail = (scheduleNum: number) => {
    // 여기서 URL에 scheduleNum을 박아서 이동
    navigate(`/plan/${scheduleNum}/detail`);
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  // 삭제할 스케줄의 ID를 저장하는 상태
  // - 삭제 버튼 클릭 시 어떤 스케줄인지 저장
  // - 모달에서 확인 버튼 클릭 시 이 ID로 삭제 요청
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // 삭제 버튼 클릭 액션 함수
  // scheduleNum을 받아서 삭제 대상을 추적
  const handleDeleteSchedule = (scheduleNum: number) => {
    setDeleteTargetId(scheduleNum); // 삭제할 스케줄 ID 저장
    setIsDeleteOpen(true); // 확인 모달 열기
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteTargetId(null); // 모달 닫을 때 삭제 대상 초기화
  };

  // 삭제 확인 시 실행되는 함수
  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      // TODO: 서버 연동 시 deleteTargetId로 삭제 API 호출
      console.log(`스케줄 ${deleteTargetId} 삭제 요청`);
    }
    handleCloseDeleteModal();
  };

  // === 일정 생성 관련 ===
  const { draft, reset } = useScheduleDraftStore();
  const { clearRegions } = useRegionSelectionStore();
  const { openConfirmModal } = useConfirmModalStore();

  // store 값 존재 여부
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
        () => navigate(ROUTES.PLAN.DATE), // 확인(이어서) → 그냥 이동
        () => {
          reset(); // scheduleStore 초기화
          clearRegions(); // regionSelectionStore 초기화
          navigate(ROUTES.PLAN.DATE);
        } // 취소(새로 만들기) → reset 후 이동
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
        {viewType === "calendar" ? (
          <div className="flex h-full">
            <CalendarView
              selectedDate={selectedDate}
              onChangeDate={(date) => setSelectedDate(date)}
              markedDates={markedDates}
              schedules={allSchedules}
              onDelete={handleDeleteSchedule}
              onClickCard={handleOpenDetail}
            />
          </div>
        ) : (
          <div className="flex w-full px-6 min-h-0 pb-[60px]">
            <ListView
              schedules={[]}
              pastSchedules={[]}
              onClickCard={handleOpenDetail}
              onDelete={handleDeleteSchedule}
            />
          </div>
        )}
        <div className="h-[60px]" />
      </div>
      <div className="fixed bottom-20 right-6 z-35">
        <AddScheduleButton onAddSchedule={handleAddSchedule} />
      </div>
    </div>
  );
};

export default ScheduleListPage;
