import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { mockSchedules } from "@/mock/schedules";
import { getMarkedDates } from "@/utils/getMarkedDates";

import { TitleHeader } from "@/components/common/headers/TitleHeader";
import { PlanViewToggleButton } from "@/components/main/plan/PlanViewToggleButton";
import type { PlanViewType } from "@/components/main/plan/PlanViewToggleButton";
import { CalendarView } from "@/components/main/plan/CalendarView";
import { ListView } from "@/components/main/plan/ListView";
import { AddScheduleButton } from "@/components/main/plan/AddScheduleButton";
import { ROUTES } from "@/constants/routes";

const ScheduleListPage = () => {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<PlanViewType>("list");

  const toggleViewType = () => {
    if (viewMode === "list") {
      setViewMode("calendar");
    } else setViewMode("list");
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
  ); // 삭제할 계획 num

  const handleDeleteSchedule = (scheduleNum: number) => {
    setDeleteScheduleNum(scheduleNum);
    setIsDeleteOpen(true);
  };

  return (
    <div
      className="flex flex-col w-full h-full
     gap-6 bg-gray-white overflow-hidden"
    >
      <div className="shrink-0 sticky top-0 z-10 bg-gray-white">
        <TitleHeader label="내 일정">
          <PlanViewToggleButton
            viewType={viewMode}
            toggleViewType={toggleViewType}
          />
        </TitleHeader>
      </div>
      <div className="flex-1 w-full min-h-0">
        {viewMode === "calendar" ? (
          <div className="flex w-full h-full">
            <CalendarView
              selectedDate={selectedDate}
              onChangeDate={(date) => setSelectedDate(date)}
              markedDates={markedDates}
              schedules={mockSchedules}
              onDelete={() => {
                // 삭제 로직
              }}
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
