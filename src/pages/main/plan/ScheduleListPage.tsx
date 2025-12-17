import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import type { ScheduleViewType } from "@/components/main/plan/main/ScheduleViewToggleButton";
import {
  mockSchedules,
  pastMockSchedules,
  allSchedules,
} from "@/mock/schedules";
import { getMarkedDates } from "@/utils/getMarkedDates";

import ScheduleListHeader from "@/components/main/plan/main/ScheduleListHeader";
import { CalendarView } from "@/components/main/plan/CalendarView";
import ListView from "@/components/main/plan/main/ListView";
import AddScheduleButton from "@/components/main/plan/main/AddScheduleButton";

import DeleteScheduleModal from "@/components/main/plan/DeleteScheduleModal";

const ScheduleListPage = () => {
  const navigate = useNavigate();

  const [viewType, setViewType] = useState<ScheduleViewType>("list");

  const toggleViewType = () => {
    if (viewType === "list") {
      setViewType("calendar");
    } else setViewType("list");
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
  const [deleteTargetNum, setDeleteTargetNum] = useState<number | null>(null);

  // 삭제 버튼 클릭 액션 함수
  const handleDeleteSchedule = (scheduleNum: number) => {
    setDeleteTargetNum(scheduleNum);
    setIsDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteTargetNum(null);
  };

  return (
    <div
      className="flex flex-col
     gap-6 bg-gray-white"
    >
      <DeleteScheduleModal
        isOpen={isDeleteOpen}
        onClickCancel={handleCloseDeleteModal}
        onClickConfirm={() => {
          // TODO: deleteTargetNum을 사용해서 서버 삭제 API 호출
          console.log("삭제할 일정:", deleteTargetNum);
          handleCloseDeleteModal();
        }}
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
          <div className="flex w-full h-full px-6">
            <ListView
              schedules={mockSchedules}
              pastSchedules={pastMockSchedules}
              onClickCard={handleOpenDetail}
              onDelete={handleDeleteSchedule}
            />
          </div>
        )}
      </div>
      <div className="fixed bottom-20 right-6 z-30">
        <AddScheduleButton onAddSchedule={() => navigate(ROUTES.PLAN.DATE)} />
      </div>
    </div>
  );
};

export default ScheduleListPage;
