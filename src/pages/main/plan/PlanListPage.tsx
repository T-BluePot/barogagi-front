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

const PlanListPage = () => {
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

  return (
    <div
      className="flex flex-col w-full
     gap-6 bg-gray-white"
    >
      <div className="sticky top-0 z-10 bg-gray-white">
        <TitleHeader label="내 일정">
          <PlanViewToggleButton
            viewType={viewMode}
            toggleViewType={toggleViewType}
          />
        </TitleHeader>
      </div>
      <div className="flex flex-1 w-full overflow-hidden">
        {viewMode === "calendar" ? (
          <div className="flex flex-1">
            <CalendarView
              selectedDate={selectedDate}
              onChangeDate={(date) => setSelectedDate(date)}
              markedDates={markedDates}
              schedules={mockSchedules}
              onDelete={() => {
                // 삭제 로직
              }}
              onEdit={() => {
                /* scheduleNum로 추천 루트 페이지 이동 **/
              }}
            />
          </div>
        ) : (
          <div className="flex w-full px-6">
            <ListView
              schedules={mockSchedules}
              onDelete={() => {
                // 삭제 로직
              }}
              onEdit={() => {
                /* scheduleNum로 추천 루트 페이지 이동 **/
              }}
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

export default PlanListPage;
