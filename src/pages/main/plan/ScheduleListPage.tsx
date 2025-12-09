import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import type { ScheduleViewType } from "@/components/main/plan/main/ScheduleViewToggleButton";
import { mockSchedules } from "@/mock/schedules";
import { getMarkedDates } from "@/utils/getMarkedDates";

import ScheduleListHeader from "@/components/main/plan/main/ScheduleListHeader";
import { CalendarView } from "@/components/main/plan/CalendarView";
import { ListView } from "@/components/main/plan/main/ListView";
import { AddScheduleButton } from "@/components/main/plan/AddScheduleButton";

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
  const markedDates = getMarkedDates(mockSchedules);

  // 카드 클릭 시 상세 페이지로 이동하는 함수
  const handleOpenDetail = (scheduleNum: number) => {
    // 여기서 URL에 scheduleNum을 박아서 이동
    navigate(`/plan/${scheduleNum}/detail`);
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deleteScheduleNum, setDeleteScheduleNum] = useState<number | null>(
    null
  ); // 삭제할 일정 num

  // 삭제 버튼 클릭 액션 함수
  const handleDeleteSchedule = (scheduleNum: number) => {
    setDeleteScheduleNum(scheduleNum);
    setIsDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  return (
    <div
      className="flex flex-col w-full h-full
     gap-6 bg-gray-white overflow-hidden"
    >
      <DeleteScheduleModal
        isOpen={isDeleteOpen}
        onClickCancel={handleCloseDeleteModal}
        onClickConfirm={() => {
          // 서버 연동시 삭제 로직 추가
          handleCloseDeleteModal();
        }}
      />
      <ScheduleListHeader viewType={viewType} toggleViewType={toggleViewType} />
      <div className="flex-1 w-full min-h-0">
        {viewType === "calendar" ? (
          <div className="flex w-full h-full">
            <CalendarView
              selectedDate={selectedDate}
              onChangeDate={(date) => setSelectedDate(date)}
              markedDates={markedDates}
              schedules={mockSchedules}
              onDelete={handleDeleteSchedule}
              onClickCard={handleOpenDetail}
            />
          </div>
        ) : (
          <div className="flex w-full h-full px-6">
            <ListView
              schedules={mockSchedules}
              onDelete={handleDeleteSchedule}
              onClickCard={handleOpenDetail}
            />
          </div>
        )}
      </div>
      <div className="fixed bottom-6 right-6">
        <AddScheduleButton onAddSchedule={() => navigate(ROUTES.PLAN.DATE)} />
      </div>
    </div>
  );
};

export default ScheduleListPage;
