import { format } from "date-fns";

import { CalendarTitle } from "./CalendarTitle";
import Calendar from "./Calendar";
import type { CalendarProps } from "./Calendar";

import { ScheduleCardLite } from "./main/ScheduleCardLite";
import type { Schedule } from "@/types/scheduleTypes";

interface CalendarViewProps extends CalendarProps {
  schedules: Schedule[];
  onClickCard: (scheduleNum: number) => void;
  onDelete: (scheduleNum: number) => void;
}

export const CalendarView = ({
  schedules,
  onClickCard,
  onDelete,
  ...props
}: CalendarViewProps) => {
  // 선택한 날짜에 일정이 있는지
  const selectedDate = props.selectedDate
    ? format(props.selectedDate, "yyyy-MM-dd")
    : "";

  // 해당 날짜 일정 필터링
  const filteredSchedules = schedules.filter(
    (schedule) => schedule.startDate === selectedDate
  );

  // 일정 존재 여부
  const hasSchedules = filteredSchedules.length > 0;

  return (
    <div className="flex flex-col w-full h-full bg-gray-5 overflow-y-auto hide-scrollbar">
      <div className="flex-none">
        <Calendar {...props} />
      </div>
      {props.selectedDate && (
        <div className="flex flex-1 flex-col py-6 items-baseline gap-4">
          <CalendarTitle
            selectedDate={props.selectedDate}
            subTitle={!hasSchedules ? "일정이 없습니다." : undefined}
          />

          <div className="flex flex-1 flex-col w-full px-6 gap-4 hide-scrollbar">
            {filteredSchedules.map((schedule) => {
              return (
                <ScheduleCardLite
                  key={schedule.scheduleNum}
                  schedule={schedule}
                  onClickCard={() => onClickCard(schedule.scheduleNum)}
                  onDelete={() => onDelete(schedule.scheduleNum)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
