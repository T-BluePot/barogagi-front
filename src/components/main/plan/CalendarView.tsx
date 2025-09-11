import { format } from "date-fns";

import Calendar from "./Calendar";
import type { CalendarProps } from "./Calendar";

import { SimpleCourseCard } from "./SimpleCourseCard";
import type { Schedule } from "@/types/schedule";

import { formatDateToKorean } from "@/utils/date";

interface CalendarViewProps extends CalendarProps {
  schedules: Schedule[];
  onEdit: (scheduleNum: number) => void;
  onDelete: (scheduleNum: number) => void;
}

export const CalendarView = ({
  schedules,
  onEdit,
  onDelete,
  ...props
}: CalendarViewProps) => {
  // 선택한 날짜에 일정이 있는지
  const selectedDate = props.selectedDate
    ? format(props.selectedDate, "yyyy-MM-dd")
    : "";

  // 일정 여부 필터링
  const filteredSchedules = schedules.filter(
    (schedule) => schedule.date === selectedDate
  );

  return (
    <div className="flex flex-col w-full h-full gap-4 pb-6 bg-gray-5">
      <div className="flex-none">
        <Calendar {...props} />
      </div>
      {props.selectedDate && (
        <div className="flex flex-1 flex-col items-baseline px-6">
          <div className="flex flex-col my-6 gap-3 items-baseline">
            <span className="typo-title-02">
              {formatDateToKorean(props.selectedDate)}
            </span>
            {filteredSchedules.length === 0 && (
              <span className="typo-caption text-gray-80">
                등록된 일정이 없습니다.
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col w-full gap-4">
            {filteredSchedules.map((schedule) => {
              return (
                <SimpleCourseCard
                  key={schedule.scheduleNum}
                  userNum={schedule.userNum}
                  scheduleNum={schedule.scheduleNum}
                  date={schedule.date}
                  scheduleTitle={schedule.scheduleTitle}
                  tags={schedule.tags}
                  onEdit={() => onEdit(schedule.scheduleNum)}
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
