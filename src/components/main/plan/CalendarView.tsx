import { format } from "date-fns";

import Calendar from "./Calendar";
import type { CalendarProps } from "./Calendar";

import { SimpleCourseCard } from "./SimpleCourseCard";
import type { Schedule } from "@/types/scheduleTypes";

import { formatDateToKorean } from "@/utils/date";

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

  // 일정 여부 필터링
  const filteredSchedules = schedules.filter(
    (schedule) => schedule.startDate === selectedDate
  );

  return (
    <div className="flex flex-col w-full h-full gap-4 pb-6 bg-gray-5 overflow-y-auto hide-scrollbar">
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
          <div className="flex-1 flex-col w-full pb-6 gap-4 hide-scrollbar">
            {filteredSchedules.map((schedule) => {
              return (
                <SimpleCourseCard
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
