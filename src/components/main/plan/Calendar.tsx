import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

import clsx from "clsx";
import { formatDateToKorean } from "@/utils/date";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export interface CalendarProps {
  withTitle?: boolean;
  selectedDate: Date | null;
  onChangeDate: (date: Date | null) => void;
  markedDates?: Record<string, true>;
}

export default function Calendar({
  withTitle = false,
  selectedDate,
  onChangeDate,
  markedDates,
}: CalendarProps) {
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div className="flex flex-col w-full items-baseline gap-8">
      {withTitle && (
        <span className="typo-title-01 text-gray-black">
          {formatDateToKorean(selectedDate)}
        </span>
      )}
      <DatePicker
        locale={ko}
        inline // 캘린더 유지
        dateFormat="yyyy.MM.dd" // 날짜 포맷
        selected={selectedDate} //selectedDate에 저장된 날짜 값을 표시
        onChange={onChangeDate} //날짜 값 변경
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          return (
            <div className="flex h-16 justify-center items-center gap-6">
              <button
                aria-label="이전 달로 이동"
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="cursor-pointer"
              >
                <KeyboardArrowLeftIcon />
              </button>
              <span className="typo-caption text-gray-black">{`${year}년 ${month}월`}</span>
              <button
                aria-label="다음 달로 이동"
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="cursor-pointer"
              >
                <KeyboardArrowRightIcon />
              </button>
            </div>
          );
        }}
        renderDayContents={(day, date) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const dayOfWeek = date.getDay(); // 0: 일요일, 6: 토요일

          // 요일별 Tailwind 색상 클래스 지정
          const colorClass =
            dayOfWeek === 0
              ? "text-red-500"
              : dayOfWeek === 6
              ? "text-blue-500"
              : "text-gray-800";

          // 일정 존재 여부 체크
          const dateKey = format(date, "yyyy-MM-dd");
          const isMarked = markedDates?.[dateKey];

          return (
            <div className="flex flex-col justify-center items-center w-full h-full gap-1">
              <div
                className={clsx(
                  "rounded-full w-10 h-10 flex items-center justify-center",
                  isSelected && "bg-main"
                )}
              >
                <div className="flex flex-col justify-center items-center">
                  <span className={clsx(colorClass)}>{day}</span>
                </div>
              </div>
              <div
                className={clsx(
                  "w-1.5 h-1.5 rounded-full",
                  isMarked ? "bg-alert-red" : "bg-transparent"
                )}
              />
            </div>
          );
        }}
      />
    </div>
  );
}
